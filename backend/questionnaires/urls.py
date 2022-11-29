from django.urls import path

from .views import (
    QuestionnaireTypeListAPI,
    QuestionnaireListAPI,
    QuestionListAPI,
    AnswerListAPI,
    AnswersPerQuestionnaireListAPI,
)

urlpatterns = [
    path(route="questionnaire_types", view=QuestionnaireTypeListAPI.as_view(), name="questionnaire_type_list"),
    path(route="questionnaires/<int:questionnaire_type_id>", view=QuestionnaireListAPI.as_view(), name="questionnaire_list"),
    path(route="questionnaires/<int:questionnaire_id>/questions", view=QuestionListAPI.as_view(), name="question_list"),
    path(route="answers/<int:question_id>", view=AnswerListAPI.as_view(), name="answer_list"),
    path(route="answers/questionnaire/<int:questionnaire_id>", view=AnswersPerQuestionnaireListAPI.as_view(), name="answers_per_questionnaire_list"),
]
