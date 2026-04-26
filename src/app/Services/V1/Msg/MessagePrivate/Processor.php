<?php

namespace App\Services\V1\Msg\MessagePrivate;

use App\Libraries\Msg\ContentFilter;
use App\Models\V1\Msg\MessagePrivate\SqlTableModel;
use App\Models\V1\Msg\MessagePrivate\SqlViewModel;
use App\Services\V1\Msg\MsgBaseService;

/**
 * Service de negócio para mensagens diretas ponto a ponto (msg_003_private).
 *
 * Tabela : msg_003_private — tenant_id, sender_id, receiver_id, content, read_at
 * View   : view_msg_private_inbox — inbox agregado por par de usuários
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
     * Valida FK de tenant, remetente e destinatário antes do insert.
     */
    protected function validateOnCreate(array $data): ?array
    {
        if (!empty($data['tenant_id']) && !$this->existsTenant((int) $data['tenant_id'])) {
            return ['success' => false, 'message' => 'Tenant não encontrado', 'code' => 422];
        }

        if (!empty($data['sender_id']) && !$this->existsUser((int) $data['sender_id'])) {
            return ['success' => false, 'message' => 'Remetente não encontrado', 'code' => 422];
        }

        if (!empty($data['receiver_id']) && !$this->existsUser((int) $data['receiver_id'])) {
            return ['success' => false, 'message' => 'Destinatário não encontrado', 'code' => 422];
        }

        return null;
    }

    // -------------------------------------------------------------------------
    // Hooks de preparação de dados
    // -------------------------------------------------------------------------

    /**
     * Sanitiza content e normaliza read_at para o formato MySQL DATETIME.
     */
    protected function prepareData(array $data): array
    {
        $data = ContentFilter::sanitizeFields($data, ['content']);

        if (isset($data['read_at'])) {
            $data['read_at'] = $this->formatDatetime($data['read_at']);
        }

        return $data;
    }

    /**
     * tenant_id, sender_id e receiver_id são imutáveis após o envio.
     * Apenas content e read_at podem ser atualizados.
     */
    protected function prepareUpdateData(int $id, array $data): array
    {
        unset($data['tenant_id'], $data['sender_id'], $data['receiver_id']);

        return $this->prepareData($data);
    }
}
