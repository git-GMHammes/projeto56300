<?php

namespace App\Services\V1\UserManagement;

use App\Models\V1\UserManagement\SqlTableModel;
use App\Services\V1\BaseService;
use CodeIgniter\Database\Exceptions\DatabaseException;

/**
 * Service de negócio para o módulo UserManagement.
 *
 * Centraliza toda a lógica de negócio: hash de senha, unicidade de username,
 * paginação, soft delete, restore e hard delete.
 *
 * Métodos: find, getGrouped, search, get, getAll, getNoPagination,
 *          getDeleted, getDeletedAll, create, update,
 *          deleteSoft, deleteRestore, deleteHard, clearDeleted
 */
class Processor extends BaseService
{
    protected SqlTableModel $tableModel;

    public function __construct()
    {
        $this->tableModel = new SqlTableModel();
    }

    // =========================================================================
    // Leitura
    // =========================================================================

    /**
     * POST /find — Consulta paginada com filtros dinâmicos (tabela).
     *
     * @param array $filters Mapa [campo => valor]
     * @param array $params  Parâmetros de paginação: page, limit, sort, order
     */
    public function find(array $filters, array $params): array
    {
        $p = $this->buildPaginationParams($params);

        return $this->tableModel->findPaginated(
            $this->sanitizeData($filters),
            $p['page'],
            $p['limit'],
            $p['sort'],
            $p['order']
        );
    }

    /**
     * POST /get-grouped — Listagem filtrada paginada com filtros multivalorados (tabela).
     *
     * @param array $multiFilters Mapa [campo => array_de_valores]
     * @param array $params       Parâmetros de paginação
     */
    public function getGrouped(array $multiFilters, array $params): array
    {
        $p = $this->buildPaginationParams($params);

        return $this->tableModel->findGrouped(
            $multiFilters,
            $p['page'],
            $p['limit'],
            $p['sort'],
            $p['order']
        );
    }

    /**
     * GET /search — Busca textual paginada (tabela).
     *
     * @param string $term   Termo pesquisado
     * @param array  $params Parâmetros de paginação
     */
    public function search(string $term, array $params): array
    {
        $p = $this->buildPaginationParams($params);

        return $this->tableModel->searchByTerm(
            $term,
            $this->tableModel->searchFields,
            $p['page'],
            $p['limit'],
            $p['sort'],
            $p['order']
        );
    }

    /**
     * GET /get/{id} — Busca registro ativo pelo ID.
     *
     * @return array|null Retorna o registro ou null se não encontrado/deletado
     */
    public function get(int $id): ?array
    {
        return $this->tableModel->find($id);
    }

    /**
     * GET /get-all — Lista paginada de registros ativos.
     *
     * @param array $params Parâmetros de paginação
     */
    public function getAll(array $params): array
    {
        $p = $this->buildPaginationParams($params);

        return $this->tableModel->findPaginated(
            [],
            $p['page'],
            $p['limit'],
            $p['sort'],
            $p['order']
        );
    }

    /**
     * GET /get-no-pagination — Lista todos os registros ativos sem paginação.
     */
    public function getNoPagination(string $sort, string $order): array
    {
        return $this->tableModel->getOrdered($sort, $order);
    }

    /**
     * GET /get-deleted/{id} — Busca registro soft-deleted pelo ID.
     *
     * @return array|null Retorna o registro deletado ou null
     */
    public function getDeleted(int $id): ?array
    {
        return $this->tableModel->findOnlyDeleted($id);
    }

    /**
     * GET /get-deleted-all — Lista paginada de registros soft-deleted.
     *
     * @param array $params Parâmetros de paginação
     */
    public function getDeletedAll(array $params): array
    {
        $p = $this->buildPaginationParams($params);

        return $this->tableModel->findDeletedPaginated(
            $p['page'],
            $p['limit'],
            $p['sort'],
            $p['order']
        );
    }

    // =========================================================================
    // Escrita
    // =========================================================================

    /**
     * POST /create — Cria novo usuário na tabela user_management.
     *
     * Valida unicidade do username e aplica hash na senha antes de inserir.
     *
     * @param array $data Dados do novo registro (user, password)
     * @return array{success: bool, data?: array, message?: string, code?: int}
     */
    public function create(array $data): array
    {
        $sanitized = $this->sanitizeData($data);

        // Verifica unicidade do username entre registros ativos
        if (!empty($sanitized['user']) && $this->tableModel->existsByUser($sanitized['user'])) {
            return ['success' => false, 'message' => 'Username já cadastrado', 'code' => 409];
        }

        // Aplica hash na senha antes de persistir
        if (!empty($sanitized['password'])) {
            $sanitized['password'] = password_hash($sanitized['password'], PASSWORD_BCRYPT);
        }

        try {
            $id = $this->tableModel->insert($sanitized);

            if (!$id) {
                return ['success' => false, 'message' => 'Erro ao criar registro', 'code' => 500];
            }

            $record = $this->tableModel->find($id);

            // Remove a senha do retorno por segurança
            unset($record['password']);

            return ['success' => true, 'data' => $record];
        } catch (DatabaseException $e) {
            log_message('error', '[UserManagement::create] DatabaseException: ' . $e->getMessage());

            return ['success' => false, 'message' => 'Erro ao criar registro', 'code' => 500];
        }
    }

    /**
     * PUT /update/{id} — Atualiza registro existente na tabela user_management.
     *
     * Valida unicidade do username excluindo o próprio registro.
     * Aplica hash na senha se fornecida.
     *
     * @param int   $id   ID do registro a atualizar
     * @param array $data Campos a atualizar
     * @return array{success: bool, data?: array, message?: string, code?: int}
     */
    public function update(int $id, array $data): array
    {
        // Verifica se o registro existe e está ativo
        $existing = $this->tableModel->find($id);

        if (!$existing) {
            return ['success' => false, 'message' => 'Registro não encontrado ou foi excluído', 'code' => 404];
        }

        $sanitized = $this->sanitizeData($data);

        // Verifica unicidade do username excluindo o registro atual
        if (!empty($sanitized['user']) && $this->tableModel->existsByUser($sanitized['user'], $id)) {
            return ['success' => false, 'message' => 'Username já cadastrado', 'code' => 409];
        }

        // Aplica hash na senha se fornecida
        if (!empty($sanitized['password'])) {
            $sanitized['password'] = password_hash($sanitized['password'], PASSWORD_BCRYPT);
        }

        try {
            $this->tableModel->update($id, $sanitized);

            $updated = $this->tableModel->find($id);

            // Remove a senha do retorno por segurança
            unset($updated['password']);

            return ['success' => true, 'data' => $updated];
        } catch (DatabaseException $e) {
            log_message('error', '[UserManagement::update] DatabaseException: ' . $e->getMessage());

            return ['success' => false, 'message' => 'Erro ao atualizar registro', 'code' => 500];
        }
    }

    // =========================================================================
    // Exclusão
    // =========================================================================

    /**
     * DELETE /delete-soft/{id} — Aplica soft delete no registro.
     *
     * @return array{success: bool, message: string, code?: int}
     */
    public function deleteSoft(int $id): array
    {
        $existing = $this->tableModel->findWithDeleted($id);

        if (!$existing) {
            return ['success' => false, 'message' => 'Registro não encontrado', 'code' => 404];
        }

        if ($existing['deleted_at'] !== null) {
            return ['success' => false, 'message' => 'Registro já está excluído logicamente', 'code' => 409];
        }

        $this->tableModel->delete($id);

        return ['success' => true, 'message' => 'Registro excluído logicamente com sucesso'];
    }

    /**
     * PATCH /delete-restore/{id} — Restaura registro soft-deleted.
     *
     * @return array{success: bool, message: string, code?: int}
     */
    public function deleteRestore(int $id): array
    {
        $deleted = $this->tableModel->findOnlyDeleted($id);

        if (!$deleted) {
            return ['success' => false, 'message' => 'Registro deletado não encontrado', 'code' => 404];
        }

        $this->tableModel->update($id, ['deleted_at' => null]);

        return ['success' => true, 'message' => 'Registro restaurado com sucesso'];
    }

    /**
     * DELETE /delete-hard/{id} — Remove permanentemente um registro.
     *
     * @return array{success: bool, message: string, code?: int}
     */
    public function deleteHard(int $id): array
    {
        $existing = $this->tableModel->findWithDeleted($id);

        if (!$existing) {
            return ['success' => false, 'message' => 'Registro não encontrado', 'code' => 404];
        }

        $this->tableModel->delete($id, true); // true = hard delete no CI4

        return ['success' => true, 'message' => 'Registro excluído permanentemente'];
    }

    /**
     * DELETE /clear-deleted      — Remove permanentemente todos os registros soft-deleted.
     * DELETE /clear-deleted/{id} — Remove permanentemente um registro soft-deleted específico.
     *
     * @param int|null $id ID específico (null = limpa todos)
     * @return array{affected: int}
     */
    public function clearDeleted(?int $id = null): array
    {
        $affected = $this->tableModel->clearDeleted($id);

        return ['affected' => $affected];
    }
}
