<?php

namespace App\Models\V1\Msg\GroupMember;

use App\Models\V1\BaseTableModel;

/**
 * Model de escrita para a tabela msg_005_group_member.
 *
 * Membros e roles de cada grupo.
 * left_at NULL indica membresia ativa.
 *
 * Tabela: msg_005_group_member
 * DDL: id, group_id, user_id, role (enum: admin|member), joined_at, left_at,
 *      created_at, updated_at, deleted_at
 */
class SqlTableModel extends BaseTableModel
{
    protected $DBGroup      = DB_GROUP_001;
    protected $table        = 'msg_005_group_member';
    protected $primaryKey   = 'id';
    protected $useSoftDeletes = true;
    protected $useTimestamps  = true;

    protected $allowedFields = [
        'group_id',
        'user_id',
        'role',
        'joined_at',
        'left_at',
    ];

    protected array $likeFields = [];

    protected array $sortableFields = [
        'id',
        'joined_at',
        'created_at',
    ];

    public array $searchFields = [];
}
