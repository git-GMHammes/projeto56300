<?php

namespace App\Models\V1\Msg\TimelineReaction;

use App\Models\V1\BaseTableModel;

/**
 * Model de escrita para a tabela msg_002_timeline_reaction.
 *
 * Reações (like/love/haha/wow/sad/angry) a posts do mural.
 * Constraint UNIQUE (timeline_id, user_id) — uma reação por usuário por post.
 *
 * Tabela: msg_002_timeline_reaction
 * DDL: id, timeline_id, user_id, reaction (enum), created_at, updated_at, deleted_at
 */
class SqlTableModel extends BaseTableModel
{
    protected $DBGroup      = DB_GROUP_001;
    protected $table        = 'msg_002_timeline_reaction';
    protected $primaryKey   = 'id';
    protected $useSoftDeletes = true;
    protected $useTimestamps  = true;

    protected $allowedFields = [
        'timeline_id',
        'user_id',
        'reaction',
    ];

    protected array $likeFields = [];

    protected array $sortableFields = [
        'id',
        'reaction',
        'created_at',
    ];

    public array $searchFields = [];
}
