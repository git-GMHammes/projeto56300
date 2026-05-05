<?php

namespace App\Models\V1\Msg\MessageTimeline;

use App\Models\V1\BaseTableModel;

/**
 * Model de escrita para a tabela msg_001_timeline.
 *
 * Posts públicos do mural da empresa, isolados por tenant.
 *
 * Tabela: msg_001_timeline
 * DDL: id, user_saas_tenants_id, user_management_id, content, is_pinned,
 *      created_at, updated_at, deleted_at
 */
class SqlTableModel extends BaseTableModel
{
    protected $DBGroup      = DB_GROUP_001;
    protected $table        = 'msg_001_timeline';
    protected $primaryKey   = 'id';
    protected $useSoftDeletes = true;
    protected $useTimestamps  = true;

    protected $allowedFields = [
        'user_saas_tenants_id',
        'user_management_id',
        'content',
        'is_pinned',
    ];

    protected array $likeFields = [
        'content',
    ];

    protected array $sortableFields = [
        'id',
        'is_pinned',
        'created_at',
        'updated_at',
    ];

    public array $searchFields = [
        'content',
    ];
}
