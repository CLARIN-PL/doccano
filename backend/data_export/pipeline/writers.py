import abc

import pandas as pd
import json

class Writer(abc.ABC):
    extension = ""

    @staticmethod
    @abc.abstractmethod
    def write(file, dataset: pd.DataFrame):
        raise NotImplementedError("Please implement this method in the subclass.")


class CsvWriter(Writer):
    extension = "csv"

    @staticmethod
    def write(file, dataset: pd.DataFrame):
        dataset.to_csv(file, index=False, encoding="utf-8")


class JsonWriter(Writer):
    extension = "json"

    @staticmethod
    def write(file, dataset: pd.DataFrame):
        dataset.to_json(file, orient="records", force_ascii=False)


class JsonlWriter(Writer):
    extension = "jsonl"

    @staticmethod
    def write(file, dataset: pd.DataFrame):
        dataset.to_json(file, orient="records", force_ascii=False, lines=True)


class FastTextWriter(Writer):
    extension = "txt"

    @staticmethod
    def write(file, dataset: pd.DataFrame):
        dataset.to_csv(file, index=False, encoding="utf-8", header=False)


class JsonArticleWriter(Writer):
    extension = "json"

    @staticmethod
    def write(file, dataset: pd.DataFrame):
        dataset = dataset.groupby('article_id').apply(lambda x: x.drop('article_id',axis=1).to_json(orient='records')).reset_index(name='data')
        dataset.data = dataset.data.apply(json.loads)
        dataset.to_json(file, orient="records", force_ascii=False, lines=True)
