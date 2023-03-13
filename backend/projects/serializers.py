from rest_framework import serializers
from rest_polymorphic.serializers import PolymorphicSerializer

from .models import (
    ImageClassificationProject,
    IntentDetectionAndSlotFillingProject,
    Member,
    Project,
    Seq2seqProject,
    SequenceLabelingProject,
    Speech2textProject,
    Tag,
    TextClassificationProject,
    ArticleAnnotationProject,
    AffectiveAnnotationProject,
    DynamicAnnotationProject,
    ProjectDimension,
    DynamicDimension,
    DimensionMetaData,
)

from label_types.models import ScaleType

class MemberSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    rolename = serializers.SerializerMethodField()

    @classmethod
    def get_username(cls, instance):
        user = instance.user
        return user.username if user else None

    @classmethod
    def get_rolename(cls, instance):
        role = instance.role
        return role.name if role else None

    class Meta:
        model = Member
        fields = ("id", "user", "role", "username", "rolename")


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = (
            "id",
            "project",
            "text",
        )
        read_only_fields = ("id", "project")


class ProjectDimensionSerializer(serializers.ModelSerializer):
    dimension = serializers.PrimaryKeyRelatedField(
        queryset=DynamicDimension.objects.all(), many=True)
    project = serializers.SerializerMethodField()

    def get_project(self, instance):
        return (self.context['view'].kwargs.get('project_id'))

    class Meta:
        model = ProjectDimension
        fields = (
            "id",
            "project",
            "dimension",
        )
        read_only_fields = ("id", "project")


class DimensionMetaDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = DimensionMetaData
        fields = (
            "id",
            "dimension",
            "codename",
            "config",
            "required",
            "readonly",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "dimension", "created_at", "updated_at")
      

class DynamicDimensionSerializer(serializers.ModelSerializer):
    dimension_meta_data = DimensionMetaDataSerializer(required=True, many=True)
    
    class Meta:
        model = DynamicDimension
        fields = (
            "id",
            "name",
            "type",
            "dimension_meta_data",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("id", "created_at", "updated_at")

    def create(self, validated_data):
        dimension_meta_data = validated_data.pop("dimension_meta_data")
        dimension = self.Meta.model.objects.create(**validated_data)
        metadata = DimensionMetaData.objects.create(dimension=dimension, **dimension_meta_data[0])
        project_id = self.context['view'].kwargs.get('project_id')
        current_project = Project.objects.get(id=project_id)
        ProjectDimension.objects.create(project=current_project, dimension=dimension)
        if dimension.type == "slider":
            ScaleType.objects.create(text=dimension.name, project=current_project)
        return dimension


class ProjectSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, required=False)

    class Meta:
        model = Project
        fields = [
            "id",
            "name",
            "description",
            "guideline",
            "project_type",
            "updated_at",
            "random_order",
            "created_by",
            "collaborative_annotation",
            "single_class_classification",
            "is_text_project",
            "can_define_label",
            "can_define_relation",
            "can_define_category",
            "can_define_span",
            "tags",
        ]
        read_only_fields = (
            "updated_at",
            "is_text_project",
            "can_define_label",
            "can_define_relation",
            "can_define_category",
            "can_define_span",
        )

    def create(self, validated_data):
        tags = TagSerializer(data=validated_data.pop("tags", []), many=True)
        project = self.Meta.model.objects.create(**validated_data)
        tags.is_valid()
        tags.save(project=project)
        return project

    def update(self, instance, validated_data):
        # Don't update tags. Please use TagAPI.
        validated_data.pop("tags", None)
        return super().update(instance, validated_data)


class TextClassificationProjectSerializer(ProjectSerializer):
    class Meta(ProjectSerializer.Meta):
        model = TextClassificationProject


class SequenceLabelingProjectSerializer(ProjectSerializer):
    class Meta(ProjectSerializer.Meta):
        model = SequenceLabelingProject
        fields = ProjectSerializer.Meta.fields + ["allow_overlapping", "grapheme_mode", "use_relation"]


class Seq2seqProjectSerializer(ProjectSerializer):
    class Meta(ProjectSerializer.Meta):
        model = Seq2seqProject


class IntentDetectionAndSlotFillingProjectSerializer(ProjectSerializer):
    class Meta(ProjectSerializer.Meta):
        model = IntentDetectionAndSlotFillingProject


class Speech2textProjectSerializer(ProjectSerializer):
    class Meta(ProjectSerializer.Meta):
        model = Speech2textProject


class ImageClassificationProjectSerializer(ProjectSerializer):
    class Meta(ProjectSerializer.Meta):
        model = ImageClassificationProject


class ArticleAnnotationProjectSerializer(ProjectSerializer):
    class Meta(ProjectSerializer.Meta):
        model = ArticleAnnotationProject
        fields = ProjectSerializer.Meta.fields + ["allow_overlapping", "grapheme_mode", "use_relation"]


class AffectiveAnnotationProjectSerializer(ProjectSerializer):
    class Meta(ProjectSerializer.Meta):
        model = AffectiveAnnotationProject
        fields = ProjectSerializer.Meta.fields + ["allow_overlapping", "grapheme_mode", "use_relation", "is_summary_mode", "is_emotions_mode", "is_offensive_mode", "is_humor_mode", "is_others_mode", "is_single_ann_view", "is_combination_mode"]


class DynamicAnnotationProjectSerializer(ProjectSerializer):
    dimension = ProjectDimensionSerializer(many=True, required=False)

    class Meta(ProjectSerializer.Meta):
        model = DynamicAnnotationProject
        fields = ProjectSerializer.Meta.fields + ["allow_overlapping", "grapheme_mode", "use_relation", "is_summary_mode", "is_emotions_mode", "is_offensive_mode", "is_humor_mode", "is_others_mode", "is_single_ann_view", "is_combination_mode", "dimension"]

    def create(self, validated_data):
        dimensions_data = validated_data.pop('dimension')
        project = self.Meta.model.objects.create(**validated_data)
        for dimension_data in dimensions_data:
            dimension = dimension_data['dimension'][0]
            project_dimension = ProjectDimension.objects.create(project=project, dimension=dimension)
        return project


class ProjectPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        Project: ProjectSerializer,
        **{cls.Meta.model: cls for cls in ProjectSerializer.__subclasses__()},
    }
