from django.db import models
from django.contrib.auth.models import User


class QuestionnaireType(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name


class Questionnaire(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    questionnaire_type = models.ForeignKey(QuestionnaireType, on_delete=models.CASCADE)
    language = models.CharField(max_length=100)
    time_of_day = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Question(models.Model):
    question_text = models.CharField(max_length=1024)
    questionnaire = models.ForeignKey(Questionnaire, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.question_text


class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    answer_text = models.CharField(max_length=1024)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)


class QuestionnaireState(models.Model):
    questionnaire = models.ForeignKey(Questionnaire, on_delete=models.CASCADE, related_name="questionnaire_state")
    finished_by = models.ForeignKey(User, on_delete=models.CASCADE)
    finished_at = models.DateTimeField(auto_now=True)
    