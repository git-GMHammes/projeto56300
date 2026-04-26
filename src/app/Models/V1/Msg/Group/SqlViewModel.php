<?php

namespace App\Models\V1\Msg\Group;

use App\Models\V1\BaseViewModel;

/**
 * Model de leitura para a view view_msg_group_summary.
 *
 * Expõe um resumo por grupo: última mensagem e contagem de membros ativos.
 * A view já filtra grupos soft-deleted internamente (WHERE ISNULL grp.deleted_at),
 * portanto usar withDeleted = true ao chamar findPaginatedView.
 *
 * Campos disponíveis:
 *   group_id, tenant_id, group_name, group_avatar, group_deleted_at,
 *   last_message_id, last_message_content, last_message_at, active_members
 *
 * Atenção: a PK é group_id, não id.
 */
class SqlViewModel extends BaseViewModel
{
    protected $DBGroup      = DB_GROUP_001;
    protected $table        = 'view_msg_group_summary';
    protected $primaryKey   = 'group_id';

    protected array $likeFields = [
        'group_name',
        'last_message_content',
    ];

    protected array $sortableFields = [
        'group_id',
        'group_name',
        'last_message_at',
        'active_members',
    ];

    public array $searchFields = [
        'group_name',
    ];

    /**
     * Lista grupos ativos de um tenant, ordenados pela última mensagem.
     * A view já exclui grupos soft-deleted — withDeleted = true evita
     * a cláusula WHERE deleted_at IS NULL que não existe nesta view.
     */
    public function findByTenant(
        int $tenantId,
        int $page = 1,
        int $limit = 20,
        string $sort = 'last_message_at',
        string $order = 'desc'
    ): array {
        return $this->findPaginatedView(
            filters: ['tenant_id' => $tenantId],
            page: $page,
            limit: $limit,
            sort: $sort,
            order: $order,
            withDeleted: true
        );
    }
}
