<?php

namespace App\Models\V1\User\UserCustomerFiles;

use App\Models\V1\BaseTableModel;

/**
 * Model de escrita para a tabela user_002_customer_files.
 *
 * Responsável por todas as operações CRUD diretas na tabela física.
 *
 * Tabela: user_002_customer_files
 * DDL: id, user_002_customer_id, original_name, filename, stored_path,
 *      uuid, mime, size, category, checksum, created_at, updated_at, deleted_at
 */
class SqlTableModel extends BaseTableModel
{
    protected $DBGroup = DB_GROUP_001;
    protected $table = 'user_002_customer_files';
    protected $primaryKey = 'id';
    protected $useSoftDeletes = true;
    protected $useTimestamps = true;

    /**
     * Campos que podem ser inseridos/atualizados via Model.
     * Exclui: id (PK), created_at/updated_at/deleted_at (timestamps).
     */
    protected $allowedFields = [
        'user_002_customer_id',
        'original_name',
        'filename',
        'stored_path',
        'uuid',
        'mime',
        'size',
        'category',
        'checksum',
    ];

    /**
     * Campos de texto que usam LIKE %valor% no find.
     * Exclui: uuid/checksum (hashes — busca exata), size (int), user_002_customer_id (FK int).
     */
    protected array $likeFields = [
        'original_name',
        'filename',
        'stored_path',
        'mime',
        'category',
    ];

    /** Campos válidos para ordenação */
    protected array $sortableFields = [
        'id',
        'original_name',
        'filename',
        'category',
        'size',
        'created_at',
        'updated_at',
    ];

    /** Campos utilizados na busca textual (GET /search) */
    public array $searchFields = [
        'original_name',
        'filename',
        'category',
    ];
}
