from django.urls import path

from .views.member import MemberDetail, MemberList, MyRole
from .views.project import ProjectDetail, ProjectList, ProjectProgressDetail
from .views.tag import TagDetail, TagList
from .views.dimension import DimensionMetaDataList, DynamicDimensionList

urlpatterns = [
    path(route="projects", view=ProjectList.as_view(), name="project_list"),
    path(route="projects/<int:project_id>", view=ProjectDetail.as_view(), name="project_detail"),
    path(route="projects/progress", view=ProjectProgressDetail.as_view(), name="project_progress_detail"),
    path(route="projects/<int:project_id>/my-role", view=MyRole.as_view(), name="my_role"),
    path(route="projects/<int:project_id>/tags", view=TagList.as_view(), name="tag_list"),
    path(route="projects/<int:project_id>/tags/<int:tag_id>", view=TagDetail.as_view(), name="tag_detail"),
    path(route="projects/<int:project_id>/members", view=MemberList.as_view(), name="member_list"),
    path(route="projects/<int:project_id>/members/<int:member_id>", view=MemberDetail.as_view(), name="member_detail"),
    path(route="projects/dimensions/<int:dimension_id>/metadata", view=DimensionMetaDataList.as_view(), name="dimension_metadata_list"),
    path(route="projects/<int:project_id>/dimensions", view=DynamicDimensionList.as_view(), name="dynamic_dimension_list"),
]
