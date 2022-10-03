from django.contrib import admin

from .models import CategoryType, SpanType, ScaleType


class LabelAdmin(admin.ModelAdmin):
    list_display = ("text", "project", "text_color", "background_color")
    ordering = ("project",)
    search_fields = ("text",)


class CategoryTypeAdmin(LabelAdmin):
    pass


class SpanTypeAdmin(LabelAdmin):
    pass


class ScaleTypeAdmin(LabelAdmin):
    pass


admin.site.register(CategoryType, CategoryTypeAdmin)
admin.site.register(SpanType, SpanTypeAdmin)
admin.site.register(ScaleType, ScaleTypeAdmin)
