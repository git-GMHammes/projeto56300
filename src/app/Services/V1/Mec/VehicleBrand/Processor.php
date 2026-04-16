<?php

namespace App\Services\V1\VehicleBrand;

use App\Models\V1\Mec\VehicleBrand\SqlTableModel;
use App\Services\V1\BaseTableService;

/**
 * Service de negócio para o módulo VehicleBrand.
 *
 * Toda a lógica genérica (leitura, escrita, exclusão) está em BaseTableService.
 * Este Processor sobrescreve apenas os hooks específicos do módulo:
 * unicidade do campo name (UNIQUE INDEX na tabela mec_01_vehicle_brand).
 *
 * Tabela: mec_01_vehicle_brand
 * Campos: id, name, created_at, updated_at, deleted_at
 *
 * Métodos de tabela: find, getGrouped, search, get, getAll, getNoPagination,
 *                    getDeleted, getDeletedAll, create, update,
 *                    deleteSoft, deleteRestore, deleteHard, clearDeleted
 *
 * Métodos de view:   findView, getGroupedView, searchView, getView,
 *                    getAllView, getNoPaginationView, getDeletedView, getDeletedAllView
 */
class Processor extends BaseTableService
{
    protected SqlTableModel $tableModel;

    public function __construct()
    {
        $this->tableModel = new SqlTableModel();
    }

    // -------------------------------------------------------------------------
    // Hooks de validação
    // -------------------------------------------------------------------------

    /**
     * Validações antes do insert:
     *   - Unicidade de name entre registros ativos
     */
    protected function validateOnCreate(array $data): ?array
    {
        if (!empty($data['name']) && $this->tableModel->existsByField('name', $data['name'])) {
            return ['success' => false, 'message' => 'Marca já cadastrada', 'code' => 409];
        }

        return null;
    }

    /**
     * Validações antes do update:
     *   - Unicidade de name excluindo o próprio registro
     */
    protected function validateOnUpdate(int $id, array $data): ?array
    {
        if (!empty($data['name']) && $this->tableModel->existsByField('name', $data['name'], $id)) {
            return ['success' => false, 'message' => 'Marca já cadastrada', 'code' => 409];
        }

        return null;
    }
}
