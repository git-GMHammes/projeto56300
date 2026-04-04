<?php

namespace App\Models\V1\UserCustomer;

use App\Models\V1\BaseModel;

/**
 * Model de leitura para a view view_customer.
 *
 * Responsável exclusivamente por consultas (read-only).
 * A view une user_customer (uc) com user_management (um),
 * expondo os dados com prefixo uc_ para campos do cliente
 * e usando os timestamps de user_management.
 *
 * Campos disponíveis na view:
 *   id, uc_id, um_user, uc_user_id, uc_name, uc_cpf, uc_whatsapp,
 *   uc_profile, uc_mail, uc_phone, uc_date_birth, uc_zip_code,
 *   uc_address, uc_tenant_at, uc_validity, created_at, updated_at, deleted_at
 *
 * O campo deleted_at reflete user_management.deleted_at.
 */
class SqlViewModel extends BaseModel
{
    protected $DBGroup = DB_GROUP_001;
    protected $table = 'view_customer';
    protected $primaryKey = 'id';
    protected $useSoftDeletes = false; // View não suporta escrita; filtro manual aplicado
    protected $useTimestamps = false;

    /**
     * Nenhum campo permitido para escrita — model somente leitura.
     */
    protected $allowedFields = [];

    /**
     * Campos de texto que usam LIKE %valor% no findPaginatedView.
     * Campos relacionais/numéricos (id, uc_id, uc_user_id, datas) usam WHERE exato.
     */
    protected array $likeFields = [
        'um_user', 'uc_name', 'uc_cpf', 'uc_whatsapp', 'uc_phone',
        'uc_mail', 'uc_address', 'uc_profile', 'uc_zip_code', 'uc_tenant_at',
    ];

    /** Campos válidos para ordenação */
    protected array $sortableFields = [
        'id',
        'uc_id',
        'um_user',
        'uc_name',
        'uc_cpf',
        'uc_mail',
        'uc_whatsapp',
        'uc_validity',
        'created_at',
        'updated_at',
    ];

    /** Campos utilizados na busca textual (GET /search) */
    public array $searchFields = [
        'um_user',
        'uc_name',
        'uc_cpf',
        'uc_mail',
        'uc_whatsapp',
        'uc_phone',
        'uc_address',
        'uc_tenant_at',
    ];

    // -------------------------------------------------------------------------
    // Consultas sobre a view
    // -------------------------------------------------------------------------

    /**
     * Consulta paginada na view com filtros dinâmicos.
     * Por padrão exclui registros com deleted_at preenchido.
     *
     * @param array  $filters     Mapa [campo => valor] aplicado como WHERE exato
     * @param bool   $withDeleted Inclui registros com deleted_at quando true
     */
    public function findPaginatedView(
        array $filters = [],
        int $page = 1,
        int $limit = 20,
        string $sort = 'id',
        string $order = 'desc',
        bool $withDeleted = false
    ): array {
        [$sort, $order] = $this->sanitizeSort($sort, $order);

        $builder = $this->db->table($this->table);

        if (!$withDeleted) {
            $builder->where('deleted_at IS NULL', null, false);
        }

        $this->applyFilters($builder, $filters);

        $total = $builder->countAllResults(false);

        $data = $builder
            ->orderBy($sort, $order)
            ->limit($limit, ($page - 1) * $limit)
            ->get()
            ->getResultArray();

        return $this->buildPaginatedResult($data, $total, $page, $limit);
    }

    /**
     * Busca registro pelo ID na view (somente ativos).
     */
    public function findById(int $id): ?array
    {
        $result = $this->db->table($this->table)
            ->where('id', $id)
            ->where('deleted_at IS NULL', null, false)
            ->get()
            ->getRowArray();

        return $result ?: null;
    }

    /**
     * Busca registro soft-deleted pelo ID na view.
     */
    public function findDeletedById(int $id): ?array
    {
        $result = $this->db->table($this->table)
            ->where('id', $id)
            ->where('deleted_at IS NOT NULL', null, false)
            ->get()
            ->getRowArray();

        return $result ?: null;
    }

    /**
     * Lista registros soft-deleted com paginação na view.
     */
    public function findDeletedPaginatedView(
        int $page = 1,
        int $limit = 20,
        string $sort = 'id',
        string $order = 'desc'
    ): array {
        [$sort, $order] = $this->sanitizeSort($sort, $order);

        $builder = $this->db->table($this->table)
            ->where('deleted_at IS NOT NULL', null, false);

        $total = $builder->countAllResults(false);

        $data = $builder
            ->orderBy($sort, $order)
            ->limit($limit, ($page - 1) * $limit)
            ->get()
            ->getResultArray();

        return $this->buildPaginatedResult($data, $total, $page, $limit);
    }

    /**
     * Busca textual paginada na view (somente registros ativos).
     *
     * @param string $term Termo pesquisado nos $searchFields
     */
    public function searchByTermView(
        string $term,
        int $page = 1,
        int $limit = 20,
        string $sort = 'id',
        string $order = 'desc'
    ): array {
        [$sort, $order] = $this->sanitizeSort($sort, $order);

        $builder = $this->db->table($this->table)
            ->where('deleted_at IS NULL', null, false);

        if ($term !== '') {
            $builder->groupStart();
            foreach ($this->searchFields as $index => $field) {
                $index === 0
                    ? $builder->like($field, $term)
                    : $builder->orLike($field, $term);
            }
            $builder->groupEnd();
        }

        $total = $builder->countAllResults(false);

        $data = $builder
            ->orderBy($sort, $order)
            ->limit($limit, ($page - 1) * $limit)
            ->get()
            ->getResultArray();

        return $this->buildPaginatedResult($data, $total, $page, $limit);
    }

    /**
     * Listagem filtrada paginada na view (somente registros ativos).
     *
     * Cada chave de $multiFilters é um campo da view; cada valor é um array
     * de strings aceitas. Gera WHERE field IN (...) para cada chave, sem
     * nenhum GROUP BY — todos os registros correspondentes são retornados
     * individualmente.
     *
     * Exemplo: ['uc_profile' => ['Cliente VIP', 'Cliente Premium'], 'uc_user_id' => ['80']]
     * → WHERE uc_profile IN ('Cliente VIP','Cliente Premium') AND uc_user_id IN ('80')
     *
     * @param array $multiFilters Mapa [campo => array_de_valores]
     */
    public function findGroupedView(
        array $multiFilters = [],
        int $page = 1,
        int $limit = 20,
        string $sort = 'id',
        string $order = 'desc'
    ): array {
        [$sort, $order] = $this->sanitizeSort($sort, $order);

        $builder = $this->db->table($this->table)
            ->where('deleted_at IS NULL', null, false);

        // WHERE field IN (v1, v2, ...) — sem GROUP BY, cada linha é retornada individualmente
        foreach ($multiFilters as $field => $values) {
            if (!empty($values)) {
                $builder->whereIn($field, array_values($values));
            }
        }

        $total = $builder->countAllResults(false);

        $data = $builder
            ->orderBy($sort, $order)
            ->limit($limit, ($page - 1) * $limit)
            ->get()
            ->getResultArray();

        return $this->buildPaginatedResult($data, $total, $page, $limit);
    }

    /**
     * Lista todos os registros ativos da view sem paginação.
     * Usar com cautela — pode retornar grande volume de dados.
     */
    public function findAllView(string $sort = 'id', string $order = 'desc'): array
    {
        [$sort, $order] = $this->sanitizeSort($sort, $order);

        return $this->db->table($this->table)
            ->where('deleted_at IS NULL', null, false)
            ->orderBy($sort, $order)
            ->get()
            ->getResultArray();
    }
}
