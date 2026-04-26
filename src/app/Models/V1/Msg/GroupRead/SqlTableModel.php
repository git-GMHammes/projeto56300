<?php

namespace App\Models\V1\Msg\GroupRead;

use App\Models\V1\BaseTableModel;

/**
 * Model de escrita para a tabela msg_007_group_read.
 *
 * Ponteiro de última mensagem lida por usuário por grupo.
 * Constraint UNIQUE (group_id, user_id) — um registro por usuário por grupo.
 * last_read_id NULL indica que o usuário nunca leu.
 *
 * Tabela: msg_007_group_read
 * DDL: id, group_id, user_id, last_read_id, created_at, updated_at, deleted_at
 */
class SqlTableModel extends BaseTableModel
{
    protected $DBGroup      = DB_GROUP_001;
    protected $table        = 'msg_007_group_read';
    protected $primaryKey   = 'id';
    protected $useSoftDeletes = true;
    protected $useTimestamps  = true;

    protected $allowedFields = [
        'group_id',
        'user_id',
        'last_read_id',
    ];

    protected array $likeFields = [];

    protected array $sortableFields = [
        'id',
        'created_at',
        'updated_at',
    ];

    public array $searchFields = [];
}
