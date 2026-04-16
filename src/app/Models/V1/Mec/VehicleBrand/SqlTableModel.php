<?php

namespace App\Models\V1\Mec\VehicleBrand;

use App\Models\V1\BaseTableModel;

/**
 * Model de escrita para a tabela mec_01_vehicle_brand.
 *
 * Responsável por todas as operações CRUD diretas na tabela física.
 * Inclui verificações de unicidade para CPF, WhatsApp e e-mail,
 * respeitando os registros com soft delete.
 *
 * Tabela: mec_01_vehicle_brand
 * DDL: id, user_id, name, cpf, whatsapp, profile, mail, phone,
 *      date_birth, zip_code, address, tenant_at, validity, created_at, updated_at, deleted_at, user_id_active (generated)
 */
class SqlTableModel extends BaseTableModel
{
    protected $DBGroup = DB_GROUP_001;
    protected $table = 'mec_01_vehicle_brand';
    protected $primaryKey = 'id';
    protected $useSoftDeletes = true;
    protected $useTimestamps = true;

    /**
     * Campos que podem ser inseridos/atualizados via Model.
     * Exclui: id (PK), created_at/updated_at/deleted_at (timestamps), user_id_active (coluna gerada).
     */
    protected $allowedFields = [
        'name'
    ];

    /**
     * Campos de texto que usam LIKE %valor% no find.
     * Campos relacionais/numéricos (id, user_id, datas) usam WHERE exato.
     */
    protected array $likeFields = [
        'name'
    ];

    /** Campos válidos para ordenação */
    protected array $sortableFields = [
        'name'
    ];

    /** Campos utilizados na busca textual (GET /search) */
    public array $searchFields = [
        'name'
    ];

}
