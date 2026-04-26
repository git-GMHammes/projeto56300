<?php

namespace App\Models\V1\Msg\GroupMember;

use App\Models\V1\BaseViewModel;

/**
 * Model de leitura para a view view_msg_group_member (a criar).
 *
 * Listagem de membros ativos de um grupo com dados do usuário.
 *
 * Campos esperados na view (a definir):
 *   id, group_id, user_id, role, joined_at, left_at,
 *   user_name, user_avatar, deleted_at
 */
class SqlViewModel extends BaseViewModel
{
    protected $DBGroup      = DB_GROUP_001;
    protected $table        = 'view_msg_group_member';
    protected $primaryKey   = 'id';

    protected array $likeFields = [];

    protected array $sortableFields = [
        'id',
        'joined_at',
    ];

    public array $searchFields = [];
}
