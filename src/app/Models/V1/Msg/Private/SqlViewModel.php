<?php

namespace App\Models\V1\Msg\Private;

use App\Models\V1\BaseViewModel;

/**
 * Model de leitura para a view view_msg_private_inbox.
 *
 * Inbox de conversas privadas: agrega uma linha por par de usuários (A↔B)
 * com a última mensagem e total de não lidas.
 * A view já filtra mensagens soft-deleted internamente.
 *
 * Campos disponíveis:
 *   tenant_id, user_a_id, user_b_id,
 *   last_message_id, last_message_at, total_unread
 *
 * Atenção: esta view não possui coluna id nem deleted_at.
 * Usar withDeleted = true em todas as chamadas ao BaseViewModel.
 */
class SqlViewModel extends BaseViewModel
{
    protected $DBGroup      = DB_GROUP_001;
    protected $table        = 'view_msg_private_inbox';
    protected $primaryKey   = 'last_message_id';

    protected array $likeFields = [];

    protected array $sortableFields = [
        'last_message_at',
        'last_message_id',
        'total_unread',
    ];

    public array $searchFields = [];

    /**
     * Inbox paginado de um usuário num tenant.
     * Retorna conversas em que o usuário é remetente ou destinatário.
     */
    public function findByUser(
        int $userId,
        int $tenantId,
        int $page = 1,
        int $limit = 20,
        string $sort = 'last_message_at',
        string $order = 'desc'
    ): array {
        [$sort, $order] = $this->sanitizeSort($sort, $order);

        $builder = $this->db->table($this->table)
            ->where('tenant_id', $tenantId)
            ->groupStart()
                ->where('user_a_id', $userId)
                ->orWhere('user_b_id', $userId)
            ->groupEnd();

        $total = $builder->countAllResults(false);

        $data = $builder
            ->orderBy($sort, $order)
            ->limit($limit, ($page - 1) * $limit)
            ->get()
            ->getResultArray();

        return $this->buildPaginatedResult($data, $total, $page, $limit);
    }
}
