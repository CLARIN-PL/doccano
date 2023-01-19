from django.db.models import Count, Manager
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from django.utils import timezone
import datetime


class QuestionnaireStateManager(Manager):
    def count_user_evening_questionnaire_done(self, user, startdate, enddate):
        tz = timezone.get_current_timezone()
        startdate = timezone.make_aware(datetime.datetime.fromordinal(startdate.toordinal()), tz, is_dst=True)
        enddate = timezone.make_aware(datetime.datetime.fromordinal(enddate.toordinal()), tz, is_dst=True)
        done_count = (
            self.filter(finished_by=user, finished_at__gte=startdate, finished_at__lte=enddate, questionnaire__in=[15, 16])
            .values("finished_by__username")
            .annotate(total=Count("questionnaire"))
        )
        response = {
            "progress": [{"user": obj["finished_by__username"], "done": obj["total"]} for obj in done_count],
        }
        members_with_progress = {o["finished_by__username"] for o in done_count}
        current_user = get_object_or_404(User, id=user)
        if str(current_user) not in members_with_progress:
            response["progress"].append({"user": str(current_user), "done": 0})
        return response

    def count_total_evening_questionnaire_done(self, startdate, enddate):
        tz = timezone.get_current_timezone()
        startdate = timezone.make_aware(datetime.datetime.fromordinal(startdate.toordinal()), tz, is_dst=True)
        enddate = timezone.make_aware(datetime.datetime.fromordinal(enddate.toordinal()), tz, is_dst=True)
        response = (
            self.filter(finished_at__gte=startdate, finished_at__lte=enddate, questionnaire__in=[15, 16])
            .aggregate(total=Count("id"))
        )
        return response

    def get_finished_time_by_questionnaire(self, users, startdate, enddate):
        tz = timezone.get_current_timezone()
        startdate = timezone.make_aware(datetime.datetime.fromordinal(startdate.toordinal()), tz, is_dst=True)
        enddate = timezone.make_aware(datetime.datetime.fromordinal(enddate.toordinal()), tz, is_dst=True)
        finished_time_questionnaires = self.filter(finished_by__in=users, finished_at__gte=startdate, finished_at__lte=enddate).values().order_by("finished_at")
        return finished_time_questionnaires


class AnswerStateManager(Manager):
    def get_answers_time_by_user_in_given_period(self, questionnaire_ids, user, date):
        return (
            self.filter(user_id=user, created_at__date=date, question_id__questionnaire_id__in=questionnaire_ids)
            .values("created_at", "question_id__questionnaire_id").order_by("created_at")
        )
        