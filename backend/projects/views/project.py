from django.conf import settings
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics, status
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response

from projects.models import Project
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
