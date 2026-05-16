<?php

namespace App\Models\V1\Msg\MessageFile;

use App\Models\V1\BaseViewModel;

/**
 * Model de leitura para a view view_msg_file.
 *
 * JOIN: msg_003_timeline_file mf  INNER JOIN user_001_management um
 *
 * Colunas disponíveis:
 *   id,
 *   mf_source, mf_source_id, mf_user_management_id,
 *   mf_original_name, mf_filename, mf_stored_path, mf_uuid,
 *   mf_mime, mf_size, mf_category, mf_checksum,
 *   created_at, updated_at, deleted_at,
 *   um_id, um_uuid, um_user, um_is_active,
 *   um_password, um_last_login, um_created_at, um_updated_at, um_deleted_at
 */
class SqlViewModel extends BaseViewModel
{
    protected $DBGroup    = DB_GROUP_001;
    protected $table      = 'view_msg_file';
    protected $primaryKey = 'id';

    protected array $likeFields = [
        'mf_original_name',
        'mf_filename',
        'mf_uuid',
        'mf_mime',
        'um_user',
    ];

    protected array $sortableFields = [
        'id',
        'mf_source',
        'mf_category',
        'mf_size',
        'mf_mime',
        'created_at',
    ];

    public array $searchFields = [
        'mf_source',
        'mf_source_id',
        'mf_user_management_id',
        'mf_category',
        'um_id',
    ];
}
