from django.shortcuts import render
from .serializers import QuestionnaireTypeSerializer, QuestionnaireSerializer, QuestionSerializer, AnswerSerializer
from rest_framework import generics
from .models import QuestionnaireType, Questionnaire, Question, Answer

class QuestionnaireTypeList(generics.ListCreateAPIView):
    queryset = QuestionnaireType.objects.all()
    serializer_class = QuestionnaireTypeSerializer