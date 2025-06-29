# Generated by Django 5.2.3 on 2025-06-21 11:54

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('groups', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='eventparticipation',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='event_participations', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='group',
            name='creation_reviewed_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='reviewed_groups', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='group',
            name='creator',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='owned_groups', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='groupadmin',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='groups.group'),
        ),
        migrations.AddField(
            model_name='groupadmin',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='group',
            name='admins',
            field=models.ManyToManyField(blank=True, related_name='group_admins', through='groups.GroupAdmin', through_fields=('group', 'user'), to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='groupanalytics',
            name='group',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='analytics', to='groups.group'),
        ),
        migrations.AddField(
            model_name='groupbadge',
            name='badge',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='group_badges', to='groups.badge'),
        ),
        migrations.AddField(
            model_name='groupbadge',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='badges', to='groups.group'),
        ),
        migrations.AddField(
            model_name='group',
            name='category',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='groups', to='groups.groupcategory'),
        ),
        migrations.AddField(
            model_name='groupcreationrequest',
            name='group',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='creation_request', to='groups.group'),
        ),
        migrations.AddField(
            model_name='groupcreationrequest',
            name='requested_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='creation_requests', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='groupcreationrequest',
            name='reviewed_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='reviewed_creation_requests', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='groupevent',
            name='approved_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='approved_events', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='groupevent',
            name='created_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='created_events', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='groupevent',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='events', to='groups.group'),
        ),
        migrations.AddField(
            model_name='eventparticipation',
            name='event',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='participations', to='groups.groupevent'),
        ),
        migrations.AddField(
            model_name='groupinvite',
            name='created_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='groupinvite',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='groups.group'),
        ),
        migrations.AddField(
            model_name='groupmembership',
            name='group',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='groups.group'),
        ),
        migrations.AddField(
            model_name='groupmembership',
            name='reviewed_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='reviewed_memberships', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='groupmembership',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='notification',
            name='group',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='groups.group'),
        ),
        migrations.AddField(
            model_name='notification',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='notifications', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='userbadge',
            name='awarded_by',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='awarded_user_badges', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='userbadge',
            name='group_badge',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='awarded_badges', to='groups.groupbadge'),
        ),
        migrations.AddField(
            model_name='userbadge',
            name='user',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_badges', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddConstraint(
            model_name='groupadmin',
            constraint=models.UniqueConstraint(fields=('group', 'user'), name='unique_group_admin'),
        ),
        migrations.AlterUniqueTogether(
            name='groupadmin',
            unique_together={('group', 'user')},
        ),
        migrations.AlterUniqueTogether(
            name='groupbadge',
            unique_together={('group', 'badge')},
        ),
        migrations.AddIndex(
            model_name='group',
            index=models.Index(fields=['privacy', 'creation_status'], name='groups_grou_privacy_8a0c0e_idx'),
        ),
        migrations.AddIndex(
            model_name='group',
            index=models.Index(fields=['creator'], name='groups_grou_creator_cc7cd7_idx'),
        ),
        migrations.AddIndex(
            model_name='group',
            index=models.Index(fields=['slug'], name='groups_grou_slug_246a6a_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='groupcreationrequest',
            unique_together={('group', 'requested_by')},
        ),
        migrations.AddIndex(
            model_name='groupevent',
            index=models.Index(fields=['group', 'start_time'], name='groups_grou_group_i_a9894d_idx'),
        ),
        migrations.AddIndex(
            model_name='groupevent',
            index=models.Index(fields=['approval_status', 'start_time'], name='groups_grou_approva_b845cb_idx'),
        ),
        migrations.AddIndex(
            model_name='groupevent',
            index=models.Index(fields=['created_by', 'start_time'], name='groups_grou_created_bf5937_idx'),
        ),
        migrations.AddIndex(
            model_name='eventparticipation',
            index=models.Index(fields=['event', 'user'], name='groups_even_event_i_678367_idx'),
        ),
        migrations.AddIndex(
            model_name='eventparticipation',
            index=models.Index(fields=['user', 'attended'], name='groups_even_user_id_78e34c_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='eventparticipation',
            unique_together={('event', 'user')},
        ),
        migrations.AddIndex(
            model_name='groupinvite',
            index=models.Index(fields=['token'], name='groups_grou_token_ee401f_idx'),
        ),
        migrations.AddIndex(
            model_name='groupinvite',
            index=models.Index(fields=['group', 'created_by'], name='groups_grou_group_i_bcb57e_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='groupinvite',
            unique_together={('group', 'token')},
        ),
        migrations.AddIndex(
            model_name='groupmembership',
            index=models.Index(fields=['user', 'status'], name='groups_grou_user_id_fbaf63_idx'),
        ),
        migrations.AddIndex(
            model_name='groupmembership',
            index=models.Index(fields=['group', 'status'], name='groups_grou_group_i_d0a4fa_idx'),
        ),
        migrations.AddIndex(
            model_name='groupmembership',
            index=models.Index(fields=['status'], name='groups_grou_status_272d32_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='groupmembership',
            unique_together={('user', 'group')},
        ),
        migrations.AddIndex(
            model_name='notification',
            index=models.Index(fields=['user', 'is_read'], name='groups_noti_user_id_4b48bd_idx'),
        ),
        migrations.AddIndex(
            model_name='notification',
            index=models.Index(fields=['created_at'], name='groups_noti_created_5bca16_idx'),
        ),
        migrations.AddIndex(
            model_name='userbadge',
            index=models.Index(fields=['user', 'awarded_at'], name='groups_user_user_id_3b8763_idx'),
        ),
        migrations.AlterUniqueTogether(
            name='userbadge',
            unique_together={('user', 'group_badge')},
        ),
    ]
