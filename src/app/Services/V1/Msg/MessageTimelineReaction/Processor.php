<?php

namespace App\Services\V1\Msg\MessageTimelineReaction;

use App\Models\V1\Msg\MessageTimelineReaction\SqlTableModel;
use App\Models\V1\Msg\MessageTimelineReaction\SqlViewModel;
use App\Services\V1\Msg\MsgBaseService;

/**
 * Service de negócio para reações a posts do mural (msg_002_timeline_reaction).
 *
 * Constraint UNIQUE (timeline_id, user_id): uma reação por usuário por post.
 * Para alterar o tipo de reação, o cliente deve usar o endpoint de update.
 *
 * Tabela : msg_002_timeline_reaction — timeline_id, user_id, reaction (enum)
 * View   : view_msg_timeline_reaction (a criar)
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
     * Valida FK do post e do usuário; bloqueia duplicata de reação ativa.
     */
    protected function validateOnCreate(array $data): ?array
    {
        if (!empty($data['timeline_id']) && !$this->existsTimeline((int) $data['timeline_id'])) {
            return ['success' => false, 'message' => 'Post não encontrado', 'code' => 422];
        }

        if (!empty($data['user_id']) && !$this->existsUser((int) $data['user_id'])) {
            return ['success' => false, 'message' => 'Usuário não encontrado', 'code' => 422];
        }

        if (!empty($data['timeline_id']) && !empty($data['user_id'])
            && $this->reactionExists((int) $data['timeline_id'], (int) $data['user_id'])
        ) {
            return ['success' => false, 'message' => 'Reação já registrada — use o endpoint de update para alterá-la', 'code' => 409];
        }

        return null;
    }

    // -------------------------------------------------------------------------
    // Hook de preparação de dados
    // -------------------------------------------------------------------------

    /**
     * timeline_id e user_id são imutáveis — apenas o tipo de reação pode mudar.
     */
    protected function prepareUpdateData(int $id, array $data): array
    {
        unset($data['timeline_id'], $data['user_id']);

        return $data;
    }
}
