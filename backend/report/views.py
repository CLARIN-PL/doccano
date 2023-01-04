import pandas as pd
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from examples.models import Example, ExampleState, ExampleAnnotateStartState
from questionnaires.models import QuestionnaireState, Answer
from datetime import datetime

from projects.permissions import IsProjectAdmin, IsProjectStaffAndReadOnly
from django.contrib.auth.models import User


class DateConverter:
    regex = '\d{4}-\d{1,2}-\d{1,2}'
    format = '%Y-%m-%d'

    def to_python(self, value):
        return datetime.strptime(value, self.format).date()

    def to_url(self, value):
        return value.strftime(self.format)


class MemberProgressBetweenStartdateEnddateAPI(APIView):
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]     

    def get(self, request, *args, **kwargs):
        all_users = User.objects.all().values_list('id', flat=True)
        print(all_users)
        startdate = self.kwargs["startdate"]
        enddate = self.kwargs["enddate"]
        print(startdate, enddate)
        data = ExampleState.objects.measure_member_confirmed_examples_between_startdate_enddate(all_users, startdate, enddate)
        return Response(data=data, status=status.HTTP_200_OK)


class EachMemberProgressBetweenStartdateEnddateAPI(APIView):
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]     

    def get(self, request, *args, **kwargs):
        requested_user = self.kwargs["user_id"]
        startdate = self.kwargs["startdate"]
        enddate = self.kwargs["enddate"]
        data = ExampleState.objects.measure_member_confirmed_examples_between_startdate_enddate([requested_user], startdate, enddate)
        return Response(data=data, status=status.HTTP_200_OK)


class MembersEveningQuestionnaireProgressAPI(APIView):
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]     

    def get(self, request, *args, **kwargs):
        all_users = User.objects.all().values_list('id', flat=True)
        startdate = self.kwargs["startdate"]
        enddate = self.kwargs["enddate"]
        data = QuestionnaireState.objects.count_all_users_evening_questionnaire_done(all_users, startdate, enddate)
        return Response(data=data, status=status.HTTP_200_OK)


class EachMemberEveningQuestionnaireProgressAPI(APIView):
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]     

    def get(self, request, *args, **kwargs):
        requested_user = self.kwargs["user_id"]
        startdate = self.kwargs["startdate"]
        enddate = self.kwargs["enddate"]
        data = QuestionnaireState.objects.count_all_users_evening_questionnaire_done([requested_user], startdate, enddate)
        return Response(data=data, status=status.HTTP_200_OK)


class AverageAnnotationTimeAPI(APIView):
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]     

    def get(self, request, *args, **kwargs):
        requested_user = self.kwargs["user_id"]
        startdate = self.kwargs["startdate"]
        enddate = self.kwargs["enddate"]
        confirmed_examples_by_user = ExampleState.objects.get_confirmed_time_by_example([requested_user], startdate, enddate)
        print(confirmed_examples_by_user[0])
        all_annotation_time = []
        for example in confirmed_examples_by_user:
            started_examples_by_user = ExampleAnnotateStartState.objects.get_started_time_by_example(example['example_id'], [requested_user], startdate, enddate)
            annotation_time  = example["confirmed_at"] - started_examples_by_user[0]['started_at']
            all_annotation_time.append(annotation_time.seconds)
        if len(all_annotation_time) == 0:
            return Response(data={"average_annotation_time (seconds)": 0}, status=status.HTTP_200_OK)
        else:
            average_annotation_time = sum(all_annotation_time) / len(all_annotation_time)
            data = {"average_annotation_time (seconds)": average_annotation_time}
            return Response(data=data, status=status.HTTP_200_OK)


class AvgDailyAnnotationTimeAPI(APIView):
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]     

    def get(self, request, *args, **kwargs):
        requested_user = self.kwargs["user_id"]
        startdate = self.kwargs["startdate"]
        enddate = self.kwargs["enddate"]
        confirmed_examples_by_user = ExampleState.objects.get_confirmed_time_by_example([requested_user], startdate, enddate)
        confirmed_df = pd.DataFrame(confirmed_examples_by_user)
        confirmed_df['Date'] = confirmed_df['confirmed_at'].dt.strftime('%Y-%m-%d')
        confirmed_df = confirmed_df.sort_values('confirmed_at').drop_duplicates(['Date'], keep='last')
        requested_dates = confirmed_df['Date'].tolist()
        all_started_data = []
        for date in requested_dates:
            started_annotation = ExampleAnnotateStartState.objects.get_earliest_started_time_by_date([requested_user], date)
            all_started_data.extend(started_annotation)
        started_df = pd.DataFrame(all_started_data)
        started_df['Date'] = started_df['started_at'].dt.strftime('%Y-%m-%d')
        started_df = started_df.drop_duplicates(['Date'], keep='first')
        confirm_time_daily = confirmed_df.confirmed_at.to_list()
        started_time_daily = started_df.started_at.to_list()
        daily_annotation_time = [(cf - st).seconds for cf, st in zip(confirm_time_daily, started_time_daily)]
        annotation_time_per_day = [{"date": date, "annotation_time (seconds)": time} for date, time in zip(requested_dates, daily_annotation_time)]
        if len(daily_annotation_time) == 0:
            return Response(data={"average_daily_annotation_time (seconds)": 0}, status=status.HTTP_200_OK)
        else:
            average_daily_annotation_time = sum(daily_annotation_time) / len(daily_annotation_time)
            data = {"average_daily_annotation_time (seconds)": average_daily_annotation_time, "annotation_time_per_day": annotation_time_per_day}
            return Response(data=data, status=status.HTTP_200_OK)

    
class AvgDailyQuestionnaireTimeAPI(APIView):
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]     

    def get(self, request, *args, **kwargs):
        requested_user = self.kwargs["user_id"]
        startdate = self.kwargs["startdate"]
        enddate = self.kwargs["enddate"]
        data = {}
        finished_questionnaires_by_user = QuestionnaireState.objects.get_finished_time_by_questionnaire([requested_user], startdate, enddate)
        if len(finished_questionnaires_by_user) == 0:
            return Response(data={"average_daily_questionnaire_time (seconds)": 0}, status=status.HTTP_200_OK)
        else:
            finished_quetionnaires_df = pd.DataFrame(finished_questionnaires_by_user)
            finished_quetionnaires_df['Date'] = finished_quetionnaires_df['finished_at'].dt.strftime('%Y-%m-%d')
            finished_questionnaire_dates = list(finished_quetionnaires_df.Date.unique())
            period_questionnaire_time = []
            for date in finished_questionnaire_dates:
                list_finished_questionnaire_ids = finished_quetionnaires_df[finished_quetionnaires_df['Date'] == date]['questionnaire_id'].tolist()
                answered_questionnaires_by_user = Answer.objects.get_answers_time_by_user_in_given_period(list_finished_questionnaire_ids, requested_user, date=date)
                if len(answered_questionnaires_by_user) == 0:
                    return Response(data={"average_daily_questionnaire_time (seconds)": 0}, status=status.HTTP_200_OK)
                else:
                    answered_questionnaire_df = pd.DataFrame(answered_questionnaires_by_user).sort_values('created_at')
                    answered_questionnaire_df = answered_questionnaire_df.drop_duplicates(['question_id__questionnaire_id'], keep='first')
                    start_time_list = answered_questionnaire_df.created_at.to_list()
                    finish_time_list = finished_quetionnaires_df[finished_quetionnaires_df['Date'] == date].finished_at.to_list()
                    time_diff_list = [(fn - st).seconds for fn, st in zip(finish_time_list, start_time_list)]
                    questionaire_time_per_day = {"date": date, "total_time (seconds)": sum(time_diff_list)}
                    period_questionnaire_time.append(questionaire_time_per_day)

        if len(period_questionnaire_time) == 0:
            return Response(data={"average_daily_questionnaire_time (seconds)": 0}, status=status.HTTP_200_OK)
        else:
            average_daily_questionnaire_time = sum([i['total_time (seconds)'] for i in period_questionnaire_time]) / len(period_questionnaire_time)
            data = {"average_daily_questionnaire_time (seconds)": average_daily_questionnaire_time, "daily_questionnaire_time": period_questionnaire_time}
            return Response(data=data, status=status.HTTP_200_OK)
