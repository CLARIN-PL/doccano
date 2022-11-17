from django.db import models


class QuestionnaireType(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name


class Questionnaire(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    questionaire_type = models.ForeignKey(QuestionnaireType, on_delete=models.CASCADE)
    language = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Question(models.Model):
    question_text = models.CharField(max_length=1024)
    questionaire = models.ForeignKey(Questionnaire, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.question_text
        