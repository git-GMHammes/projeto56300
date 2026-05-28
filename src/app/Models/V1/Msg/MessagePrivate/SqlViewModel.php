<?php

namespace App\Models\V1\Msg\MessagePrivate;

use App\Models\V1\BaseViewModel;

/**
 * Model de leitura para a view view_msg_private.
 *
 * JOINs:
 *   msg_003_private mp
 *   INNER JOIN user_001_management um ON mp.sender_id = um.id
 *
 * Colunas disponíveis:
 *   id,
 *   mp_tenant_id, mp_sender_id, mp_receiver_id, mp_content, mp_read_at,
 *   created_at, updated_at, deleted_at,
 *   um_id, um_uuid, um_user, um_is_active,
 *   um_last_login, um_created_at, um_updated_at, um_deleted_at
 */
class SqlViewModel extends BaseViewModel
{
    protected $DBGroup    = DB_GROUP_001;
    protected $table      = 'view_msg_private';
    protected $primaryKey = 'id';

    protected array $likeFields = [
        'mp_content',
        'um_user',
    ];

    protected array $sortableFields = [
        'id',
        'mp_tenant_id',
        'mp_sender_id',
        'mp_receiver_id',
        'mp_read_at',
        'created_at',
    ];

    public array $searchFields = [
        'mp_tenant_id',
        'mp_sender_id',
        'mp_receiver_id',
        'um_id',
    ];
}
