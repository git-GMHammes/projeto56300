<?php

namespace App\Models\V1\Msg\MessageGroupRead;

use App\Models\V1\BaseViewModel;

/**
 * Model de leitura para a view view_msg_group_read.
 *
 * JOINs:
 *   msg_007_group_read mgr
 *   INNER JOIN msg_004_group mg ON mgr.group_id = mg.id
 *
 * Colunas disponíveis:
 *   id,
 *   mgr_group_id, mgr_user_management_id, mgr_last_read_id,
 *   created_at, updated_at, deleted_at,
 *   mg_id, mg_tenant_id, mg_name, mg_description, mg_avatar,
 *   mg_created_by, mg_created_at, mg_updated_at, mg_deleted_at
 */
class SqlViewModel extends BaseViewModel
{
    protected $DBGroup    = DB_GROUP_001;
    protected $table      = 'view_msg_group_read';
    protected $primaryKey = 'id';

    protected array $likeFields = [
        'mg_name',
        'mg_description',
    ];

    protected array $sortableFields = [
        'id',
        'mgr_group_id',
        'mgr_last_read_id',
        'created_at',
    ];

    public array $searchFields = [
        'mgr_group_id',
        'mgr_user_management_id',
        'mg_tenant_id',
        'mg_created_by',
    ];
}
