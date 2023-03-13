from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from projects.models import DynamicDimension, DimensionMetaData, ProjectDimension
from projects.permissions import IsProjectAdmin, IsProjectStaffAndReadOnly
from projects.serializers import DynamicDimensionSerializer, DimensionMetaDataSerializer, ProjectDimensionSerializer


class DimensionMetaDataList(generics.ListCreateAPIView):
    serializer_class = DimensionMetaDataSerializer
    pagination_class = None
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]

    def get_queryset(self):
        return DimensionMetaData.objects.filter(dimension=self.kwargs["dimension_id"])


class DynamicDimensionList(generics.ListCreateAPIView):
    serializer_class = DynamicDimensionSerializer
    pagination_class = None
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]

    def get_queryset(self):
        return DynamicDimension.objects.all()

    def perform_create(self, serializer):
        serializer.save()


class GetAllDynamicDimensions(generics.ListAPIView):
    serializer_class = DynamicDimensionSerializer
    pagination_class = None
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return DynamicDimension.objects.all()


class AddProjectDimension(generics.CreateAPIView):
    serializer_class = ProjectDimensionSerializer

    def get_queryset(self):
        return ProjectDimension.objects.all()

    def perform_create(self, serializer):
        project_id = self.kwargs["project_id"]
        dimensions = self.request.data.get("dimension", [])

        dimension_objs = DynamicDimension.objects.filter(pk__in=dimensions)
        for dimension in dimension_objs:
            project_dimension = ProjectDimension.objects.create(
                project_id=project_id, dimension=dimension
            )
        return project_dimension
    