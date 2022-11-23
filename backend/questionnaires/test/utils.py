from model_mommy import mommy
from questionnaires.models import Question


def make_answer(question, user, answer_text):
    return mommy.make("Answer", question=Question(id=question), user=user, answer_text=answer_text)
    