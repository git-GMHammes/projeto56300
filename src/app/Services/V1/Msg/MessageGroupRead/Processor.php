<?php

namespace App\Services\V1\Msg\MessageGroupRead;

use App\Models\V1\Msg\MessageGroupRead\SqlTableModel;
use App\Models\V1\Msg\MessageGroupRead\SqlViewModel;
use App\Services\V1\Msg\MsgBaseService;

/**
 * Service de negócio para ponteiros de leitura de grupo (msg_007_group_read).
 *
 * Constraint UNIQUE (group_id, user_id): existe exatamente um registro por usuário por grupo.
 * O método markRead() encapsula o padrão upsert: cria na primeira leitura,
 * atualiza nas subsequentes — o controller não precisa saber qual operação usar.
 *
 * Tabela : msg_007_group_read — group_id, user_id, last_read_id
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
     * Valida FK de grupo e usuário; bloqueia insert duplicado.
     * Para atualizar o ponteiro, use markRead() ou o endpoint de update.
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
            && $this->groupReadExists((int) $data['group_id'], (int) $data['user_id'])
        ) {
            return ['success' => false, 'message' => 'Ponteiro de leitura já existe — use markRead() para atualizar', 'code' => 409];
        }

        return null;
    }

    // -------------------------------------------------------------------------
    // Hook de preparação de dados
    // -------------------------------------------------------------------------

    /**
     * group_id e user_id são imutáveis — apenas last_read_id pode mudar.
     */
    protected function prepareUpdateData(int $id, array $data): array
    {
        unset($data['group_id'], $data['user_id']);

        return $data;
    }

    // -------------------------------------------------------------------------
    // Operação de negócio
    // -------------------------------------------------------------------------

    /**
     * Upsert do ponteiro de leitura: cria na primeira vez, atualiza nas seguintes.
     * O controller usa sempre este método — nunca chama create/update diretamente.
     *
     * @return array{success: bool, data?: array, message?: string, code?: int}
     */
    public function markRead(int $groupId, int $userId, int $lastReadId): array
    {
        if ($this->groupReadExists($groupId, $userId)) {
            $existing = $this->tableModel
                ->where('group_id', $groupId)
                ->where('user_id', $userId)
                ->first();

            return $this->update((int) $existing['id'], ['last_read_id' => $lastReadId]);
        }

        return $this->create([
            'group_id'     => $groupId,
            'user_id'      => $userId,
            'last_read_id' => $lastReadId,
        ]);
    }
}
