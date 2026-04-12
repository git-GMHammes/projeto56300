<?php

namespace App\Models\V1;

use CodeIgniter\Model;

/**
 * Model base para tabelas físicas na API V1.
 *
 * Fornece o conjunto completo de operações:
 * leitura paginada, busca textual, agrupamento, verificação de unicidade,
 * soft delete (find/restore/clear) e utilitários internos.
 *
 * Os SqlTableModel de cada módulo devem herdar desta classe,
 * declarar $table, $allowedFields e sobrescrever os arrays de configuração.
 */
abstract class BaseTableModel extends Model
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
     * Campos permitidos para ordenação — sobrescrever nos filhos conforme a tabela.
     */
    protected array $sortableFields = ['id', 'created_at', 'updated_at'];

    /**
     * Campos que usam LIKE %valor% no findPaginated.
     * Todos os outros campos usam WHERE exato (=).
     * Sobrescrever nos filhos com os campos de texto da tabela.
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
     * de strings aceitas. Gera WHERE field IN (...) por chave — sem GROUP BY.
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
                $builder->groupStart();
                foreach (array_values($values) as $index => $value) {
                    $index === 0
                        ? $builder->like($field, $value)
                        : $builder->orLike($field, $value);
                }
                $builder->groupEnd();
            } else {
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
    // Verificações de unicidade
    // -------------------------------------------------------------------------

    /**
     * Verifica se já existe registro ativo com o valor informado no campo dado.
     *
     * @param string   $field     Campo a verificar
     * @param mixed    $value     Valor a buscar
     * @param int|null $excludeId ID a ignorar (usado no update)
     */
    public function existsByField(string $field, mixed $value, ?int $excludeId = null): bool
    {
        $builder = $this->db->table($this->table)
            ->where($field, $value)
            ->where('deleted_at IS NULL', null, false);

        if ($excludeId !== null) {
            $builder->where("{$this->primaryKey} !=", $excludeId);
        }

        return $builder->countAllResults() > 0;
    }

    // -------------------------------------------------------------------------
    // Consultas com soft delete
    // -------------------------------------------------------------------------

    /**
     * Busca registro pelo ID, incluindo os soft-deleted (para restauração).
     */
    public function findWithDeleted(int $id): ?array
    {
        return $this->withDeleted()->find($id);
    }

    /**
     * Busca registro pelo ID somente se estiver soft-deleted.
     */
    public function findOnlyDeleted(int $id): ?array
    {
        return $this->onlyDeleted()->find($id);
    }

    /**
     * Lista registros soft-deleted com paginação.
     */
    public function findDeletedPaginated(
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
     * Restaura um registro soft-deleted zerando o campo deleted_at.
     *
     * Usa o builder direto para contornar $allowedFields,
     * já que deleted_at é gerenciado pelo framework, não pela aplicação.
     */
    public function restore(int $id): void
    {
        $this->db->table($this->table)
            ->where($this->primaryKey, $id)
            ->update(['deleted_at' => null]);
    }

    /**
     * Remove permanentemente (hard delete) todos os registros soft-deleted,
     * ou apenas um específico se $id for informado.
     *
     * @return int Quantidade de registros removidos
     */
    public function clearDeleted(?int $id = null): int
    {
        $builder = $this->db->table($this->table)
            ->where('deleted_at IS NOT NULL', null, false);

        if ($id !== null) {
            $builder->where($this->primaryKey, $id);
        }

        $affected = $builder->countAllResults(false);
        $builder->delete();

        return $affected;
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
