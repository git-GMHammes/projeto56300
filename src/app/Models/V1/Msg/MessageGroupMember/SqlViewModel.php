<?php

namespace App\Models\V1\Msg\MessageGroupMember;

use App\Models\V1\BaseViewModel;

/**
 * Model de leitura para a view view_msg_group_member.
 *
 * JOINs:
 *   msg_005_group_member mgm
 *   INNER JOIN user_001_management um ON mgm.user_management_id = um.id
 *
 * Colunas disponíveis:
 *   id,
 *   mgm_group_id, mgm_user_management_id, mgm_role, mgm_joined_at, mgm_left_at,
 *   created_at, updated_at, deleted_at,
 *   um_id, um_uuid, um_user, um_is_active,
 *   um_last_login, um_created_at, um_updated_at, um_deleted_at
 */
class SqlViewModel extends BaseViewModel
{
    protected $DBGroup    = DB_GROUP_001;
    protected $table      = 'view_msg_group_member';
    protected $primaryKey = 'id';

    protected array $likeFields = [
        'um_user',
    ];

    protected array $sortableFields = [
        'id',
        'mgm_group_id',
        'mgm_role',
        'mgm_joined_at',
        'mgm_left_at',
        'created_at',
    ];

    public array $searchFields = [
        'mgm_group_id',
        'mgm_user_management_id',
        'mgm_role',
        'um_id',
    ];
}
