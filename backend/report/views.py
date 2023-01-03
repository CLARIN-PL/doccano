import abc

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from examples.models import Example, ExampleState
from questionnaires.models import QuestionnaireState
from datetime import datetime
# from label_types.models import CategoryType, LabelType, RelationType, SpanType, ScaleType
# from labels.models import Category, Label, Relation, Span, Scale
# from projects.models import Member, Project
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
