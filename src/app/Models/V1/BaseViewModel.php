<?php

namespace App\Models\V1;

use CodeIgniter\Model;

/**
 * Model base para views SQL na API V1.
 *
 * Fornece exclusivamente operações de leitura sobre views de banco:
 * paginação, busca textual, agrupamento, consulta por ID e listagem.
 *
 * Views não sofrem escrita direta — useSoftDeletes e useTimestamps
 * são desabilitados; allowedFields é vazio por definição.
 *
 * Os SqlViewModel de cada módulo devem herdar desta classe,
 * declarar $table e sobrescrever os arrays de configuração.
 * Métodos específicos de negócio (ex: findByUser) permanecem no filho.
 */
abstract class BaseViewModel extends Model
{
    protected $DBGroup          = 'default';
    protected $primaryKey       = 'id';
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;
    protected $protectFields    = true;
    protected $useTimestamps    = false;
    protected $allowedFields    = [];

    /**
     * Campos permitidos para ordenação — sobrescrever nos filhos conforme a view.
     */
    protected array $sortableFields = ['id'];

    /**
     * Campos que usam LIKE %valor% no findPaginatedView.
     * Sobrescrever nos filhos com os campos de texto da view.
     */
    protected array $likeFields = [];

    /**
     * Campos utilizados na busca textual — sobrescrever nos filhos.
     */
    public array $searchFields = [];

    // -------------------------------------------------------------------------
    // Consultas sobre a view
    // -------------------------------------------------------------------------

    /**
     * Consulta paginada na view com filtros dinâmicos.
     * Por padrão exclui registros com deleted_at preenchido.
     *
     * @param array $filters     Mapa [campo => valor] aplicado como WHERE exato
     * @param bool  $withDeleted Inclui registros com deleted_at quando true
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
     * Busca registro ativo pelo ID na view.
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
     * Gera WHERE field IN (...) para cada chave — sem GROUP BY.
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

    // -------------------------------------------------------------------------
    // Utilitários internos
    // -------------------------------------------------------------------------

    /**
     * Aplica filtros ao builder: LIKE %valor% para campos em $likeFields,
     * WHERE exato (=) para os demais.
     *
     * @param \CodeIgniter\Database\BaseBuilder $builder
     * @param array $filters Mapa [campo => valor]
     */
    protected function applyFilters($builder, array $filters): void
    {
        foreach ($filters as $field => $value) {
            if ($value === null || $value === '') {
                continue;
            }

            if (\in_array($field, $this->likeFields, true)) {
                $builder->like($field, $value);
            } else {
                $builder->where($field, $value);
            }
        }
    }

    /**
     * Valida e sanitiza os parâmetros de ordenação para prevenir SQL Injection.
     *
     * @return array{0: string, 1: string} [$sort, $order]
     */
    protected function sanitizeSort(string $sort, string $order): array
    {
        $sort  = in_array($sort, $this->sortableFields, true) ? $sort : 'id';
        $order = in_array(strtolower($order), ['asc', 'desc'], true) ? strtolower($order) : 'desc';

        return [$sort, $order];
    }

    /**
     * Monta o array de resultado paginado no formato padrão da API.
     */
    protected function buildPaginatedResult(array $data, int $total, int $page, int $limit): array
    {
        return [
            'data'       => $data,
            'pagination' => [
                'page'  => $page,
                'limit' => $limit,
                'total' => $total,
                'pages' => $limit > 0 ? (int) ceil($total / $limit) : 0,
            ],
        ];
    }
}
