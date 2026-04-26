<?php

namespace App\Models\V1\Msg\MessageTimeline;

use App\Models\V1\BaseViewModel;

/**
 * Model de leitura para a view view_msg_timeline.
 *
 * JOINs:
 *   msg_001_timeline mt
 *   INNER JOIN user_001_management um ON mt.user_management_id = um.id
 *
 * Colunas disponíveis:
 *   id,
 *   mt_tenant_id, mt_user_management_id, mt_content, mt_is_pinned,
 *   created_at, updated_at, deleted_at,
 *   um_id, um_uuid, um_user, um_is_active,
 *   um_password, um_last_login, um_created_at, um_updated_at, um_deleted_at
 */
class SqlViewModel extends BaseViewModel
{
    protected $DBGroup    = DB_GROUP_001;
    protected $table      = 'view_msg_timeline';
    protected $primaryKey = 'id';

    protected array $likeFields = [
        'mt_content',
        'um_user',
    ];

    protected array $sortableFields = [
        'id',
        'mt_tenant_id',
        'mt_is_pinned',
        'created_at',
    ];

    public array $searchFields = [
        'mt_tenant_id',
        'mt_user_management_id',
        'mt_is_pinned',
        'um_id',
    ];
}
