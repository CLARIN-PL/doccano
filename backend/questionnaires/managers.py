from django.db.models import Count, Manager
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404


class QuestionnaireStateManager(Manager):
    def count_all_users_evening_questionnaire_done(self, users, startdate, enddate):
        done_count = (
            self.filter(finished_by__in=users, finished_at__gte=startdate, finished_at__lte=enddate, questionnaire__in=[15, 16])
            .values("finished_by__username")
            .annotate(total=Count("questionnaire"))
        )
        response = {
            "progress": [{"user": obj["finished_by__username"], "done": obj["total"]} for obj in done_count],
        }
        members_with_progress = {o["finished_by__username"] for o in done_count}
        for user in users:
            current_user = get_object_or_404(User, id=user)
            if str(current_user) not in members_with_progress:
                response["progress"].append({"user": str(current_user), "done": 0})
        return response
