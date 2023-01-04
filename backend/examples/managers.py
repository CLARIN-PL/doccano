from django.db.models import Count, Manager
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404


class ExampleManager(Manager):
    def bulk_create(self, objs, batch_size=None, ignore_conflicts=False):
        super().bulk_create(objs, batch_size=batch_size, ignore_conflicts=ignore_conflicts)
        uuids = [data.uuid for data in objs]
        examples = self.in_bulk(uuids, field_name="uuid")
        return [examples[uid] for uid in uuids]


class ExampleStateManager(Manager):
    def count_done(self, examples, user=None):
        if user:
            queryset = self.filter(example_id__in=examples, confirmed_by=user)
        else:
            queryset = self.filter(example_id__in=examples)
        return queryset.distinct().values("example").count()

    def measure_member_progress(self, examples, members):
        done_count = (
            self.filter(example_id__in=examples).values("confirmed_by__username").annotate(total=Count("confirmed_by"))
        )
        response = {
            "total": examples.count(),
            "progress": [{"user": obj["confirmed_by__username"], "done": obj["total"]} for obj in done_count],
        }
        members_with_progress = {o["confirmed_by__username"] for o in done_count}
        for member in members:
            if member.username not in members_with_progress:
                response["progress"].append({"user": member.username, "done": 0})
        return response

    def measure_member_confirmed_examples_between_startdate_enddate(self, user, startdate, enddate):
        done_count = (
            self.filter(confirmed_by=user, confirmed_at__gte=startdate, confirmed_at__lte=enddate)
            .values("confirmed_by__username")
            .annotate(total=Count("example"))
        )
        response = {
            "progress": [{"user": obj["confirmed_by__username"], "done": obj["total"]} for obj in done_count],
        }
        members_with_progress = {o["confirmed_by__username"] for o in done_count}
        current_user = get_object_or_404(User, id=user)
        if str(current_user) not in members_with_progress:
            response["progress"].append({"user": str(current_user), "done": 0})
        return response

    def measure_total_confirmed_examples_between_startdate_enddate(self, startdate, enddate):
        response = (
            self.filter(confirmed_at__gte=startdate, confirmed_at__lte=enddate)
            .aggregate(total=Count("example"))
        )
        return response

    def get_confirmed_time_by_example(self, users, startdate, enddate):
        confirmed_time_examples = self.filter(confirmed_by__in=users, confirmed_at__gte=startdate, confirmed_at__lte=enddate).values().order_by("confirmed_at")
        return confirmed_time_examples


class ExampleStartStateManager(Manager):
    def get_started_time_by_example(self, example, users, startdate, enddate):
        started_time_examples = self.filter(started_by__in=users, started_at__gte=startdate, started_at__lte=enddate, example_id=example).values()
        return started_time_examples

    def get_user_started_time_by_date(self, users, date):
        started_time_examples = self.filter(started_by__in=users, started_at__date=date).values()
        return started_time_examples
        