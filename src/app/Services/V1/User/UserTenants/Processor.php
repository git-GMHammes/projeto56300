<?php

namespace App\Services\V1\User\UserTenants;

use App\Models\V1\User\UserTenants\SqlTableModel;
use App\Models\V1\User\UserTenants\SqlViewModel;
use App\Services\V1\BaseTableService;

/**
 * Service de negócio para o módulo UserTenants.
 *
 * Regras do módulo:
 *   - A combinação (user_id + tenant_id) deve ser única entre registros ativos.
 *   - Após a criação, user_id e tenant_id são imutáveis — apenas role pode ser atualizado.
 */
class Processor extends BaseTableService
{
    protected SqlTableModel $tableModel;
    protected SqlViewModel  $viewModel;

    public function __construct()
    {
        $this->tableModel = new SqlTableModel();
        $this->viewModel  = new SqlViewModel();
    }

    protected function validateOnCreate(array $data): ?array
    {
        $userId   = isset($data['user_id'])   ? (int) $data['user_id']   : 0;
        $tenantId = isset($data['tenant_id']) ? (int) $data['tenant_id'] : 0;

        if ($userId > 0 && $tenantId > 0 && $this->tableModel->existsByUserAndTenant($userId, $tenantId)) {
            return ['success' => false, 'message' => 'Este usuário já está vinculado a este tenant', 'code' => 409];
        }

        return null;
    }

    protected function prepareUpdateData(int $id, array $data): array
    {
        unset($data['user_id'], $data['tenant_id']);

        return $data;
    }
}
