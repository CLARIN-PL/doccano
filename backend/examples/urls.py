from django.urls import path

from .views.example import ExampleArticleIdList
from .views.comment import CommentDetail, CommentList
from .views.example import ExampleDetail, ExampleList
from .views.example_state import ExampleStateList, ExampleAnnotateStartStateList

urlpatterns = [
    path(route="examples", view=ExampleList.as_view(), name="example_list"),
    path(route="examples/<int:example_id>", view=ExampleDetail.as_view(), name="example_detail"),
    path(route="comments", view=CommentList.as_view(), name="comment_list"),
    path(route="comments/<int:comment_id>", view=CommentDetail.as_view(), name="comment_detail"),
    path(route="examples/<int:example_id>/states", view=ExampleStateList.as_view(), name="example_state_list"),
    path(route="examples/<int:example_id>/annotate_start_states", view=ExampleAnnotateStartStateList.as_view(), name="example_annotate_start_state_list"),
    path(route="article_ids", view=ExampleArticleIdList.as_view(), name="article_id_list"),
]
