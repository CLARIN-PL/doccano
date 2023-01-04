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
        startdate = self.kwargs["startdate"]
        enddate = self.kwargs["enddate"]
        data = ExampleState.objects.measure_total_confirmed_examples_between_startdate_enddate(startdate, enddate)
        return Response(data=data, status=status.HTTP_200_OK)


class EachMemberProgressBetweenStartdateEnddateAPI(APIView):
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]     

    def get(self, request, *args, **kwargs):
        requested_user = self.kwargs["user_id"]
        startdate = self.kwargs["startdate"]
        enddate = self.kwargs["enddate"]
        data = ExampleState.objects.measure_member_confirmed_examples_between_startdate_enddate(requested_user, startdate, enddate)
        return Response(data=data, status=status.HTTP_200_OK)


class MembersEveningQuestionnaireProgressAPI(APIView):
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]     

    def get(self, request, *args, **kwargs):
        startdate = self.kwargs["startdate"]
        enddate = self.kwargs["enddate"]
        data = QuestionnaireState.objects.count_total_evening_questionnaire_done(startdate, enddate)
        return Response(data=data, status=status.HTTP_200_OK)


class EachMemberEveningQuestionnaireProgressAPI(APIView):
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]     

    def get(self, request, *args, **kwargs):
        requested_user = self.kwargs["user_id"]
        startdate = self.kwargs["startdate"]
        enddate = self.kwargs["enddate"]
        data = QuestionnaireState.objects.count_user_evening_questionnaire_done(requested_user, startdate, enddate)
        return Response(data=data, status=status.HTTP_200_OK)


class AverageAnnotationTimeAPI(APIView):
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]     

    def get(self, request, *args, **kwargs):
        requested_user = self.kwargs["user_id"]
        startdate = self.kwargs["startdate"]
        enddate = self.kwargs["enddate"]
        confirmed_examples_by_user = ExampleState.objects.get_confirmed_time_by_example([requested_user], startdate, enddate)
        if len(confirmed_examples_by_user) == 0:
            data = {"average_annotation_time (seconds)": 0, "daily_average_annotation_time": []}
            return Response(data=data, status=status.HTTP_200_OK)
        else:
            confirmed_df = pd.DataFrame(confirmed_examples_by_user)
            confirmed_df['Date'] = confirmed_df['confirmed_at'].dt.strftime('%Y-%m-%d')
            confirmed_dates = list(confirmed_df.Date.unique())
            daily_avg_single_annotation_time = []
            all_single_annotation_time = []
            for date in confirmed_dates:
                requested_examples = confirmed_df[confirmed_df['Date'] == date].example_id
                daily_single_annotation_time = []
                for example_id in requested_examples:
                    started_examples_by_user = ExampleAnnotateStartState.objects.get_started_time_by_example(example_id, [requested_user], startdate, enddate)
                    annotation_time  = confirmed_df[confirmed_df['example_id']==example_id]["confirmed_at"] - started_examples_by_user[0]['started_at']
                    daily_single_annotation_time.append(annotation_time.dt.seconds.values[0])
                    all_single_annotation_time.append(annotation_time.dt.seconds.values[0])
                average_daily_annotation_time = sum(daily_single_annotation_time) / len(daily_single_annotation_time)
                single_annotation_time_per_day = {"date": date, "average_annotation_time (seconds)": average_daily_annotation_time}
                daily_avg_single_annotation_time.append(single_annotation_time_per_day)
                
            average_annotation_time = sum(all_single_annotation_time) / len(all_single_annotation_time)
            data = {"average_annotation_time (seconds)": average_annotation_time, "daily_average_annotation_time": daily_avg_single_annotation_time}
            return Response(data=data, status=status.HTTP_200_OK)


class AvgDailyAnnotationTimeAPI(APIView):
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]     

    def get(self, request, *args, **kwargs):
        requested_user = self.kwargs["user_id"]
        startdate = self.kwargs["startdate"]
        enddate = self.kwargs["enddate"]
        confirmed_examples_by_user = ExampleState.objects.get_confirmed_time_by_example([requested_user], startdate, enddate)
        if len(confirmed_examples_by_user) == 0:
            data = {"average_annotation_time (seconds)": 0, "daily_average_annotation_time": []}
            return Response(data=data, status=status.HTTP_200_OK)
        else:
            confirmed_df = pd.DataFrame(confirmed_examples_by_user)
            confirmed_df['Date'] = confirmed_df['confirmed_at'].dt.strftime('%Y-%m-%d')
            confirmed_dates = list(confirmed_df.Date.unique())
            list_daily_annotation_time = []
            list_annotation_time_per_day = []
            for date in confirmed_dates:
                requested_examples = confirmed_df[confirmed_df['Date'] == date].example_id
                daily_annotation_time = []
                for example_id in requested_examples:
                    started_examples_by_user = ExampleAnnotateStartState.objects.get_started_time_by_example(example_id, [requested_user], startdate, enddate)
                    annotation_time  = confirmed_df[confirmed_df['example_id']==example_id]["confirmed_at"] - started_examples_by_user[0]['started_at']
                    daily_annotation_time.append(annotation_time.dt.seconds.values[0])
                total_daily_annotation_time = sum(daily_annotation_time)
                total_annotation_time_per_day = {"date": date, "average_annotation_time (seconds)": total_daily_annotation_time}
                list_annotation_time_per_day.append(total_annotation_time_per_day)
                list_daily_annotation_time.append(total_daily_annotation_time)
            average_annotation_time = sum(list_daily_annotation_time) / len(list_daily_annotation_time)
            data = {"average_annotation_time (seconds)": average_annotation_time, "daily_average_annotation_time": list_annotation_time_per_day}
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
                    return Response(data={"average_daily_questionnaire_time (seconds)": 0, "total_time (seconds)": []}, status=status.HTTP_200_OK)
                else:
                    answered_questionnaire_df = pd.DataFrame(answered_questionnaires_by_user).sort_values('created_at')
                    answered_questionnaire_df = answered_questionnaire_df.drop_duplicates(['question_id__questionnaire_id'], keep='first')
                    start_time_list = answered_questionnaire_df.created_at.to_list()
                    finish_time_list = finished_quetionnaires_df[finished_quetionnaires_df['Date'] == date].finished_at.to_list()
                    time_diff_list = [(fn - st).seconds for fn, st in zip(finish_time_list, start_time_list)]
                    questionaire_time_per_day = {"date": date, "total_time (seconds)": sum(time_diff_list)}
                    period_questionnaire_time.append(questionaire_time_per_day)

        if len(period_questionnaire_time) == 0:
            return Response(data={"average_daily_questionnaire_time (seconds)": 0, "total_time (seconds)": []}, status=status.HTTP_200_OK)
        else:
            average_daily_questionnaire_time = sum([i['total_time (seconds)'] for i in period_questionnaire_time]) / len(period_questionnaire_time)
            data = {"average_daily_questionnaire_time (seconds)": average_daily_questionnaire_time, "daily_questionnaire_time": period_questionnaire_time}
            return Response(data=data, status=status.HTTP_200_OK)


class AllUsersAverageAnnotationTimeAPI(APIView):
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]     

    def get(self, request, *args, **kwargs):
        all_user_ids = User.objects.all().values_list('id', flat=True)
        startdate = self.kwargs["startdate"]
        enddate = self.kwargs["enddate"]
        progressed_users_avg_annotation_time = []
        progressed_users_avg_annotation_time_per_day = []
        for user_id in all_user_ids:
            confirmed_examples_by_user = ExampleState.objects.get_confirmed_time_by_example([user_id], startdate, enddate)
            if len(confirmed_examples_by_user) != 0:
                confirmed_df = pd.DataFrame(confirmed_examples_by_user)
                confirmed_df['Date'] = confirmed_df['confirmed_at'].dt.strftime('%Y-%m-%d')
                confirmed_dates = list(confirmed_df.Date.unique())
                daily_avg_single_annotation_time = []
                all_single_annotation_time = []
                for date in confirmed_dates:
                    requested_examples = confirmed_df[confirmed_df['Date'] == date].example_id
                    daily_single_annotation_time = []
                    for example_id in requested_examples:
                        started_examples_by_user = ExampleAnnotateStartState.objects.get_started_time_by_example(example_id, [user_id], startdate, enddate)
                        annotation_time  = confirmed_df[confirmed_df['example_id']==example_id]["confirmed_at"] - started_examples_by_user[0]['started_at']
                        daily_single_annotation_time.append(annotation_time.dt.seconds.values[0])
                        all_single_annotation_time.append(annotation_time.dt.seconds.values[0])
                    average_daily_annotation_time = sum(daily_single_annotation_time) / len(daily_single_annotation_time)
                    single_annotation_time_per_day = {"date": date, "average_annotation_time (seconds)": average_daily_annotation_time, "user_id": user_id}
                    daily_avg_single_annotation_time.append(single_annotation_time_per_day)
                for time in daily_avg_single_annotation_time:
                    progressed_users_avg_annotation_time_per_day.append(time)
                df = pd.DataFrame(progressed_users_avg_annotation_time_per_day)
                df = df.groupby('date')['average_annotation_time (seconds)'].mean().reset_index(name='avg_annotation_time_single_text (seconds)')
                all_user_daily_avg_single_annotation_time = df.to_dict(orient='records')
                for time in all_single_annotation_time:
                    progressed_users_avg_annotation_time.append(time)
                all_user_average_annotation_time = sum(progressed_users_avg_annotation_time) / len(progressed_users_avg_annotation_time)
                data = {"average_annotation_time (seconds)": all_user_average_annotation_time, "daily_average_annotation_time": all_user_daily_avg_single_annotation_time}
        return Response(data=data, status=status.HTTP_200_OK)


class AllUsersAvgDailyAnnotationTimeAPI(APIView):
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]     

    def get(self, request, *args, **kwargs):
        all_user_ids = User.objects.all().values_list('id', flat=True)
        startdate = self.kwargs["startdate"]
        enddate = self.kwargs["enddate"]
        progressed_users_annotation_time_per_day = []
        for user_id in all_user_ids:
            confirmed_examples_by_user = ExampleState.objects.get_confirmed_time_by_example([user_id], startdate, enddate)
            if len(confirmed_examples_by_user) != 0:
                confirmed_df = pd.DataFrame(confirmed_examples_by_user)
                confirmed_df['Date'] = confirmed_df['confirmed_at'].dt.strftime('%Y-%m-%d')
                confirmed_dates = list(confirmed_df.Date.unique())
                daily_user_annotation_time = []
                all_annotation_time = []
                for date in confirmed_dates:
                    requested_examples = confirmed_df[confirmed_df['Date'] == date].example_id
                    daily_single_annotation_time = []
                    for example_id in requested_examples:
                        started_examples_by_user = ExampleAnnotateStartState.objects.get_started_time_by_example(example_id, [user_id], startdate, enddate)
                        annotation_time  = confirmed_df[confirmed_df['example_id']==example_id]["confirmed_at"] - started_examples_by_user[0]['started_at']
                        daily_single_annotation_time.append(annotation_time.dt.seconds.values[0])
                        all_annotation_time.append(annotation_time.dt.seconds.values[0])
                    total_daily_annotation_time = sum(daily_single_annotation_time)
                    total_annotation_time_per_day = {"date": date, "total_annotation_time (seconds)": total_daily_annotation_time, "user_id": user_id}
                    daily_user_annotation_time.append(total_annotation_time_per_day)
                for time in daily_user_annotation_time:
                    progressed_users_annotation_time_per_day.append(time)

                df = pd.DataFrame(progressed_users_annotation_time_per_day)
                print(progressed_users_annotation_time_per_day)
                avg_daily_annotation_time_df = df.groupby('date')['total_annotation_time (seconds)'].mean().reset_index(name='avg_annotation_time_daily (seconds)')
                all_user_daily_avg_annotation_time = avg_daily_annotation_time_df.to_dict(orient='records')
                list_user_avg_annotation_time_daily = df.groupby(["user_id"])['total_annotation_time (seconds)'].mean().to_list()
                all_user_average_annotation_time = sum(list_user_avg_annotation_time_daily) / len(list_user_avg_annotation_time_daily)
                data = {"average_annotation_time (seconds)": all_user_average_annotation_time, "daily_average_annotation_time": all_user_daily_avg_annotation_time}
        return Response(data=data, status=status.HTTP_200_OK)


class AllUserAvgDailyQuestionnaireTimeAPI(APIView):
    permission_classes = [IsAuthenticated & (IsProjectAdmin | IsProjectStaffAndReadOnly)]     

    def get(self, request, *args, **kwargs):
        all_user_ids = User.objects.all().values_list('id', flat=True)
        startdate = self.kwargs["startdate"]
        enddate = self.kwargs["enddate"]
        all_user_period_questionnaire_time = []
        for user_id in all_user_ids:
            finished_questionnaires_by_user = QuestionnaireState.objects.get_finished_time_by_questionnaire([user_id], startdate, enddate)
            if len(finished_questionnaires_by_user) != 0:
                finished_quetionnaires_df = pd.DataFrame(finished_questionnaires_by_user)
                finished_quetionnaires_df['Date'] = finished_quetionnaires_df['finished_at'].dt.strftime('%Y-%m-%d')
                finished_questionnaire_dates = list(finished_quetionnaires_df.Date.unique())
                period_questionnaire_time = []
                for date in finished_questionnaire_dates:
                    list_finished_questionnaire_ids = finished_quetionnaires_df[finished_quetionnaires_df['Date'] == date]['questionnaire_id'].tolist()
                    answered_questionnaires_by_user = Answer.objects.get_answers_time_by_user_in_given_period(list_finished_questionnaire_ids, user_id, date=date)
                    if len(answered_questionnaires_by_user) != 0:
                        answered_questionnaire_df = pd.DataFrame(answered_questionnaires_by_user).sort_values('created_at')
                        answered_questionnaire_df = answered_questionnaire_df.drop_duplicates(['question_id__questionnaire_id'], keep='first')
                        start_time_list = answered_questionnaire_df.created_at.to_list()
                        finish_time_list = finished_quetionnaires_df[finished_quetionnaires_df['Date'] == date].finished_at.to_list()
                        time_diff_list = [(fn - st).seconds for fn, st in zip(finish_time_list, start_time_list)]
                        questionaire_time_per_day = {"date": date, "total_time (seconds)": sum(time_diff_list), "user_id": user_id}
                        period_questionnaire_time.append(questionaire_time_per_day)
                all_user_period_questionnaire_time.append(period_questionnaire_time)
        if all_user_period_questionnaire_time:
            final_user_period_questionnaire_time = []
            for time in all_user_period_questionnaire_time:
                for sample in time:
                    final_user_period_questionnaire_time.append(sample)
            df = pd.DataFrame(final_user_period_questionnaire_time)
            list_user_questionnaire_avg_spending_time = df.groupby(["user_id"])['total_time (seconds)'].mean().to_list()
            all_user_average_questionnaire_time = sum(list_user_questionnaire_avg_spending_time) / len(list_user_questionnaire_avg_spending_time)
            avg_daily_questionnaire_time_df = df.groupby('date')['total_time (seconds)'].mean().reset_index(name='avg_questionnaire_time_daily (seconds)')
            all_user_daily_avg_questionnaire_time = avg_daily_questionnaire_time_df.to_dict(orient='records')
            data = {"average_daily_questionnaire_time (seconds)": all_user_average_questionnaire_time, "daily_questionnaire_time": all_user_daily_avg_questionnaire_time}
        return Response(data=data, status=status.HTTP_200_OK)
