<?php

namespace App\Models\V1\Msg\MessageGroup;

use App\Models\V1\BaseTableModel;

/**
 * Model de escrita para a tabela msg_006_group_message.
 *
 * Mensagens de chat de grupo com suporte a reply (reply_to_id auto-referência).
 * deleted_at preserva contexto de threads.
 *
 * Tabela: msg_006_group_message
 * DDL: id, group_id, user_id, reply_to_id, content,
 *      created_at, updated_at, deleted_at
 */
class SqlTableModel extends BaseTableModel
{
    protected $DBGroup      = DB_GROUP_001;
    protected $table        = 'msg_006_group_message';
    protected $primaryKey   = 'id';
    protected $useSoftDeletes = true;
    protected $useTimestamps  = true;

    protected $allowedFields = [
        'group_id',
        'user_management_id',
        'reply_to_id',
        'content',
    ];

    protected array $likeFields = [
        'content',
    ];

    protected array $sortableFields = [
        'id',
        'created_at',
        'updated_at',
    ];

    public array $searchFields = [
        'content',
    ];
}
