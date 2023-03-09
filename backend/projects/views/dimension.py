from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from projects.models import ProjectDimension, DynamicDimension, DimensionMetaData
from projects.permissions import IsProjectAdmin, IsProjectStaffAndReadOnly
from projects.serializers import ProjectDimensionSerializer, DynamicDimensionSerializer, DimensionMetaDataSerializer


# class ProjectDimensionList(generics.ListCreateAPIView):
#     serializer_class = ProjectDimensionSerializer
#     pagination_class = None
#     permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]

#     def get_queryset(self):
#         return ProjectDimension.objects.filter(project=self.kwargs["project_id"])

#     def perform_create(self, serializer):
#         serializer.save(project_id=self.kwargs["project_id"])

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
