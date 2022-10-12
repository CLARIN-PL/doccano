from typing import Dict, List, Type

from django.db.models import QuerySet

from . import writers
from .catalog import CSV, JSON, JSONL, FastText
from .formatters import (
    DictFormatter,
    FastTextCategoryFormatter,
    Formatter,
    JoinedCategoryFormatter,
    ListedCategoryFormatter,
    RenameFormatter,
    TupledSpanFormatter,
    TupledTextFormatter
)
from .labels import Categories, Labels, Relations, Spans, Texts, Scales, TextQuestions
from data_export.models import DATA, ExportedExample
from projects.models import (
    DOCUMENT_CLASSIFICATION,
    IMAGE_CLASSIFICATION,
    INTENT_DETECTION_AND_SLOT_FILLING,
    SEQ2SEQ,
    SEQUENCE_LABELING,
    SPEECH2TEXT,
    Project,
    ARTICLE_ANNOTATION,
    AFFECTIVE_ANNOTATION,
)


def create_writer(file_format: str) -> writers.Writer:
    mapping = {
        CSV.name: writers.CsvWriter(),
        JSON.name: writers.JsonWriter(),
        JSONL.name: writers.JsonlWriter(),
        FastText.name: writers.FastTextWriter(),
    }
    if file_format not in mapping:
        ValueError(f"Invalid format: {file_format}")
    return mapping[file_format]


def create_formatter(project: Project, file_format: str) -> List[Formatter]:
    use_relation = getattr(project, "use_relation", False)
    is_summary_mode = getattr(project, "is_summary_mode", False)
    is_emotions_mode = getattr(project, "is_emotions_mode", False)
    mapper_text_classification = {DATA: "text", Categories.column: "label"}
    mapper_sequence_labeling = {DATA: "text", Spans.column: "label"}
    mapper_seq2seq = {DATA: "text", Texts.column: "label"}
    mapper_image_classification = {DATA: "filename", Categories.column: "label"}
    mapper_speech2text = {DATA: "filename", Texts.column: "label"}
    mapper_intent_detection = {DATA: "text", Categories.column: "cats"}
    mapper_relation_extraction = {DATA: "text"}
    mapper_article_annotation = {DATA: "text", Categories.column: "cats"}
    mapper_affective_annotation = {DATA: "text"}
    mapping: Dict[str, Dict[str, List[Formatter]]] = {
        DOCUMENT_CLASSIFICATION: {
            CSV.name: [
                JoinedCategoryFormatter(Categories.column),
                RenameFormatter(**mapper_text_classification),
            ],
            JSON.name: [
                ListedCategoryFormatter(Categories.column),
                RenameFormatter(**mapper_text_classification),
            ],
            JSONL.name: [
                ListedCategoryFormatter(Categories.column),
                RenameFormatter(**mapper_text_classification),
            ],
            FastText.name: [FastTextCategoryFormatter(Categories.column)],
        },
        SEQUENCE_LABELING: {
            JSONL.name: [
                DictFormatter(Spans.column),
                DictFormatter(Relations.column),
                RenameFormatter(**mapper_relation_extraction),
            ]
            if use_relation
            else [TupledSpanFormatter(Spans.column), RenameFormatter(**mapper_sequence_labeling)]
        },
        SEQ2SEQ: {
            CSV.name: [JoinedCategoryFormatter(Texts.column), RenameFormatter(**mapper_seq2seq)],
            JSON.name: [ListedCategoryFormatter(Texts.column), RenameFormatter(**mapper_seq2seq)],
            JSONL.name: [ListedCategoryFormatter(Texts.column), RenameFormatter(**mapper_seq2seq)],
        },
        IMAGE_CLASSIFICATION: {
            JSONL.name: [
                ListedCategoryFormatter(Categories.column),
                RenameFormatter(**mapper_image_classification),
            ],
        },
        SPEECH2TEXT: {
            JSONL.name: [ListedCategoryFormatter(Texts.column), RenameFormatter(**mapper_speech2text)],
        },
        INTENT_DETECTION_AND_SLOT_FILLING: {
            JSONL.name: [
                ListedCategoryFormatter(Categories.column),
                TupledSpanFormatter(Spans.column),
                RenameFormatter(**mapper_intent_detection),
            ]
        },
        ARTICLE_ANNOTATION: {
            JSON.name: [
                ListedCategoryFormatter(Categories.column),
                DictFormatter(Spans.column),
                DictFormatter(Relations.column),
                RenameFormatter(**mapper_article_annotation),
            ]
            if use_relation
            else [
                ListedCategoryFormatter(Categories.column),
                TupledSpanFormatter(Spans.column),
                RenameFormatter(**mapper_article_annotation)
            ],
            JSONL.name: [
                ListedCategoryFormatter(Categories.column),
                DictFormatter(Spans.column),
                DictFormatter(Relations.column),
                RenameFormatter(**mapper_article_annotation),
            ]
            if use_relation
            else [
                ListedCategoryFormatter(Categories.column),
                TupledSpanFormatter(Spans.column),
                RenameFormatter(**mapper_article_annotation)
            ],
        },
        AFFECTIVE_ANNOTATION: {
            JSON.name: [
                TupledTextFormatter(TextQuestions.column),
                RenameFormatter(**mapper_affective_annotation),
            ]
            if is_summary_mode
            else [
                TupledSpanFormatter(Scales.column),
                RenameFormatter(**mapper_affective_annotation),
            ]
            if is_emotions_mode
            else [
                TupledSpanFormatter(Scales.column),
                TupledTextFormatter(TextQuestions.column),
                RenameFormatter(**mapper_affective_annotation)
            ],
            JSONL.name: [
                TupledTextFormatter(TextQuestions.column),
                RenameFormatter(**mapper_affective_annotation),
            ]
            if is_summary_mode
            else [
                TupledSpanFormatter(Scales.column),
                RenameFormatter(**mapper_affective_annotation),
            ]
            if is_emotions_mode
            else [
                TupledSpanFormatter(Scales.column),
                TupledTextFormatter(TextQuestions.column),
                RenameFormatter(**mapper_affective_annotation)
            ],           
        },
    }
    return mapping[project.project_type][file_format]


def select_label_collection(project: Project) -> List[Type[Labels]]:
    use_relation = getattr(project, "use_relation", False)
    is_summary_mode = getattr(project, "is_summary_mode", False)
    is_emotions_mode = getattr(project, "is_emotions_mode", False)
    mapping: Dict[str, List[Type[Labels]]] = {
        DOCUMENT_CLASSIFICATION: [Categories],
        SEQUENCE_LABELING: [Spans, Relations] if use_relation else [Spans],
        SEQ2SEQ: [Texts],
        IMAGE_CLASSIFICATION: [Categories],
        SPEECH2TEXT: [Texts],
        INTENT_DETECTION_AND_SLOT_FILLING: [Categories, Spans],
        ARTICLE_ANNOTATION: [Categories, Spans, Relations] if use_relation else [Categories, Spans],
        AFFECTIVE_ANNOTATION: [TextQuestions] if is_summary_mode else [Scales] if is_emotions_mode else [Scales, TextQuestions],
    }
    return mapping[project.project_type]


def create_labels(project: Project, examples: QuerySet[ExportedExample], user=None) -> List[Labels]:
    label_collections = select_label_collection(project)
    labels = [label_collection(examples=examples, user=user) for label_collection in label_collections]
    return labels
