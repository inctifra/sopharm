from django.contrib import admin
from .models import Announcement

@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = (
        'title',
        'announcement_type',
        'is_featured',
        'is_public',
        'start_date',
        'end_date',
        'created_at',
    )
    list_filter = (
        'announcement_type',
        'is_featured',
        'is_public',
        'start_date',
        'end_date',
    )
    search_fields = ('title', 'description', 'location')
    prepopulated_fields = {"slug": ("title",)}
    readonly_fields = ('created_at', 'updated_at')
    ordering = ('-created_at',)

    fieldsets = (
        (None, {
            'fields': ('title', 'description', 'announcement_type', 'slug')
        }),
        ('Media', {
            'fields': ('image', 'attachment')
        }),
        ('Event Details', {
            'fields': ('start_date', 'end_date', 'location', 'registration_link')
        }),
        ('Visibility', {
            'fields': ('is_public', 'target_roles', 'is_featured')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at')
        }),
    )
