<?php

namespace App\Models\V1\UserTenants;

use App\Models\V1\BaseTableModel;

/**
 * Model de escrita para a tabela user_tenants.
 *
 * Responsável por todas as operações CRUD diretas na tabela física.
 *
 * Tabela: user_tenants
 * DDL: id, user_id, tenant_id, role, created_at, updated_at, deleted_at
 */
class SqlTableModel extends BaseTableModel
{
    protected $DBGroup = DB_GROUP_001;
    protected $table = 'user_tenants';
    protected $primaryKey = 'id';
    protected $useSoftDeletes = true;
    protected $useTimestamps = true;

    /**
     * Campos que podem ser inseridos/atualizados via Model.
     * Exclui: id (PK), created_at/updated_at/deleted_at (timestamps).
     */
    protected $allowedFields = [
        'user_id',
        'tenant_id',
        'role',
    ];

    /**
     * Campos de texto que usam LIKE %valor% no find.
     * Exclui: user_id, tenant_id (FKs inteiros — busca exata com WHERE).
     */
    protected array $likeFields = [
        'role',
    ];

    /** Campos válidos para ordenação */
    protected array $sortableFields = [
        'id',
        'user_id',
        'tenant_id',
        'role',
        'created_at',
        'updated_at',
    ];

    /** Campos utilizados na busca textual (GET /search) */
    public array $searchFields = [
        'role',
    ];
}
