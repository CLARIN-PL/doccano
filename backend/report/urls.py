from django.urls import path, re_path, register_converter

from .views import (
    MemberProgressBetweenStartdateEnddateAPI,
    EachMemberProgressBetweenStartdateEnddateAPI,
    MembersEveningQuestionnaireProgressAPI,
    EachMemberEveningQuestionnaireProgressAPI,
    AverageAnnotationTimeAPI,
    AvgDailyAnnotationTimeAPI,
    DateConverter,
)

register_converter(DateConverter, 'date')

urlpatterns = [
    path(route="member-progress-between-startdate-enddate/<date:startdate>/<date:enddate>/", view=MemberProgressBetweenStartdateEnddateAPI.as_view(), name="member_progress_between_startdate_enddate"),
    path(route="each-member-progress-between-startdate-enddate/<int:user_id>/<date:startdate>/<date:enddate>/", view=EachMemberProgressBetweenStartdateEnddateAPI.as_view(), name="each_member_progress_between_startdate_enddate"),
    path(route="members-evening-questionnaire-progress/<date:startdate>/<date:enddate>/", view=MembersEveningQuestionnaireProgressAPI.as_view(), name="members_evening_questionnaire_progress"),
    path(route="each-member-evening-questionnaire-progress/<int:user_id>/<date:startdate>/<date:enddate>/", view=EachMemberEveningQuestionnaireProgressAPI.as_view(), name="each_member_evening_questionnaire_progress"),
    path(route="average-annotation-time/<int:user_id>/<date:startdate>/<date:enddate>/", view=AverageAnnotationTimeAPI.as_view(), name="average_annotation_time"),
    path(route="avg-daily-annotation-time/<int:user_id>/<date:startdate>/<date:enddate>/", view=AvgDailyAnnotationTimeAPI.as_view(), name="avg_daily_annotation_time"),
]
