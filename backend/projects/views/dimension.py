from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from projects.models import DynamicDimension, DimensionMetaData
from projects.permissions import IsProjectAdmin, IsProjectStaffAndReadOnly
from projects.serializers import DynamicDimensionSerializer, DimensionMetaDataSerializer


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
