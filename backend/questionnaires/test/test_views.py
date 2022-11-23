from users.tests.utils import make_user
from rest_framework import status
from rest_framework.reverse import reverse
from api.tests.utils import CRUDMixin
from .utils import make_answer


class TestQuestionnaireTypeList(CRUDMixin):
    @classmethod
    def setUpTestData(cls):
        cls.user = make_user(
            username="bob",
        )
        cls.url = reverse(viewname="questionnaire_type_list")

    def test_get_questionnaire_type_list(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 6)


class TestQuestionnaireList(CRUDMixin):
    @classmethod
    def setUpTestData(cls):
        cls.user = make_user(
            username="bob",
        )
        cls.url = reverse(viewname="questionnaire_list", kwargs={"questionnaire_type_id": 1})

    def test_get_questionnaire_list(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 3)


class TestQuestionList(CRUDMixin):
    @classmethod
    def setUpTestData(cls):
        cls.user = make_user(
            username="bob",
        )
        cls.url = reverse(viewname="question_list", kwargs={"questionnaire_id": 1})
    
    def test_get_question_list(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 20)


class TestAnswerList(CRUDMixin):
    @classmethod
    def setUpTestData(cls):
        cls.user = make_user(
            username="bob",
        )
        cls.answer = make_answer(question=1, user=cls.user, answer_text="test")
        cls.url = reverse(viewname="answer_list")

    def test_get_answer_list(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)

    def test_post_answer_list(self):
        self.client.force_authenticate(user=self.user)
        data = {
            "question": 1,
            "answer_text": "thanks god it's Friday",
        }
        response = self.client.post(self.url, data=data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['answer_text'], data['answer_text'])
        self.assertEqual(response.data['user'], self.user.id)
        self.assertEqual(response.data['question'], data['question'])
