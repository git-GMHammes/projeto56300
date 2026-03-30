<?php

/**
 * Class Manager
 *
 * Camada de serviço do módulo UserManagement.
 * Contém TODA a lógica de negócio, isolando o Controller de chamadas diretas ao Model.
 *
 * Princípios aplicados:
 *  - Single Responsibility: Manager cuida só de regras de negócio de UserManagement.
 *  - Dependency Injection: Table e DB são injetados via construtor.
 *  - Repository/Service Pattern: Controller nunca toca o Model diretamente.
 *
 * @package App\Service\Api\V1\UserManagement
 */

namespace App\Service\Api\V1\UserManagement;

use App\Models\Api\V1\UserManagement\Table;
use CodeIgniter\Database\BaseConnection;

class Manager
{
    // Colunas públicas retornadas por padrão — senha NUNCA é exposta
    private const PUBLIC_FIELDS = 'id, user, last_login, created_at, updated_at';

    protected BaseConnection $db;

    public function __construct(protected Table $model)
    {
        // Reutiliza a conexão já aberta pelo Model (sem abrir segunda conexão)
        $this->db = $model->db;
    }

    // =========================================================================
    // Leitura — registros ativos
    // =========================================================================

    /**
     * Busca paginada com filtros opcionais (endpoint POST /find).
     * Parâmetros de paginação vêm da query string; filtros de busca vêm do body.
     *
     * @param array $queryParams Parâmetros de paginação (?page, limit, sort, order)
     * @param array $bodyFilters Filtros do corpo da requisição (user, etc.)
     * @return array{items: array, pagination: array}
     */
    public function findPaginated(array $queryParams, array $bodyFilters): array
    {
        [$page, $limit, $sort, $order] = $this->extractPagination($queryParams);

        $builder = $this->model->select(self::PUBLIC_FIELDS);

        // Filtro dinâmico por username (LIKE)
        if (!empty($bodyFilters['user'])) {
            $builder->like('user', $bodyFilters['user']);
        }

        $builder->orderBy($this->sanitizeSort($sort), $order);

        $items = $builder->paginate($limit, 'default', $page);
        $pager = $this->model->pager;

        return [
            'items'      => $items ?? [],
            'pagination' => [
                'page'        => $page,
                'limit'       => $limit,
                'total'       => $pager->getTotal(),
                'total_pages' => $pager->getPageCount(),
            ],
        ];
    }

    /**
     * Busca agrupada por data de criação (endpoint GET /get-grouped).
     * Retorna contagem de usuários por dia, paginada.
     *
     * @param array $queryParams Parâmetros de paginação
     * @return array{items: array, pagination: array}
     */
    public function getGrouped(array $queryParams): array
    {
        [$page, $limit, , $order] = $this->extractPagination($queryParams);

        $offset = ($page - 1) * $limit;

        // Contagem total de grupos (datas distintas)
        $totalGroups = $this->db
            ->table('user_management')
            ->select('COUNT(DISTINCT DATE(created_at)) as total')
            ->where('deleted_at IS NULL', null, false)
            ->get()
            ->getRowArray()['total'] ?? 0;

        // Grupos paginados
        $items = $this->db
            ->table('user_management')
            ->select('DATE(created_at) AS date_group, COUNT(*) AS total_users')
            ->where('deleted_at IS NULL', null, false)
            ->groupBy('DATE(created_at)')
            ->orderBy('date_group', $order)
            ->limit($limit, $offset)
            ->get()
            ->getResultArray();

        $totalPages = $limit > 0 ? (int) ceil((int) $totalGroups / $limit) : 1;

        return [
            'items'      => $items,
            'pagination' => [
                'page'        => $page,
                'limit'       => $limit,
                'total'       => (int) $totalGroups,
                'total_pages' => $totalPages,
            ],
        ];
    }

    /**
     * Busca usuário ativo por ID (endpoint GET /get/{id}).
     * Retorna null se não encontrado.
     *
     * @param int $id
     * @return array|null
     */
    public function getById(int $id): ?array
    {
        return $this->model
            ->select(self::PUBLIC_FIELDS)
            ->find($id) ?: null;
    }

    /**
     * Busca todos os usuários ativos com paginação (endpoint GET /get-all).
     *
     * @param array $queryParams
     * @return array{items: array, pagination: array}
     */
    public function getAllPaginated(array $queryParams): array
    {
        [$page, $limit, $sort, $order] = $this->extractPagination($queryParams);

        $items = $this->model
            ->select(self::PUBLIC_FIELDS)
            ->orderBy($this->sanitizeSort($sort), $order)
            ->paginate($limit, 'default', $page);

        $pager = $this->model->pager;

        return [
            'items'      => $items ?? [],
            'pagination' => [
                'page'        => $page,
                'limit'       => $limit,
                'total'       => $pager->getTotal(),
                'total_pages' => $pager->getPageCount(),
            ],
        ];
    }

    /**
     * Retorna todos os usuários ativos sem paginação (endpoint GET /get-no-pagination).
     * Ordenação via query string.
     *
     * @param array $queryParams
     * @return array
     */
    public function getAllNoPagination(array $queryParams): array
    {
        [, , $sort, $order] = $this->extractPagination($queryParams);

        return $this->model
            ->select(self::PUBLIC_FIELDS)
            ->orderBy($this->sanitizeSort($sort), $order)
            ->findAll();
    }

    // =========================================================================
    // Leitura — registros soft-deletados
    // =========================================================================

    /**
     * Busca todos os usuários soft-deletados com paginação (endpoint GET /get-deleted-all).
     *
     * @param array $queryParams
     * @return array{items: array, pagination: array}
     */
    public function getDeletedAllPaginated(array $queryParams): array
    {
        [$page, $limit, $sort, $order] = $this->extractPagination($queryParams);
        $offset = ($page - 1) * $limit;

        $total = $this->model
            ->onlyDeleted()
            ->countAllResults(false);

        $items = $this->model
            ->onlyDeleted()
            ->select(self::PUBLIC_FIELDS . ', deleted_at')
            ->orderBy($this->sanitizeSort($sort), $order)
            ->findAll($limit, $offset);

        $totalPages = $limit > 0 ? (int) ceil($total / $limit) : 1;

        return [
            'items'      => $items,
            'pagination' => [
                'page'        => $page,
                'limit'       => $limit,
                'total'       => $total,
                'total_pages' => $totalPages,
            ],
        ];
    }

    /**
     * Busca um usuário soft-deletado por ID (endpoint GET /get-deleted/{id}).
     * Retorna null se não encontrado ou se não estiver deletado.
     *
     * @param int $id
     * @return array|null
     */
    public function getDeletedById(int $id): ?array
    {
        return $this->model
            ->onlyDeleted()
            ->select(self::PUBLIC_FIELDS . ', deleted_at')
            ->find($id) ?: null;
    }

    // =========================================================================
    // Escrita
    // =========================================================================

    /**
     * Cria um novo usuário (endpoint POST /create).
     * O hash da senha é feito automaticamente pelo callback beforeInsert do Model.
     *
     * @param array $data Campos: user, password
     * @return array Dados do usuário criado (sem senha)
     * @throws \RuntimeException Em caso de falha na inserção
     */
    public function createUser(array $data): array
    {
        $this->db->transStart();

        $id = $this->model->insert([
            'user'     => $data['user'],
            'password' => $data['password'],
        ], true);

        $this->db->transComplete();

        if ($this->db->transStatus() === false || !$id) {
            throw new \RuntimeException('Falha ao inserir usuário no banco de dados.');
        }

        return $this->model->select(self::PUBLIC_FIELDS)->find($id);
    }

    /**
     * Atualiza um usuário existente (endpoint PUT /update/{id}).
     * Apenas os campos presentes no payload são atualizados.
     *
     * @param int   $id   ID do usuário
     * @param array $data Campos a atualizar (user e/ou password)
     * @return array Dados atualizados do usuário
     * @throws \RuntimeException Se o usuário não existir ou a atualização falhar
     */
    public function updateUser(int $id, array $data): array
    {
        $user = $this->getById($id);

        if ($user === null) {
            throw new \RuntimeException("Usuário com ID {$id} não encontrado.");
        }

        // Monta payload apenas com campos enviados
        $payload = array_filter([
            'user'     => $data['user']     ?? null,
            'password' => $data['password'] ?? null,
        ], fn($v) => $v !== null && $v !== '');

        if (empty($payload)) {
            return $user;
        }

        $this->db->transStart();

        $this->model->update($id, $payload);

        $this->db->transComplete();

        if ($this->db->transStatus() === false) {
            throw new \RuntimeException('Falha ao atualizar usuário.');
        }

        return $this->model->select(self::PUBLIC_FIELDS)->find($id);
    }

    // =========================================================================
    // Exclusão
    // =========================================================================

    /**
     * Soft delete de um usuário (endpoint DELETE /delete-soft/{id}).
     * Preenche deleted_at — o registro permanece na tabela.
     *
     * @param int $id
     * @return bool
     * @throws \RuntimeException Se o usuário não existir
     */
    public function softDelete(int $id): bool
    {
        if ($this->getById($id) === null) {
            throw new \RuntimeException("Usuário com ID {$id} não encontrado.");
        }

        return $this->model->delete($id);
    }

    /**
     * Restaura um usuário soft-deletado (endpoint PATCH /delete-restore/{id}).
     * Zera o campo deleted_at via DB builder (Model omite registros deletados por padrão).
     *
     * @param int $id
     * @return bool
     * @throws \RuntimeException Se o usuário deletado não existir
     */
    public function restoreDeleted(int $id): bool
    {
        if ($this->getDeletedById($id) === null) {
            throw new \RuntimeException("Usuário deletado com ID {$id} não encontrado.");
        }

        return (bool) $this->db
            ->table('user_management')
            ->set('deleted_at', null)
            ->where('id', $id)
            ->update();
    }

    /**
     * Hard delete de um usuário ativo (endpoint DELETE /delete-hard/{id}).
     * Remove permanentemente o registro da tabela.
     *
     * @param int $id
     * @return bool
     * @throws \RuntimeException Se o usuário não existir
     */
    public function hardDelete(int $id): bool
    {
        if ($this->getById($id) === null) {
            throw new \RuntimeException("Usuário com ID {$id} não encontrado.");
        }

        // true = purge (ignora soft delete e remove permanentemente)
        return $this->model->delete($id, true);
    }

    /**
     * Remove permanentemente TODOS os registros soft-deletados (endpoint DELETE /clear-deleted-all).
     *
     * @return int Número de registros removidos
     */
    public function clearAllDeleted(): int
    {
        $affected = $this->db
            ->table('user_management')
            ->where('deleted_at IS NOT NULL', null, false)
            ->delete();

        return $this->db->affectedRows();
    }

    /**
     * Remove permanentemente um registro soft-deletado pelo ID (endpoint DELETE /clear-deleted/{id}).
     *
     * @param int $id
     * @return bool
     * @throws \RuntimeException Se o registro deletado não existir
     */
    public function clearDeletedById(int $id): bool
    {
        if ($this->getDeletedById($id) === null) {
            throw new \RuntimeException("Nenhum registro deletado encontrado com ID {$id}.");
        }

        return (bool) $this->db
            ->table('user_management')
            ->where('id', $id)
            ->where('deleted_at IS NOT NULL', null, false)
            ->delete();
    }

    // =========================================================================
    // Helpers privados
    // =========================================================================

    /**
     * Extrai e normaliza parâmetros de paginação de um array de query string.
     *
     * @param array $params
     * @return array{int, int, string, string} [page, limit, sort, order]
     */
    private function extractPagination(array $params): array
    {
        $page  = max(1, (int) ($params['page']  ?? 1));
        $limit = min(100, max(1, (int) ($params['limit'] ?? 20)));
        $sort  = (string) ($params['sort']  ?? 'id');
        $order = strtoupper((string) ($params['order'] ?? 'DESC'));

        // Garante que order seja somente ASC ou DESC
        $order = \in_array($order, ['ASC', 'DESC'], true) ? $order : 'DESC';

        return [$page, $limit, $sort, $order];
    }

    /**
     * Valida o campo de ordenação contra uma whitelist de colunas permitidas,
     * prevenindo SQL Injection via ORDER BY.
     *
     * @param string $sort
     * @return string
     */
    private function sanitizeSort(string $sort): string
    {
        $allowed = ['id', 'user', 'last_login', 'created_at', 'updated_at'];

        return \in_array($sort, $allowed, true) ? $sort : 'id';
    }
}
