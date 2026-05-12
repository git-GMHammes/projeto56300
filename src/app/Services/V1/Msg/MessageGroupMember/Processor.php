<?php

namespace App\Services\V1\Msg\MessageGroupMember;

use App\Models\V1\Msg\MessageGroupMember\SqlTableModel;
use App\Models\V1\Msg\MessageGroupMember\SqlViewModel;
use App\Services\V1\Msg\MsgBaseService;

/**
 * Service de negócio para membros de grupos (msg_005_group_member).
 *
 * Regra de negócio: um usuário não pode ser inserido duas vezes como membro
 * ativo do mesmo grupo (left_at IS NULL). Para reativar um membro que saiu,
 * use update definindo left_at = NULL — não crie um novo registro.
 *
 * Tabela : msg_005_group_member — group_id, user_id, role, joined_at, left_at
 * View   : view_msg_group_member (a criar)
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
     * Valida FK de grupo e usuário; bloqueia duplicata de membresia ativa.
     */
    protected function validateOnCreate(array $data): ?array
    {
        if (!empty($data['group_id']) && !$this->existsGroup((int) $data['group_id'])) {
            return ['success' => false, 'message' => 'Grupo não encontrado', 'code' => 422];
        }

        if (!empty($data['user_management_id']) && !$this->existsUser((int) $data['user_management_id'])) {
            return ['success' => false, 'message' => 'Usuário não encontrado', 'code' => 422];
        }

        if (!empty($data['group_id']) && !empty($data['user_management_id'])
            && $this->isActiveMember((int) $data['group_id'], (int) $data['user_management_id'])
        ) {
            return ['success' => false, 'message' => 'Usuário já é membro ativo do grupo', 'code' => 409];
        }

        return null;
    }

    // -------------------------------------------------------------------------
    // Hooks de preparação de dados
    // -------------------------------------------------------------------------

    /**
     * Normaliza joined_at e left_at para o formato MySQL DATETIME.
     */
    protected function prepareData(array $data): array
    {
        if (isset($data['joined_at'])) {
            $data['joined_at'] = $this->formatDatetime($data['joined_at']);
        }

        if (isset($data['left_at'])) {
            $data['left_at'] = $this->formatDatetime($data['left_at']);
        }

        return $data;
    }

    /**
     * group_id e user_id são imutáveis — apenas role, joined_at e left_at podem mudar.
     */
    protected function prepareUpdateData(int $id, array $data): array
    {
        unset($data['group_id'], $data['user_management_id']);

        return $this->prepareData($data);
    }
}
