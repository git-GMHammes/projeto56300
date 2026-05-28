<?php

namespace App\Models\V1\Msg\MessageTimeline;

use App\Models\V1\BaseViewModel;

/**
 * Model de leitura para a view view_msg_timeline.
 *
 * JOINs:
 *   msg_001_timeline mt
 *   JOIN user_005_tenants ut ON ut.user_management_id = mt.user_management_id AND ut.user_saas_tenants_id = mt.user_saas_tenants_id
 *   JOIN user_001_management um ON um.id = mt.user_management_id
 *
 * Colunas disponíveis:
 *   id, created_at, updated_at, deleted_at,
 *   mt_user_saas_tenants_id, mt_user_management_id, mt_content, mt_is_pinned,
 *   ut_id, ut_user_management_id, ut_user_saas_tenants_id, ut_role,
 *   ut_created_at, ut_updated_at, ut_deleted_at,
 *   um_id, um_uuid, um_user, um_is_active,
 *   um_last_login, um_created_at, um_updated_at, um_deleted_at
 */
class SqlViewModel extends BaseViewModel
{
    protected $DBGroup    = DB_GROUP_001;
    protected $table      = 'view_msg_timeline';
    protected $primaryKey = 'id';

    protected array $likeFields = [
        'mt_content',
        'ut_role',
        'um_user',
    ];

    protected array $sortableFields = [
        'id',
        'mt_user_saas_tenants_id',
        'mt_is_pinned',
        'ut_role',
        'created_at',
    ];

    public array $searchFields = [
        'mt_user_saas_tenants_id',
        'mt_user_management_id',
        'mt_is_pinned',
        'ut_user_management_id',
        'ut_user_saas_tenants_id',
        'ut_role',
        'um_id',
    ];
}
