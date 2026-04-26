<?php

namespace App\Models\V1\Msg\Timeline;

use App\Models\V1\BaseViewModel;

/**
 * Model de leitura para a view view_msg_timeline_feed.
 *
 * Feed completo de posts do mural com dados do autor e contagem de reações.
 * A view já filtra posts soft-deleted internamente (WHERE ISNULL t.deleted_at),
 * portanto usar withDeleted = true ao chamar findPaginatedView.
 *
 * Campos disponíveis:
 *   post_id, tenant_id, content, is_pinned, created_at, updated_at,
 *   author_customer_id, author_name, author_avatar,
 *   total_reactions, cnt_like, cnt_love, cnt_haha, cnt_wow, cnt_sad, cnt_angry,
 *   first_attachment_path, first_attachment_category
 *
 * Atenção: a PK é post_id, não id.
 */
class SqlViewModel extends BaseViewModel
{
    protected $DBGroup      = DB_GROUP_001;
    protected $table        = 'view_msg_timeline_feed';
    protected $primaryKey   = 'post_id';

    protected array $likeFields = [
        'content',
        'author_name',
    ];

    protected array $sortableFields = [
        'post_id',
        'is_pinned',
        'total_reactions',
        'created_at',
        'updated_at',
    ];

    public array $searchFields = [
        'content',
        'author_name',
    ];

    /**
     * Feed paginado de um tenant, fixados no topo e depois por data desc.
     * A view já exclui posts soft-deleted — withDeleted = true evita
     * a cláusula WHERE deleted_at IS NULL que não existe nesta view.
     */
    public function findByTenant(
        int $tenantId,
        int $page = 1,
        int $limit = 20
    ): array {
        [$sort, $order] = $this->sanitizeSort('post_id', 'desc');

        $builder = $this->db->table($this->table)
            ->where('tenant_id', $tenantId)
            ->orderBy('is_pinned', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit($limit, ($page - 1) * $limit);

        $total = $this->db->table($this->table)
            ->where('tenant_id', $tenantId)
            ->countAllResults();

        $data = $builder->get()->getResultArray();

        return $this->buildPaginatedResult($data, $total, $page, $limit);
    }
}
