from django_filters.rest_framework import DjangoFilterBackend

from .serializers import QuestionnaireTypeSerializer, QuestionnaireSerializer, QuestionSerializer, AnswerSerializer
from .models import QuestionnaireType, Questionnaire, Question, Answer
from rest_framework import filters, generics
from rest_framework.permissions import IsAuthenticated
from projects.permissions import IsProjectAdmin, IsProjectStaffAndReadOnly, IsProjectMember

from datetime import date


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
        queryset = self.model.objects.filter(questionnaire=self.kwargs["questionnaire_id"])
        return queryset


class AnswerListAPI(generics.ListCreateAPIView):
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]
    model = Answer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["question", "user"]
    ordering_fields = ["created_at", "updated_at"]

    def get_queryset(self):
        today = date.today()
        queryset = self.model.objects.filter(question=self.kwargs["question_id"], user=self.request.user, created_at__year=today.year, created_at__month=today.month, created_at__day=today.day)
        return queryset

    def perform_create(self, serializer):
        queryset = self.get_queryset()
        if queryset.exists():
            queryset.update(answer_text=self.request.data["answer_text"])
        else:
            serializer.save(user=self.request.user)


class AnswersPerQuestionnaireListAPI(generics.ListAPIView):
    serializer_class = AnswerSerializer
    permission_classes = [IsAuthenticated]
    model = Answer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ["question__questionnaire", "user"]
    ordering_fields = ["created_at", "updated_at"]

    def get_queryset(self):
        questionnaire_id = self.kwargs["questionnaire_id"]
        list_of_questions = Question.objects.filter(questionnaire=questionnaire_id)
        queryset = self.model.objects.filter(question__in=list_of_questions, user=self.request.user).order_by("-created_at")
        return queryset
