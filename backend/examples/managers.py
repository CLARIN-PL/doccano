from django.db.models import Count, Manager
from projects.models import Project
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

    def measure_member_progress(self, examples, members, project_id=None):
        project = get_object_or_404(Project, pk=project_id)
        if project.shared_org_label:
            for member in members:
                queryset = self.filter(example_id__in=examples, confirmed_by=member.user)
                total = queryset.distinct().values("example").count()
        else:
            total = examples.count()
        done_count = (
            self.filter(example_id__in=examples).values("confirmed_by__username").annotate(total=Count("confirmed_by"))
        )
        response = {
            "total": total,
            "progress": [{"user": obj["confirmed_by__username"], "done": obj["total"]} for obj in done_count],
        }
        members_with_progress = {o["confirmed_by__username"] for o in done_count}
        for member in members:
            if member.username not in members_with_progress:
                response["progress"].append({"user": member.username, "done": 0})
        return response
