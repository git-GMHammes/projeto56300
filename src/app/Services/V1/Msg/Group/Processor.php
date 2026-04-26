<?php

namespace App\Services\V1\Msg\Group;

use App\Libraries\Msg\ContentFilter;
use App\Models\V1\Msg\Group\SqlTableModel;
use App\Models\V1\Msg\Group\SqlViewModel;
use App\Services\V1\Msg\MsgBaseService;

/**
 * Service de negócio para grupos de chat (msg_004_group).
 *
 * O criador (created_by) recebe role admin automaticamente via GroupMember\Processor.
 * Esse vínculo é responsabilidade do controller ou de um orquestrador externo.
 *
 * Tabela : msg_004_group — tenant_id, name, description, avatar, created_by
 * View   : view_msg_group_summary — resumo com última mensagem e membros ativos
 *
 * Métodos de tabela: find, getGrouped, search, get, getAll, getNoPagination,
 *                    getDeleted, getDeletedAll, create, update,
 *                    deleteSoft, deleteRestore, deleteHard, clearDeleted
 *
 * Métodos de view  : findView, getGroupedView, searchView, getView,
 *                    getAllView, getNoPaginationView, getDeletedView, getDeletedAllView
 */
class Processor extends MsgBaseService
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
     * Valida FK de tenant e do criador antes do insert.
     */
    protected function validateOnCreate(array $data): ?array
    {
        if (!empty($data['tenant_id']) && !$this->existsTenant((int) $data['tenant_id'])) {
            return ['success' => false, 'message' => 'Tenant não encontrado', 'code' => 422];
        }

        if (!empty($data['created_by']) && !$this->existsUser((int) $data['created_by'])) {
            return ['success' => false, 'message' => 'Usuário criador não encontrado', 'code' => 422];
        }

        return null;
    }

    // -------------------------------------------------------------------------
    // Hooks de preparação de dados
    // -------------------------------------------------------------------------

    /**
     * Sanitiza name e description antes do insert.
     */
    protected function prepareData(array $data): array
    {
        return ContentFilter::sanitizeFields($data, ['name', 'description']);
    }

    /**
     * tenant_id e created_by são imutáveis após a criação do grupo.
     * name, description e avatar podem ser atualizados.
     * Sanitiza name e description antes do update.
     */
    protected function prepareUpdateData(int $id, array $data): array
    {
        unset($data['tenant_id'], $data['created_by']);

        return ContentFilter::sanitizeFields($data, ['name', 'description']);
    }
}
