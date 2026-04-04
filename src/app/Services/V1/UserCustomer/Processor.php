<?php

namespace App\Services\V1\UserCustomer;

use App\Models\V1\UserCustomer\SqlTableModel;
use App\Models\V1\UserCustomer\SqlViewModel;
use App\Services\V1\BaseService;
use CodeIgniter\Database\Exceptions\DatabaseException;

/**
 * Service de negócio para o módulo UserCustomer.
 *
 * Centraliza toda a lógica de negócio: validações de unicidade,
 * transformação de dados, orquestração entre tabela e view.
 *
 * Métodos de tabela: find, getGrouped, search, get, getAll, getNoPagination,
 *                    getDeleted, getDeletedAll, create, update,
 *                    deleteSoft, deleteRestore, deleteHard, clearDeleted
 *
 * Métodos de view:   findView, getGroupedView, searchView, getView,
 *                    getAllView, getNoPaginationView, getDeletedView, getDeletedAllView
 */
class Processor extends BaseService
{
    protected SqlTableModel $tableModel;
    protected SqlViewModel $viewModel;

    public function __construct()
    {
        $this->tableModel = new SqlTableModel();
        $this->viewModel = new SqlViewModel();
    }

    // =========================================================================
    // Operações sobre a TABELA user_customer
    // =========================================================================

    /**
     * POST /find — Consulta paginada com filtros (tabela).
     *
     * @param array $filters Mapa [campo => valor]
     * @param array $params  Parâmetros de paginação: page, limit, sort, order
     */
    public function find(array $filters, array $params): array
    {
        $p = $this->buildPaginationParams($params);

        return $this->tableModel->findPaginated(
            $this->removeMasks($filters),
            $p['page'],
            $p['limit'],
            $p['sort'],
            $p['order']
        );
    }

    /**
     * POST /get-grouped — Listagem filtrada paginada (tabela).
     *
     * @param array $multiFilters Mapa [campo => array_de_valores] vindo do body
     * @param array $params       Parâmetros de paginação
     */
    public function getGrouped(array $multiFilters, array $params): array
    {
        $p = $this->buildPaginationParams($params);

        return $this->tableModel->findGrouped(
            $this->removeMasks($multiFilters),
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
     * GET /get/{id} — Busca registro ativo pelo ID (tabela).
     *
     * @return array|null Retorna o registro ou null se não encontrado/deletado
     */
    public function get(int $id): ?array
    {
        return $this->tableModel->find($id);
    }

    /**
     * GET /get-all — Lista paginada de registros ativos (tabela).
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
     * GET /get-no-pagination — Lista todos os registros ativos sem paginação (tabela).
     */
    public function getNoPagination(string $sort, string $order): array
    {
        return $this->tableModel->getOrdered($sort, $order);
    }

    /**
     * GET /get-deleted/{id} — Busca registro soft-deleted pelo ID (tabela).
     *
     * @return array|null Retorna o registro deletado ou null
     */
    public function getDeleted(int $id): ?array
    {
        return $this->tableModel->findOnlyDeleted($id);
    }

    /**
     * GET /get-deleted-all — Lista paginada de registros soft-deleted (tabela).
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

    /**
     * POST /create — Cria novo registro na tabela user_customer.
     *
     * Valida unicidade de CPF, WhatsApp e e-mail antes de inserir.
     *
     * @param array $data Dados do novo registro
     * @return array{success: bool, data?: array, message?: string, code?: int}
     */
    public function create(array $data): array
    {
        $sanitized = $this->removeMasks($this->sanitizeData($data));

        // Verifica se o user_id existe na tabela pai user_management
        if (!empty($sanitized['user_id']) && !$this->tableModel->existsUserManagement((int) $sanitized['user_id'])) {
            return ['success' => false, 'message' => 'Usuário não encontrado em user_management', 'code' => 422];
        }

        // Verifica unicidade do CPF entre registros ativos
        if (!empty($sanitized['cpf']) && $this->tableModel->existsByCpf($sanitized['cpf'])) {
            return ['success' => false, 'message' => 'CPF já cadastrado', 'code' => 409];
        }

        // Verifica unicidade do WhatsApp entre registros ativos
        if (!empty($sanitized['whatsapp']) && $this->tableModel->existsByWhatsapp($sanitized['whatsapp'])) {
            return ['success' => false, 'message' => 'WhatsApp já cadastrado', 'code' => 409];
        }

        // Verifica unicidade do e-mail entre registros ativos
        if (!empty($sanitized['mail']) && $this->tableModel->existsByMail($sanitized['mail'])) {
            return ['success' => false, 'message' => 'E-mail já cadastrado', 'code' => 409];
        }

        // Formata a data de nascimento para o padrão Y-m-d
        if (isset($sanitized['date_birth'])) {
            $sanitized['date_birth'] = $this->formatDate($sanitized['date_birth']);
        }

        // Formata a validade para o padrão Y-m-d H:i:s
        if (isset($sanitized['validity'])) {
            $sanitized['validity'] = $this->formatDatetime($sanitized['validity']);
        }

        try {
            $id = $this->tableModel->insert($sanitized);

            if (!$id) {
                return ['success' => false, 'message' => 'Erro ao criar registro', 'code' => 500];
            }

            $record = $this->tableModel->find($id);

            return ['success' => true, 'data' => $record];
        } catch (DatabaseException $e) {
            log_message('error', '[UserCustomer::create] DatabaseException: ' . $e->getMessage());

            return ['success' => false, 'message' => 'Erro ao criar registro', 'code' => 500];
        }
    }

    /**
     * PUT /update/{id} — Atualiza registro existente na tabela user_customer.
     *
     * Valida unicidade de CPF, WhatsApp e e-mail excluindo o próprio registro.
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

        $sanitized = $this->removeMasks($this->sanitizeData($data));

        // Remove user_id caso venha no body — vínculo imutável após a criação
        unset($sanitized['user_id']);

        // Verifica unicidade do CPF excluindo o registro atual
        if (!empty($sanitized['cpf']) && $this->tableModel->existsByCpf($sanitized['cpf'], $id)) {
            return ['success' => false, 'message' => 'CPF já cadastrado', 'code' => 409];
        }

        // Verifica unicidade do WhatsApp excluindo o registro atual
        if (!empty($sanitized['whatsapp']) && $this->tableModel->existsByWhatsapp($sanitized['whatsapp'], $id)) {
            return ['success' => false, 'message' => 'WhatsApp já cadastrado', 'code' => 409];
        }

        // Verifica unicidade do e-mail excluindo o registro atual
        if (!empty($sanitized['mail']) && $this->tableModel->existsByMail($sanitized['mail'], $id)) {
            return ['success' => false, 'message' => 'E-mail já cadastrado', 'code' => 409];
        }

        // Formata a data de nascimento para o padrão Y-m-d
        if (isset($sanitized['date_birth'])) {
            $sanitized['date_birth'] = $this->formatDate($sanitized['date_birth']);
        }

        // Formata a validade para o padrão Y-m-d H:i:s
        if (isset($sanitized['validity'])) {
            $sanitized['validity'] = $this->formatDatetime($sanitized['validity']);
        }

        try {
            $this->tableModel->update($id, $sanitized);

            $updated = $this->tableModel->find($id);

            return ['success' => true, 'data' => $updated];
        } catch (DatabaseException $e) {
            log_message('error', '[UserCustomer::update] DatabaseException: ' . $e->getMessage());

            return ['success' => false, 'message' => 'Erro ao atualizar registro', 'code' => 500];
        }
    }

    /**
     * DELETE /delete-soft/{id} — Aplica soft delete no registro.
     *
     * @return array{success: bool, message: string, code?: int}
     */
    public function deleteSoft(int $id): array
    {
        // Verifica se o registro existe
        $existing = $this->tableModel->findWithDeleted($id);

        if (!$existing) {
            return ['success' => false, 'message' => 'Registro não encontrado', 'code' => 404];
        }

        // Verifica se já está deletado
        if ($existing['deleted_at'] !== null) {
            return ['success' => false, 'message' => 'Registro já está excluído logicamente', 'code' => 404];
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
     * DELETE /clear-deleted — Remove permanentemente todos os registros soft-deleted.
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

    // =========================================================================
    // Operações sobre a VIEW v_user_customer (somente leitura)
    // =========================================================================

    /**
     * POST /find — Consulta paginada com filtros (view).
     */
    public function findView(array $filters, array $params): array
    {
        $p = $this->buildPaginationParams($params);

        return $this->viewModel->findPaginatedView(
            $this->removeMasks($filters),
            $p['page'],
            $p['limit'],
            $p['sort'],
            $p['order']
        );
    }

    /**
     * POST /get-grouped — Listagem filtrada paginada (view).
     *
     * @param array $multiFilters Mapa [campo => array_de_valores] vindo do body
     * @param array $params       Parâmetros de paginação
     */
    public function getGroupedView(array $multiFilters, array $params): array
    {
        $p = $this->buildPaginationParams($params);

        return $this->viewModel->findGroupedView(
            $this->removeMasks($multiFilters),
            $p['page'],
            $p['limit'],
            $p['sort'],
            $p['order']
        );
    }

    /**
     * GET /search — Busca textual paginada (view).
     */
    public function searchView(string $term, array $params): array
    {
        $p = $this->buildPaginationParams($params);

        return $this->viewModel->searchByTermView(
            $term,
            $p['page'],
            $p['limit'],
            $p['sort'],
            $p['order']
        );
    }

    /**
     * GET /get/{id} — Busca registro ativo pelo ID (view).
     *
     * @return array|null Retorna o registro ou null se não encontrado/deletado
     */
    public function getView(int $id): ?array
    {
        return $this->viewModel->findById($id);
    }

    /**
     * GET /get-all — Lista paginada de registros ativos (view).
     */
    public function getAllView(array $params): array
    {
        $p = $this->buildPaginationParams($params);

        return $this->viewModel->findPaginatedView(
            [],
            $p['page'],
            $p['limit'],
            $p['sort'],
            $p['order']
        );
    }

    /**
     * GET /get-no-pagination — Lista todos os registros ativos sem paginação (view).
     */
    public function getNoPaginationView(string $sort, string $order): array
    {
        return $this->viewModel->findAllView($sort, $order);
    }

    /**
     * GET /get-deleted/{id} — Busca registro soft-deleted pelo ID (view).
     *
     * @return array|null Retorna o registro deletado ou null
     */
    public function getDeletedView(int $id): ?array
    {
        return $this->viewModel->findDeletedById($id);
    }

    /**
     * GET /get-deleted-all — Lista paginada de registros soft-deleted (view).
     */
    public function getDeletedAllView(array $params): array
    {
        $p = $this->buildPaginationParams($params);

        return $this->viewModel->findDeletedPaginatedView(
            $p['page'],
            $p['limit'],
            $p['sort'],
            $p['order']
        );
    }
}
