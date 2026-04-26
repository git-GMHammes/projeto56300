<?php

namespace App\Services\V1\Msg;

use App\Services\V1\BaseTableService;

/**
 * Base abstrata para todos os Processors do módulo Messaging.
 *
 * Centraliza os helpers de validação de chaves estrangeiras e regras
 * de integridade referencial compartilhadas entre as 8 entidades do módulo.
 * Nenhum Processor filho deve replicar essas consultas.
 *
 * Cadeia de herança:
 *   BaseViewService → BaseTableService → MsgBaseService → Processor
 */
abstract class MsgBaseService extends BaseTableService
{
    // -------------------------------------------------------------------------
    // Conexão interna
    // -------------------------------------------------------------------------

    private function msgDb(): \CodeIgniter\Database\BaseConnection
    {
        return db_connect(DB_GROUP_001);
    }

    // -------------------------------------------------------------------------
    // Verificações de existência — tabelas externas ao módulo
    // -------------------------------------------------------------------------

    /** Tenant ativo em user_saas_tenants. */
    protected function existsTenant(int $id): bool
    {
        return $this->msgDb()->table('user_saas_tenants')
            ->where('id', $id)
            ->where('deleted_at IS NULL', null, false)
            ->countAllResults() > 0;
    }

    /** Usuário ativo em user_management. */
    protected function existsUser(int $id): bool
    {
        return $this->msgDb()->table('user_management')
            ->where('id', $id)
            ->where('deleted_at IS NULL', null, false)
            ->countAllResults() > 0;
    }

    // -------------------------------------------------------------------------
    // Verificações de existência — tabelas internas do módulo
    // -------------------------------------------------------------------------

    /** Post ativo em msg_001_timeline. */
    protected function existsTimeline(int $id): bool
    {
        return $this->msgDb()->table('msg_001_timeline')
            ->where('id', $id)
            ->where('deleted_at IS NULL', null, false)
            ->countAllResults() > 0;
    }

    /** Grupo ativo em msg_004_group. */
    protected function existsGroup(int $id): bool
    {
        return $this->msgDb()->table('msg_004_group')
            ->where('id', $id)
            ->where('deleted_at IS NULL', null, false)
            ->countAllResults() > 0;
    }

    /** Mensagem de grupo ativa em msg_006_group_message. */
    protected function existsGroupMessage(int $id): bool
    {
        return $this->msgDb()->table('msg_006_group_message')
            ->where('id', $id)
            ->where('deleted_at IS NULL', null, false)
            ->countAllResults() > 0;
    }

    // -------------------------------------------------------------------------
    // Verificações de estado de negócio
    // -------------------------------------------------------------------------

    /**
     * Verifica se o usuário é membro ativo do grupo (left_at IS NULL).
     * Usado por GroupMessage para garantir que só membros enviam mensagens.
     */
    protected function isActiveMember(int $groupId, int $userId): bool
    {
        return $this->msgDb()->table('msg_005_group_member')
            ->where('group_id', $groupId)
            ->where('user_id', $userId)
            ->where('left_at IS NULL', null, false)
            ->where('deleted_at IS NULL', null, false)
            ->countAllResults() > 0;
    }

    /**
     * Verifica se já existe reação ativa do usuário no post.
     * Constraint UNIQUE (timeline_id, user_id) — previne duplicata antes do INSERT.
     */
    protected function reactionExists(int $timelineId, int $userId): bool
    {
        return $this->msgDb()->table('msg_002_timeline_reaction')
            ->where('timeline_id', $timelineId)
            ->where('user_id', $userId)
            ->where('deleted_at IS NULL', null, false)
            ->countAllResults() > 0;
    }

    /**
     * Verifica se já existe ponteiro de leitura para o par (group, user).
     * Constraint UNIQUE (group_id, user_id) — decide entre INSERT e UPDATE.
     */
    protected function groupReadExists(int $groupId, int $userId): bool
    {
        return $this->msgDb()->table('msg_007_group_read')
            ->where('group_id', $groupId)
            ->where('user_id', $userId)
            ->countAllResults() > 0;
    }
}
