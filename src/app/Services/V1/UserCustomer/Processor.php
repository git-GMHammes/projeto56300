<?php

namespace App\Services\V1\UserCustomer;

use App\Models\V1\UserCustomer\SqlTableModel;
use App\Models\V1\UserCustomer\SqlViewModel;
use App\Services\V1\BaseTableService;

/**
 * Service de negócio para o módulo UserCustomer.
 *
 * Toda a lógica genérica (leitura, escrita, exclusão) está em BaseService.
 * Este Processor sobrescreve apenas os hooks específicos do módulo:
 * validação de FK/unicidade e formatação dos campos de data.
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
    protected SqlViewModel  $viewModel;

    public function __construct()
    {
        $this->tableModel = new SqlTableModel();
        $this->viewModel  = new SqlViewModel();
    }

    // -------------------------------------------------------------------------
    // Hooks de validação
    // -------------------------------------------------------------------------

    /**
     * Validações antes do insert:
     *   - FK obrigatória com user_management
     *   - Unicidade de CPF, WhatsApp e e-mail entre registros ativos
     */
    protected function validateOnCreate(array $data): ?array
    {
        if (!empty($data['user_id']) && !$this->tableModel->existsUserManagement((int) $data['user_id'])) {
            return ['success' => false, 'message' => 'Usuário não encontrado em user_management', 'code' => 422];
        }

        if (!empty($data['cpf']) && $this->tableModel->existsByCpf($data['cpf'])) {
            return ['success' => false, 'message' => 'CPF já cadastrado', 'code' => 409];
        }

        if (!empty($data['whatsapp']) && $this->tableModel->existsByWhatsapp($data['whatsapp'])) {
            return ['success' => false, 'message' => 'WhatsApp já cadastrado', 'code' => 409];
        }

        if (!empty($data['mail']) && $this->tableModel->existsByMail($data['mail'])) {
            return ['success' => false, 'message' => 'E-mail já cadastrado', 'code' => 409];
        }

        return null;
    }

    /**
     * Validações antes do update:
     *   - Unicidade de CPF, WhatsApp e e-mail excluindo o próprio registro
     */
    protected function validateOnUpdate(int $id, array $data): ?array
    {
        if (!empty($data['cpf']) && $this->tableModel->existsByCpf($data['cpf'], $id)) {
            return ['success' => false, 'message' => 'CPF já cadastrado', 'code' => 409];
        }

        if (!empty($data['whatsapp']) && $this->tableModel->existsByWhatsapp($data['whatsapp'], $id)) {
            return ['success' => false, 'message' => 'WhatsApp já cadastrado', 'code' => 409];
        }

        if (!empty($data['mail']) && $this->tableModel->existsByMail($data['mail'], $id)) {
            return ['success' => false, 'message' => 'E-mail já cadastrado', 'code' => 409];
        }

        return null;
    }

    // -------------------------------------------------------------------------
    // Hooks de preparação de dados
    // -------------------------------------------------------------------------

    /**
     * Formata date_birth (Y-m-d) e validity (Y-m-d H:i:s) antes da persistência.
     */
    protected function prepareData(array $data): array
    {
        if (isset($data['date_birth'])) {
            $data['date_birth'] = $this->formatDate($data['date_birth']);
        }

        if (isset($data['validity'])) {
            $data['validity'] = $this->formatDatetime($data['validity']);
        }

        return $data;
    }

    /**
     * Remove o vínculo imutável user_id e delega a formatação de datas para prepareData.
     */
    protected function prepareUpdateData(int $id, array $data): array
    {
        unset($data['user_id']);

        return $this->prepareData($data);
    }
}
