from users.tests.utils import make_user
from rest_framework import status
from rest_framework.reverse import reverse

class TestQuestionnaireTypeList():
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
        self.assertEqual(len(response.data), 2)


class TestQuestionnaireList():
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
        self.assertEqual(len(response.data), 3)


class TestQuestionList():
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
        self.assertEqual(len(response.data), 20)


class TestAnswerList():
    @classmethod
    def setUpTestData(cls):
        cls.user = make_user(
            username="bob",
        )
        cls.url = reverse(viewname="answer_list")

    def test_get_answer_list(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_post_answer_list(self):
        self.client.force_authenticate(user=self.user)
        data = {
            "question_id": 1,
            "answer": "test",
        }
        response = self.client.post(self.url, data=data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(len(response.data), 1)
