<?php

namespace App\Services\V1\Msg\GroupMessage;

use App\Libraries\Msg\ContentFilter;
use App\Models\V1\Msg\GroupMessage\SqlTableModel;
use App\Models\V1\Msg\GroupMessage\SqlViewModel;
use App\Services\V1\Msg\MsgBaseService;

/**
 * Service de negócio para mensagens de grupo (msg_006_group_message).
 *
 * Apenas membros ativos do grupo podem enviar mensagens.
 * reply_to_id é opcional — quando informado, deve referenciar uma mensagem ativa do mesmo grupo.
 *
 * Tabela : msg_006_group_message — group_id, user_id, reply_to_id, content
 * View   : (sem view dedicada neste momento)
 *
 * Métodos de tabela: find, getGrouped, search, get, getAll, getNoPagination,
 *                    getDeleted, getDeletedAll, create, update,
 *                    deleteSoft, deleteRestore, deleteHard, clearDeleted
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
     * Valida:
     *   - FK do grupo
     *   - FK do usuário
     *   - Usuário é membro ativo do grupo (autorização)
     *   - reply_to_id referencia mensagem ativa (se informado)
     */
    protected function validateOnCreate(array $data): ?array
    {
        if (!empty($data['group_id']) && !$this->existsGroup((int) $data['group_id'])) {
            return ['success' => false, 'message' => 'Grupo não encontrado', 'code' => 422];
        }

        if (!empty($data['user_id']) && !$this->existsUser((int) $data['user_id'])) {
            return ['success' => false, 'message' => 'Usuário não encontrado', 'code' => 422];
        }

        if (!empty($data['group_id']) && !empty($data['user_id'])
            && !$this->isActiveMember((int) $data['group_id'], (int) $data['user_id'])
        ) {
            return ['success' => false, 'message' => 'Usuário não é membro ativo do grupo', 'code' => 403];
        }

        if (!empty($data['reply_to_id']) && !$this->existsGroupMessage((int) $data['reply_to_id'])) {
            return ['success' => false, 'message' => 'Mensagem citada não encontrada', 'code' => 422];
        }

        return null;
    }

    // -------------------------------------------------------------------------
    // Hooks de preparação de dados
    // -------------------------------------------------------------------------

    /**
     * Sanitiza content antes do insert.
     */
    protected function prepareData(array $data): array
    {
        return ContentFilter::sanitizeFields($data, ['content']);
    }

    /**
     * group_id, user_id e reply_to_id são imutáveis após o envio.
     * Apenas o conteúdo da mensagem pode ser editado.
     * Sanitiza content antes do update.
     */
    protected function prepareUpdateData(int $id, array $data): array
    {
        unset($data['group_id'], $data['user_id'], $data['reply_to_id']);

        return ContentFilter::sanitizeFields($data, ['content']);
    }
}
