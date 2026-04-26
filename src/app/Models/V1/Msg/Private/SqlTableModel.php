<?php

namespace App\Models\V1\Msg\Private;

use App\Models\V1\BaseTableModel;

/**
 * Model de escrita para a tabela msg_003_private.
 *
 * Mensagens diretas ponto a ponto, isoladas por tenant.
 * read_at preenchido quando o destinatário lê (read receipt).
 *
 * Tabela: msg_003_private
 * DDL: id, tenant_id, sender_id, receiver_id, content, read_at,
 *      created_at, updated_at, deleted_at
 */
class SqlTableModel extends BaseTableModel
{
    protected $DBGroup      = DB_GROUP_001;
    protected $table        = 'msg_003_private';
    protected $primaryKey   = 'id';
    protected $useSoftDeletes = true;
    protected $useTimestamps  = true;

    protected $allowedFields = [
        'tenant_id',
        'sender_id',
        'receiver_id',
        'content',
        'read_at',
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
