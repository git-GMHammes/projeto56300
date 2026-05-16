<?php

namespace App\Models\V1\Msg\MessageFile;

use App\Models\V1\BaseTableModel;

/**
 * Model de escrita para a tabela msg_003_timeline_file.
 *
 * Anexos multimídia polimórficos: discriminador `source` (timeline|private|group)
 * + `source_id` aponta para o registro na tabela-mãe correspondente.
 *
 * Tabela: msg_003_timeline_file
 * DDL: id, source (enum), source_id, user_id, original_name, filename,
 *      stored_path (UNIQUE), uuid (UNIQUE), mime, size, category (enum),
 *      checksum, created_at, updated_at, deleted_at
 */
class SqlTableModel extends BaseTableModel
{
    protected $DBGroup      = DB_GROUP_001;
    protected $table        = 'msg_003_timeline_file';
    protected $primaryKey   = 'id';
    protected $useSoftDeletes = true;
    protected $useTimestamps  = true;

    protected $allowedFields = [
        'source',
        'source_id',
        'user_management_id',
        'original_name',
        'filename',
        'stored_path',
        'uuid',
        'mime',
        'size',
        'category',
        'checksum',
    ];

    protected array $likeFields = [
        'original_name',
        'filename',
        'stored_path',
    ];

    protected array $sortableFields = [
        'id',
        'category',
        'size',
        'created_at',
    ];

    public array $searchFields = [
        'original_name',
        'filename',
    ];
}
