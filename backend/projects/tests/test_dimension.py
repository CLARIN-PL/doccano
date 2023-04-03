from rest_framework import status
from rest_framework.reverse import reverse

from api.tests.utils import CRUDMixin
from projects.tests.utils import make_dimension, make_dimension_meta_data, make_project_dimension, prepare_project
from users.tests.utils import make_user


class TestDimension(CRUDMixin):
    @classmethod
    def setUpTestData(cls):
        cls.project = prepare_project(task="DynamicAnnotation")
        cls.non_member = make_user()
        cls.url = reverse(viewname="dynamic_dimension_list", args=[cls.project.item.id])
        cls.data = {
            "name": "example_dimension",
            "type": "slider",
            "dimension_meta_data": [
                {
                    "codename": "DIM_NEW_EMO_0123",
                    "config": {"slider_min": 0, "slider_max": 100, "slider_step": 10, "with_checkbox": False, "minVal_description": "Wcale", "maxVal_description": "W pełni"},
                    "required": True,
                    "readonly": False
                }
            ]
        }

    def test_allows_admin_to_create_dimension(self):
        response = self.assert_create(self.project.admin, status.HTTP_201_CREATED)
        self.assertEqual(response.data["name"], self.data["name"])
        self.assertEqual(response.data["type"], self.data["type"])
        self.assertEqual(response.data["dimension_meta_data"][0]["codename"], self.data["dimension_meta_data"][0]["codename"])

    def test_denies_project_staff_to_create_dimension(self):
        for member in self.project.staffs:
            self.assert_create(member, status.HTTP_403_FORBIDDEN)

    def test_denies_unauthenticated_user_to_create_dimension(self):
        self.assert_create(expected=status.HTTP_403_FORBIDDEN)

    def test_return_all_dimensions_to_member(self):
        # should return 69 default dims
        for member in self.project.members:
            response = self.assert_fetch(member, status.HTTP_200_OK)
            self.assertEqual(len(response.data), 69)
        # should return 70 dims, which are 69 default dims and 1 created dim
        self.assert_create(self.project.admin, status.HTTP_201_CREATED)
        for member in self.project.members:
            response = self.assert_fetch(member, status.HTTP_200_OK)
            self.assertEqual(len(response.data), 70)


class TestProjectDimensionList(CRUDMixin):
    @classmethod
    def setUpTestData(cls):
        cls.project = prepare_project(task="DynamicAnnotation")
        cls.non_member = make_user()
        cls.dynamic_dimension = make_dimension()
        make_project_dimension(project=cls.project.item, dimension=cls.dynamic_dimension)
        cls.url = reverse(viewname="project_dimension_detail", args=[cls.project.item.id])

    def test_return_dimensions_to_member(self):
        for member in self.project.members:
            response = self.assert_fetch(member, status.HTTP_200_OK)
            self.assertEqual(len(response.data), 1)

    def test_does_not_return_dimensions_to_non_member(self):
        self.assert_fetch(self.non_member, status.HTTP_403_FORBIDDEN)

    def test_does_not_return_dimensions_to_unauthenticated_user(self):
        self.assert_fetch(expected=status.HTTP_403_FORBIDDEN)


class TestDimensionMetaDataList(CRUDMixin):
    @classmethod
    def setUpTestData(cls):
        cls.project = prepare_project(task="DynamicAnnotation")
        cls.non_member = make_user()
        cls.dynamic_dimension = make_dimension()
        make_dimension_meta_data(dimension=cls.dynamic_dimension)
        cls.url = reverse(viewname="dimension_metadata_list", args=[cls.dynamic_dimension.id])

    def test_return_dimension_meta_data_to_member(self):
        for member in self.project.members:
            response = self.assert_fetch(member, status.HTTP_200_OK)
            self.assertEqual(len(response.data), 1)

    def test_does_not_return_dimension_meta_data_to_unauthenticated_user(self):
        self.assert_fetch(expected=status.HTTP_403_FORBIDDEN)


class TestAssignProjectDimensions(CRUDMixin):
    @classmethod
    def setUpTestData(cls):
        cls.project = prepare_project(task="DynamicAnnotation")
        cls.non_member = make_user()
        cls.url = reverse(viewname="add_project_dimension", args=[cls.project.item.id])
        cls.data = {
            "dimension": [1, 2, 3]
        }

    def test_allows_admin_to_assign_dimension(self):
        response = self.assert_create(self.project.admin, status.HTTP_201_CREATED)
        self.assertEqual(response.data["dimension"], self.data["dimension"])

    def test_denies_project_staff_to_assign_dimension(self):
        for member in self.project.staffs:
            self.assert_create(member, status.HTTP_403_FORBIDDEN)

    def test_denies_unauthenticated_user_to_assign_dimension(self):
        self.assert_create(expected=status.HTTP_403_FORBIDDEN)
