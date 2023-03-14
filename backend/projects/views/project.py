from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics, status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from projects.models import Project, ProjectDimension, DynamicDimension, DimensionMetaData
from projects.permissions import IsProjectAdmin, IsProjectStaffAndReadOnly
from projects.serializers import ProjectPolymorphicSerializer

from examples.models import Example, ExampleState


class ProjectList(generics.ListCreateAPIView):
    serializer_class = ProjectPolymorphicSerializer
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    search_fields = ("name", "description")

    def get_permissions(self):
        if self.request.method == "GET":
            self.permission_classes = [
                IsAuthenticated,
            ]
        else:
            self.permission_classes = [IsAuthenticated & IsAdminUser]
        return super().get_permissions()

    def get_queryset(self):
        return Project.objects.filter(role_mappings__user=self.request.user).order_by("created_at")

    def perform_create(self, serializer):
        project = serializer.save(created_by=self.request.user)
        project.add_admin()

    def delete(self, request, *args, **kwargs):
        delete_ids = request.data["ids"]
        projects = Project.objects.filter(
            role_mappings__user=self.request.user,
            role_mappings__role__name=settings.ROLE_PROJECT_ADMIN,
            pk__in=delete_ids,
        )
        # Todo: I want to use bulk delete.
        # But it causes the constraint error.
        # See https://github.com/django-polymorphic/django-polymorphic/issues/229
        for project in projects:
            project.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProjectDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Project.objects.all()
    serializer_class = ProjectPolymorphicSerializer
    lookup_url_kwarg = "project_id"
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]


class ProjectProgressDetail(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]

    def get(self, request, *args, **kwargs):
        all_projects = Project.objects.filter(role_mappings__user=self.request.user).order_by("created_at")
        all_project_data = []
        for project in all_projects:
            examples = Example.objects.filter(project=project.id).values("id")
            total = examples.count()
            if project.collaborative_annotation:
                complete = ExampleState.objects.count_done(examples)
            else:
                complete = ExampleState.objects.count_done(examples, user=self.request.user)
            data = {"project_id": project.id, "total": total, "remaining": total - complete, "complete": complete}
            all_project_data.append(data)
        final_data = {"count": len(all_project_data), "results": all_project_data}
        return Response(data=final_data, status=status.HTTP_200_OK)


class ProjectDimensionDetail(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]

    def get(self, request, *args, **kwargs):
        final_data = []
        project_dims = ProjectDimension.objects.filter(project=self.kwargs["project_id"])
        for project_dim in project_dims:
            dim = DynamicDimension.objects.get(pk=project_dim.dimension.id)
            dim_metadata_raws = DimensionMetaData.objects.filter(dimension=project_dim.dimension.id)
            dim_metadata = []
            for dim_metadata_raw in dim_metadata_raws:
                if "with_checkbox" in dim_metadata_raw.config.keys():
                    dim_metadata_raw.config['with_checkbox'] = bool(dim_metadata_raw.config['with_checkbox'])
                if "is_multiple_answers" in dim_metadata_raw.config.keys():
                    dim_metadata_raw.config['is_multiple_answers'] = bool(dim_metadata_raw.config['is_multiple_answers'])
                dim_metadata.append({"codename": dim_metadata_raw.codename, "config": dim_metadata_raw.config, "required": dim_metadata_raw.required, "readonly": dim_metadata_raw.readonly})
            data = {"dimension_id": dim.id, "dimension_name": dim.name, "dimension_type": dim.type, "dimension_metadata": dim_metadata}
            final_data.append(data)
        return Response(data=final_data, status=status.HTTP_200_OK)
