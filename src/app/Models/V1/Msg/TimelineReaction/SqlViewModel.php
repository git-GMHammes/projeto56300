<?php

namespace App\Models\V1\Msg\TimelineReaction;

use App\Models\V1\BaseViewModel;

/**
 * Model de leitura para a view view_msg_timeline_reaction (a criar).
 *
 * Reações detalhadas por post do mural com dados do usuário.
 *
 * Campos esperados na view (a definir):
 *   id, timeline_id, user_id, reaction, created_at,
 *   user_name, user_avatar, deleted_at
 */
class SqlViewModel extends BaseViewModel
{
    protected $DBGroup      = DB_GROUP_001;
    protected $table        = 'view_msg_timeline_reaction';
    protected $primaryKey   = 'id';

    protected array $likeFields = [];

    protected array $sortableFields = [
        'id',
        'reaction',
        'created_at',
    ];

    public array $searchFields = [];
}
