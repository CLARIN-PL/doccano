from django_filters.rest_framework import DjangoFilterBackend

from .serializers import QuestionnaireTypeSerializer, QuestionnaireSerializer, QuestionSerializer, AnswerSerializer
from .models import QuestionnaireType, Questionnaire, Question, Answer
from rest_framework import filters, generics
from rest_framework.permissions import IsAuthenticated
from projects.permissions import IsProjectAdmin, IsProjectStaffAndReadOnly


class QuestionnaireTypeListAPI(generics.ListAPIView):
    queryset = QuestionnaireType.objects.all()
    serializer_class = QuestionnaireTypeSerializer
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]

    
class QuestionnaireListAPI(generics.ListAPIView):
    serializer_class = QuestionnaireSerializer
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]
    model = Questionnaire

    def get_queryset(self):
        queryset = self.model.objects.filter(questionnaire_type=self.kwargs['questionnaire_type_id'])
        return queryset


class QuestionListAPI(generics.ListAPIView):
    serializer_class = QuestionSerializer
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]
    model = Question
    
    def get_queryset(self):
        print(self.kwargs)
        queryset = self.model.objects.filter(questionnaire=self.kwargs["questionnaire_id"])
        return queryset


class AnswerListAPI(generics.ListCreateAPIView):
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]
    model = Answer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["question", "user"]
    ordering_fields = ["created_at", "updated_at"]

    def get_queryset(self):
        queryset = self.model.objects.filter(user=self.request.user)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
