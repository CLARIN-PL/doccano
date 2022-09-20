import random

from django.db.models import F, Count
from django.shortcuts import get_object_or_404
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from examples.filters import ExampleFilter
from examples.models import Example
from examples.serializers import ExampleSerializer, ExampleArticleIdSerializer
from projects.models import Project
from projects.permissions import IsProjectAdmin, IsProjectStaffAndReadOnly


class ExampleList(generics.ListCreateAPIView):
    serializer_class = ExampleSerializer
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]
    filter_backends = (DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter)
    ordering_fields = ("created_at", "updated_at")
    search_fields = ("text", "filename", "article_id")
    model = Example
    filter_class = ExampleFilter

    @property
    def project(self):
        return get_object_or_404(Project, pk=self.kwargs["project_id"])

    def get_queryset(self):
        queryset = self.model.objects.filter(project=self.project)
        if self.project.random_order:
            # Todo: fix the algorithm.
            random.seed(self.request.user.id)
            value = random.randrange(2, 20)
            queryset = queryset.annotate(sort_id=F("id") % value).order_by("sort_id", "id")
        else:
            if self.project.is_article_project:
                queryset = queryset.order_by("article_id", "order")
            else:
                queryset = queryset.order_by("created_at")
        return queryset

    def perform_create(self, serializer):
        serializer.save(project=self.project)

    def delete(self, request, *args, **kwargs):
        queryset = self.project.examples
        delete_ids = request.data["ids"]
        if delete_ids:
            queryset.filter(pk__in=delete_ids).delete()
        else:
            queryset.all().delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class ExampleArticleIdList(generics.ListCreateAPIView):
    serializer_class = ExampleArticleIdSerializer
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]
    filter_backends = (DjangoFilterBackend, filters.OrderingFilter)
    ordering_fields = ("article_id", "order")
    model = Example

    @property
    def project(self):
        return get_object_or_404(Project, pk=self.kwargs["project_id"])

    def get_queryset(self):
        queryset = self.model.objects.filter(project=self.project).order_by()
        queryset = queryset.values_list("id", "article_id")
        queryset = queryset.values("article_id").distinct().order_by("article_id")
        return queryset


class ExampleDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Example.objects.all()
    serializer_class = ExampleSerializer
    lookup_url_kwarg = "example_id"
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]
