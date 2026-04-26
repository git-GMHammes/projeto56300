<?php

namespace App\Models\V1\Msg\MessageGroup;

use App\Models\V1\BaseViewModel;

/**
 * Model de leitura para a view view_msg_group_message.
 *
 * JOINs:
 *   msg_006_group_message mgm
 *   INNER JOIN user_001_management um  ON mgm.user_management_id = um.id
 *   LEFT JOIN  msg_006_group_message reply ON mgm.reply_to_id = reply.id
 *
 * Colunas disponíveis:
 *   id,
 *   mgm_group_id, mgm_user_management_id, mgm_reply_to_id, mgm_content,
 *   created_at, updated_at, deleted_at,
 *   um_id, um_uuid, um_user, um_is_active,
 *   um_password, um_last_login, um_created_at, um_updated_at, um_deleted_at,
 *   reply_id, reply_group_id, reply_user_management_id, reply_reply_to_id,
 *   reply_content, reply_created_at, reply_updated_at, reply_deleted_at
 */
class SqlViewModel extends BaseViewModel
{
    protected $DBGroup    = DB_GROUP_001;
    protected $table      = 'view_msg_group_message';
    protected $primaryKey = 'id';

    protected array $likeFields = [
        'mgm_content',
        'um_user',
        'reply_content',
    ];

    protected array $sortableFields = [
        'id',
        'mgm_group_id',
        'created_at',
    ];

    public array $searchFields = [
        'mgm_group_id',
        'mgm_user_management_id',
        'mgm_reply_to_id',
        'um_id',
    ];
}
