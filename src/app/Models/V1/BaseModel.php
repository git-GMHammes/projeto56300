<?php

namespace App\Models\V1;

use CodeIgniter\Model;

/**
 * Modelo base para a API V1.
 *
 * Fornece paginação padronizada, busca textual, agrupamento e sanitização
 * de parâmetros de ordenação. Todos os Models da V1 devem herdar desta classe.
 */
abstract class BaseModel extends Model
{
    protected $DBGroup          = 'default';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = true;
    protected $protectFields    = true;
    protected $useTimestamps    = true;
    protected $createdField     = 'created_at';
    protected $updatedField     = 'updated_at';
    protected $deletedField     = 'deleted_at';
    protected $dateFormat       = 'datetime';

    /**
     * Campos excluídos de qualquer retorno de consulta.
     * Sobrescrever nos filhos com os campos sensíveis da tabela.
     */
    protected $hidden = [];

    /**
     * Campos permitidos para ordenação — sobrescrever nos filhos conforme a tabela/view.
     */
    protected array $sortableFields = ['id', 'created_at', 'updated_at'];

    /**
     * Campos que usam LIKE %valor% no findPaginated/findPaginatedView.
     * Todos os outros campos usam WHERE exato (=).
     * Sobrescrever nos filhos com os campos de texto da tabela/view.
     */
    protected array $likeFields = [];

    // -------------------------------------------------------------------------
    // Sobrescrita de métodos nativos para aplicar $hidden
    // -------------------------------------------------------------------------

    /**
     * Sobrescreve find() para remover campos $hidden do resultado.
     * O CI4 aplica $hidden apenas em Entities; para returnType 'array'
     * a remoção precisa ser feita manualmente.
     *
     * {@inheritdoc}
     */
    public function find($id = null)
    {
        $result = parent::find($id);

        if (empty($this->hidden) || !is_array($result)) {
            return $result;
        }

        return array_diff_key($result, array_flip($this->hidden));
    }

    // -------------------------------------------------------------------------
    // Consultas paginadas
    // -------------------------------------------------------------------------

    /**
     * Consulta paginada com filtros dinâmicos de igualdade.
     *
     * @param array  $filters Mapa [campo => valor] aplicado como WHERE exato
     * @param int    $page    Página atual (base 1)
     * @param int    $limit   Registros por página (máx. 100)
     * @param string $sort    Campo de ordenação
     * @param string $order   Direção: asc | desc
     */
    public function findPaginated(
        array $filters = [],
        int $page = 1,
        int $limit = 20,
        string $sort = 'id',
        string $order = 'desc'
    ): array {
        [$sort, $order] = $this->sanitizeSort($sort, $order);

        $builder = $this->builder();

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
     * Busca textual paginada em múltiplos campos (LIKE com OR entre campos).
     *
     * @param string   $term         Termo pesquisado
     * @param string[] $searchFields Campos que receberão o LIKE
     */
    public function searchByTerm(
        string $term,
        array $searchFields,
        int $page = 1,
        int $limit = 20,
        string $sort = 'id',
        string $order = 'desc'
    ): array {
        [$sort, $order] = $this->sanitizeSort($sort, $order);

        $builder = $this->builder();

        if ($term !== '' && !empty($searchFields)) {
            $builder->groupStart();
            foreach ($searchFields as $index => $field) {
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
     * Listagem filtrada paginada com filtros multivalorados.
     *
     * Cada chave de $multiFilters é um campo da tabela; cada valor é um array
     * de strings aceitas. Gera WHERE field IN (...) por chave, sem GROUP BY —
     * todos os registros correspondentes são retornados individualmente.
     *
     * Exemplo: ['profile' => ['Cliente VIP', 'Cliente Premium'], 'user_id' => ['80']]
     * → WHERE profile IN ('Cliente VIP','Cliente Premium') AND user_id IN ('80')
     *
     * @param array $multiFilters Mapa [campo => array_de_valores]
     */
    public function findGrouped(
        array $multiFilters = [],
        int $page = 1,
        int $limit = 20,
        string $sort = 'id',
        string $order = 'desc'
    ): array {
        [$sort, $order] = $this->sanitizeSort($sort, $order);

        $builder = $this->builder();

        foreach ($multiFilters as $field => $values) {
            if (empty($values)) {
                continue;
            }

            if (in_array($field, $this->likeFields, true)) {
                // Campo de texto: LIKE %valor% com OR entre múltiplos valores
                $builder->groupStart();
                foreach (array_values($values) as $index => $value) {
                    $index === 0
                        ? $builder->like($field, $value)
                        : $builder->orLike($field, $value);
                }
                $builder->groupEnd();
            } else {
                // Campo numérico/relacional: WHERE field IN (v1, v2, ...)
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
     * Retorna todos os registros ativos ordenados, sem paginação.
     * Usar com cautela em tabelas com grande volume de dados.
     */
    public function getOrdered(string $sort = 'id', string $order = 'desc'): array
    {
        [$sort, $order] = $this->sanitizeSort($sort, $order);

        return $this->orderBy($sort, $order)->findAll();
    }

    // -------------------------------------------------------------------------
    // Utilitários internos
    // -------------------------------------------------------------------------

    /**
     * Aplica filtros ao builder: LIKE %valor% para campos em $likeFields,
     * WHERE exato (=) para os demais. Reutilizado em findPaginated e findPaginatedView.
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
     * Retorna valores seguros baseados em $sortableFields.
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
     * Remove os campos definidos em $hidden de cada linha antes de retornar.
     */
    protected function buildPaginatedResult(array $data, int $total, int $page, int $limit): array
    {
        if (!empty($this->hidden)) {
            $data = array_map(
                fn(array $row) => array_diff_key($row, array_flip($this->hidden)),
                $data
            );
        }

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
