import abc
import uuid
from typing import Any, Optional

from pydantic import UUID4, BaseModel, ConstrainedStr, NonNegativeInt, root_validator

from .label_types import LabelTypes
from examples.models import Example
from label_types.models import CategoryType, LabelType, RelationType, SpanType
from labels.models import Category as CategoryModel
from labels.models import Label as LabelModel
from labels.models import Relation as RelationModel
from labels.models import Span as SpanModel
from labels.models import TextLabel as TextLabelModel
from projects.models import Project
from projects.models import Member
from django.contrib.auth.models import User

class NonEmptyStr(ConstrainedStr):
    min_length = 1


class Label(BaseModel, abc.ABC):
    id: int = -1
    uuid: UUID4
    example_uuid: UUID4

    def __init__(self, **data):
        data["uuid"] = uuid.uuid4()
        super().__init__(**data)

    @abc.abstractmethod
    def __lt__(self, other):
        raise NotImplementedError()

    @classmethod
    def parse(cls, example_uuid: UUID4, obj: Any):
        raise NotImplementedError()

    @abc.abstractmethod
    def create_type(self, project: Project) -> Optional[LabelType]:
        raise NotImplementedError()

    @abc.abstractmethod
    def create(self, user, example: Example, types: LabelTypes, project: Project, **kwargs) -> LabelModel:
        raise NotImplementedError

    def __hash__(self):
        return hash(tuple(self.dict()))


class CategoryLabel(Label):
    label: NonEmptyStr

    def __lt__(self, other):
        return self.label < other.label

    @classmethod
    def parse(cls, example_uuid: UUID4, obj: Any):
        return cls(example_uuid=example_uuid, label=obj)

    def create_type(self, project: Project) -> Optional[LabelType]:
        return CategoryType(text=self.label, project=project)

    def create(self, user, example: Example, types: LabelTypes, project: Project, **kwargs):
        if project.shared_org_label:
            users = Member.objects.filter(project=project).values_list("user", flat=True)
            for i in range(len(users)):
                self.uuid = uuid.uuid4()
                return CategoryModel(uuid=self.uuid, user=user, example=example, label=types[self.label])
        else:
            return CategoryModel(uuid=self.uuid, user=user, example=example, label=types[self.label])


class SpanLabel(Label):
    label: NonEmptyStr
    start_offset: NonNegativeInt
    end_offset: NonNegativeInt

    def __lt__(self, other):
        return self.start_offset < other.start_offset

    @root_validator
    def check_start_offset_is_less_than_end_offset(cls, values):
        start_offset, end_offset = values.get("start_offset"), values.get("end_offset")
        if start_offset >= end_offset:
            raise ValueError("start_offset must be less than end_offset.")
        return values

    @classmethod
    def parse(cls, example_uuid: UUID4, obj: Any):
        if isinstance(obj, list) or isinstance(obj, tuple):
            columns = ["start_offset", "end_offset", "label"]
            obj = zip(columns, obj)
            return cls(example_uuid=example_uuid, **dict(obj))
        elif isinstance(obj, dict):
            return cls(example_uuid=example_uuid, **obj)
        raise ValueError("SpanLabel.parse()")

    def create_type(self, project: Project) -> Optional[LabelType]:
        return SpanType(text=self.label, project=project)

    def create(self, user, example: Example, types: LabelTypes, project: Project, **kwargs):
        if project.shared_org_label:
            users = Member.objects.filter(project=project).values_list("user", flat=True)
            for i in range(len(users)):
                self.uuid = uuid.uuid4()
                return SpanModel(
                    uuid=self.uuid,
                    user=user,
                    example=example,
                    start_offset=self.start_offset,
                    end_offset=self.end_offset,
                    label=types[self.label],
                )
        else:
            return SpanModel(
                uuid=self.uuid,
                user=user,
                example=example,
                start_offset=self.start_offset,
                end_offset=self.end_offset,
                label=types[self.label],
            )


class TextLabel(Label):
    text: NonEmptyStr

    def __lt__(self, other):
        return self.text < other.text

    @classmethod
    def parse(cls, example_uuid: UUID4, obj: Any):
        return cls(example_uuid=example_uuid, text=obj)

    def create_type(self, project: Project) -> Optional[LabelType]:
        return None

    def create(self, user, example: Example, types: LabelTypes, project: Project, **kwargs):
        return TextLabelModel(uuid=self.uuid, user=user, example=example, text=self.text)


class RelationLabel(Label):
    from_id: int
    to_id: int
    type: NonEmptyStr

    def __lt__(self, other):
        return self.from_id < other.from_id

    @classmethod
    def parse(cls, example_uuid: UUID4, obj: Any):
        return cls(example_uuid=example_uuid, **obj)

    def create_type(self, project: Project) -> Optional[LabelType]:
        return RelationType(text=self.type, project=project)

    def create(self, user, example: Example, types: LabelTypes, project: Project, **kwargs):
        if project.shared_org_label:
            users = Member.objects.filter(project=project).values_list("user", flat=True)
            for i in range(len(users)):
                self.uuid = uuid.uuid4()
                return RelationModel(
                    uuid=self.uuid,
                    user=user,
                    example=example,
                    type=types[self.type],
                    from_id=kwargs["id_to_span"][self.from_id],
                    to_id=kwargs["id_to_span"][self.to_id],
                )
        else:
            return RelationModel(
                uuid=self.uuid,
                user=user,
                example=example,
                type=types[self.type],
                from_id=kwargs["id_to_span"][self.from_id],
                to_id=kwargs["id_to_span"][self.to_id],
            )
