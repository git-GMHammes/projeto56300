<?php

namespace App\Services\V1\Msg\MessageTimeline;

use App\Libraries\Msg\ContentFilter;
use App\Models\V1\Msg\MessageTimeline\SqlTableModel;
use App\Models\V1\Msg\MessageTimeline\SqlViewModel;
use App\Services\V1\Msg\MsgBaseService;

/**
 * Service de negócio para posts públicos do mural (msg_001_timeline).
 *
 * Tabela : msg_001_timeline  — user_saas_tenants_id, user_id, content, is_pinned
 * View   : view_msg_timeline_feed — feed completo com autor e reações
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
     * Valida FK de tenant e usuário antes do insert.
     */
    protected function validateOnCreate(array $data): ?array
    {
        if (!empty($data['user_saas_tenants_id']) && !$this->existsTenant((int) $data['user_saas_tenants_id'])) {
            return ['success' => false, 'message' => 'Tenant não encontrado', 'code' => 422];
        }

        if (!empty($data['user_management_id']) && !$this->existsUser((int) $data['user_management_id'])) {
            return ['success' => false, 'message' => 'Usuário não encontrado', 'code' => 422];
        }

        return null;
    }

    // -------------------------------------------------------------------------
    // Hooks de preparação de dados
    // -------------------------------------------------------------------------

    /**
     * Sanitiza campos de texto antes do insert.
     */
    protected function prepareData(array $data): array
    {
        return ContentFilter::sanitizeFields($data, ['content']);
    }

    /**
     * user_saas_tenants_id e user_id são imutáveis após a criação do post.
     * Sanitiza content antes do update.
     */
    protected function prepareUpdateData(int $id, array $data): array
    {
        unset($data['user_saas_tenants_id'], $data['user_management_id']);

        return ContentFilter::sanitizeFields($data, ['content']);
    }

}
