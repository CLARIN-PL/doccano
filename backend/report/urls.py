from django.urls import path, re_path, register_converter

from .views import (
    MemberProgressBetweenStartdateEnddateAPI,
    EachMemberProgressBetweenStartdateEnddateAPI,
    DateConverter,
)

register_converter(DateConverter, 'date')

urlpatterns = [
    path(route="member-progress-between-startdate-enddate/<date:startdate>/<date:enddate>/", view=MemberProgressBetweenStartdateEnddateAPI.as_view(), name="member_progress_between_startdate_enddate"),
    path(route="each-member-progress-between-startdate-enddate/<int:user_id>/<date:startdate>/<date:enddate>/", view=EachMemberProgressBetweenStartdateEnddateAPI.as_view(), name="each_member_progress_between_startdate_enddate"),
]
