from rest_framework import serializers

from .models import QuestionnaireType, Questionnaire, Question, Answer, QuestionnaireState


class QuestionnaireTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionnaireType
        fields = (
            "id",
            "name",
            "description",
        )


class QuestionnaireSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questionnaire
        fields = (
            "id",
            "name",
            "description",
            "questionnaire_type",
            "language",
            "time_of_day",
        )
    

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = (
            "id",
            "question_text",
            "questionnaire",
        )


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = (
            "id",
            "question",
            "answer_text",
            "user",
            "created_at",
            "updated_at",
        )
        read_only_fields = ("user",)


class QuestionnaireStateSerializer(serializers.ModelSerializer):
    class Meta:
        model = QuestionnaireState
        fields = (
            "id",
            "questionnaire",
            "finished_by",
            "finished_at",
        )
        read_only_fields = ("id", "questionnaire", "finished_by", "finished_at")
    