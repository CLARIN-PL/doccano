from django.urls import path, re_path, register_converter

from .views import (
    MemberProgressBetweenStartdateEnddateAPI,
    EachMemberProgressBetweenStartdateEnddateAPI,
    MembersEveningQuestionnaireProgressAPI,
    EachMemberEveningQuestionnaireProgressAPI,
    AverageAnnotationTimeAPI,
    AllUsersAverageAnnotationTimeAPI,
    AvgDailyAnnotationTimeAPI,
    AvgDailyQuestionnaireTimeAPI,
    AllUsersAvgDailyAnnotationTimeAPI,
    AllUserAvgDailyQuestionnaireTimeAPI,
    UserDailyAvgActiveAnnotationTimeAPI,
    AllUserDailyAvgActiveAnnotationTimeAPI,
    UserAvgSingleTextActiveAnnotationTimeAPI,
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
    path(route="avg-daily-questionnaire-time/<int:user_id>/<date:startdate>/<date:enddate>/", view=AvgDailyQuestionnaireTimeAPI.as_view(), name="avg_daily_questionnaire_time"),
    path(route="all-users-average-annotation-time/<date:startdate>/<date:enddate>/", view=AllUsersAverageAnnotationTimeAPI.as_view(), name="all_users_average_annotation_time"),
    path(route="all-users-avg-daily-annotation-time/<date:startdate>/<date:enddate>/", view=AllUsersAvgDailyAnnotationTimeAPI.as_view(), name="all_users_avg_daily_annotation_time"),
    path(route="all-users-avg-daily-questionnaire-time/<date:startdate>/<date:enddate>/", view=AllUserAvgDailyQuestionnaireTimeAPI.as_view(), name="all_users_avg_daily_questionnaire_time"),
    path(route="user-daily-active-time/<int:user_id>/<date:startdate>/<date:enddate>/", view=UserDailyAvgActiveAnnotationTimeAPI.as_view(), name="user_daily_active_time"),
    path(route="all-users-daily-active-time/<date:startdate>/<date:enddate>/", view=AllUserDailyAvgActiveAnnotationTimeAPI.as_view(), name="all_users_daily_active_time"),
    path(route="user-avg-single-text-active-annotation-time/<int:user_id>/<date:startdate>/<date:enddate>/", view=UserAvgSingleTextActiveAnnotationTimeAPI.as_view(), name="user_avg_single_text_active_annotation_time"),
]
