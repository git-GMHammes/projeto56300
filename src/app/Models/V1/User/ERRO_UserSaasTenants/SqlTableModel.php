<?php

namespace App\Models\V1\User\UserSaasTenants;

use App\Models\V1\BaseTableModel;

/**
 * Model de escrita para a tabela user_004_saas_tenants.
 *
 * Responsável por todas as operações CRUD diretas na tabela física.
 *
 * Tabela: user_004_saas_tenants
 * DDL: id, name, slug, plan, active, created_at, updated_at, deleted_at
 */
class SqlTableModel extends BaseTableModel
{
    protected $DBGroup = DB_GROUP_001;
    protected $table = 'user_004_saas_tenants';
    protected $primaryKey = 'id';
    protected $useSoftDeletes = true;
    protected $useTimestamps = true;

    /**
     * Campos que podem ser inseridos/atualizados via Model.
     * Exclui: id (PK), created_at/updated_at/deleted_at (timestamps).
     */
    protected $allowedFields = [
        'name',
        'slug',
        'plan',
        'active',
    ];

    /**
     * Campos de texto que usam LIKE %valor% no find.
     * Exclui: active (tinyint boolean — busca exata com WHERE).
     */
    protected array $likeFields = [
        'name',
        'slug',
        'plan',
    ];

    /** Campos válidos para ordenação */
    protected array $sortableFields = [
        'id',
        'name',
        'slug',
        'plan',
        'active',
        'created_at',
        'updated_at',
    ];

    /** Campos utilizados na busca textual (GET /search) */
    public array $searchFields = [
        'name',
        'slug',
        'plan',
    ];
}
