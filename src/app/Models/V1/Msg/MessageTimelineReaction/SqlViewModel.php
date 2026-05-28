<?php

namespace App\Models\V1\Msg\MessageTimelineReaction;

use App\Models\V1\BaseViewModel;

/**
 * Model de leitura para a view view_msg_timeline_reaction.
 *
 * JOINs:
 *   msg_002_timeline_reaction mtr
 *   INNER JOIN user_001_management um ON mtr.user_management_id = um.id
 *
 * Colunas disponíveis:
 *   id,
 *   mtr_timeline_id, mtr_user_management_id, mtr_reaction,
 *   created_at, updated_at, deleted_at,
 *   um_id, um_uuid, um_user, um_is_active,
 *   um_last_login, um_created_at, um_updated_at, um_deleted_at
 */
class SqlViewModel extends BaseViewModel
{
    protected $DBGroup    = DB_GROUP_001;
    protected $table      = 'view_msg_timeline_reaction';
    protected $primaryKey = 'id';

    protected array $likeFields = [
        'um_user',
    ];

    protected array $sortableFields = [
        'id',
        'mtr_timeline_id',
        'mtr_reaction',
        'created_at',
    ];

    public array $searchFields = [
        'mtr_timeline_id',
        'mtr_user_management_id',
        'mtr_reaction',
        'um_id',
    ];
}
