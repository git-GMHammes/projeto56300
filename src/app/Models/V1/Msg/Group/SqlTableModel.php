<?php

namespace App\Models\V1\Msg\Group;

use App\Models\V1\BaseTableModel;

/**
 * Model de escrita para a tabela msg_004_group.
 *
 * Grupos de chat privado multi-usuário.
 * O criador (created_by) assume role admin automaticamente via msg_005_group_member.
 *
 * Tabela: msg_004_group
 * DDL: id, tenant_id, name, description, avatar, created_by,
 *      created_at, updated_at, deleted_at
 */
class SqlTableModel extends BaseTableModel
{
    protected $DBGroup      = DB_GROUP_001;
    protected $table        = 'msg_004_group';
    protected $primaryKey   = 'id';
    protected $useSoftDeletes = true;
    protected $useTimestamps  = true;

    protected $allowedFields = [
        'tenant_id',
        'name',
        'description',
        'avatar',
        'created_by',
    ];

    protected array $likeFields = [
        'name',
        'description',
    ];

    protected array $sortableFields = [
        'id',
        'name',
        'created_at',
        'updated_at',
    ];

    public array $searchFields = [
        'name',
        'description',
    ];
}
