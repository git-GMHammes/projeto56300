<?php

namespace App\Controllers\Api\V1\UserManagement;

use App\Controllers\Api\V1\BaseResourceController;
use App\Requests\V1\UserManagement\CreateRequest;
use App\Requests\V1\UserManagement\UpdateRequest;
use App\Services\V1\UserManagement\Processor;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

/**
 * Controller de recurso para operações diretas na tabela user_management.
 *
 * Orquestra os 15 endpoints REST:
 *   find, getGrouped, search, get, getAll, getNoPagination,
 *   getDeleted, getDeletedAll, create, update,
 *   deleteSoft, deleteRestore, deleteHard, clearDeleted
 *
 * Nenhuma lógica de negócio aqui — apenas:
 *   1. Valida a requisição (Request)
 *   2. Chama o Processor (Service)
 *   3. Retorna a resposta padronizada
 */
class ResourceTableController extends BaseResourceController
{
    protected Processor $processor;

    public function initController(
        RequestInterface $request,
        ResponseInterface $response,
        LoggerInterface $logger
    ): void {
        parent::initController($request, $response, $logger);
        $this->processor = new Processor();
    }

    // -------------------------------------------------------------------------
    // Leitura
    // -------------------------------------------------------------------------

    /**
     * POST {{www}}/index.php/api/v1/user-management/find?page=1&limit=20&sort=id&order=desc
     *
     * Body JSON: { "user": "valor" }
     * Cada chave é um campo da tabela; cada valor é um escalar para WHERE exato.
     */
    public function find(): ResponseInterface
    {
        try {
            $body    = $this->getJsonBody();
            $filters = \is_array($body) ? $body : [];

            $result = $this->processor->find($filters, $this->getPaginationParams());

            return $this->respondPaginated($result['data'], $result['pagination']);
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        } finally {
            // reservado para log/auditoria/métricas
        }
    }

    /**
     * POST {{www}}/index.php/api/v1/user-management/get-grouped?page=1&limit=20&sort=id&order=desc
     *
     * Body JSON: { "coluna": ["valor1", "valor2"] }
     * Cada chave é um campo da tabela; cada valor é um array de strings aceitas.
     * Retorna todos os registros correspondentes via WHERE IN — sem GROUP BY.
     */
    public function getGrouped(): ResponseInterface
    {
        try {
            $body = $this->getJsonBody();

            if (empty($body) || !\is_array($body)) {
                return $this->respondValidationError(['body' => 'O corpo da requisição deve ser um objeto JSON com ao menos um filtro']);
            }

            // Monta o mapa de filtros multivalorados; ignora chaves sem array de valores
            $multiFilters = [];
            foreach ($body as $field => $values) {
                if (\is_array($values) && !empty($values)) {
                    $multiFilters[$field] = $values;
                }
            }

            if (empty($multiFilters)) {
                return $this->respondValidationError(['body' => 'Cada filtro deve conter um array não vazio de valores']);
            }

            $result = $this->processor->getGrouped($multiFilters, $this->getPaginationParams());

            return $this->respondPaginated($result['data'], $result['pagination'], 'Registros listados com sucesso');
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        } finally {
            // reservado para log/auditoria/métricas
        }
    }

    /**
     * GET {{www}}/index.php/api/v1/user-management/search?q=termo&page=1&limit=20&sort=id&order=desc
     */
    public function search(): ResponseInterface
    {
        try {
            $term   = trim((string) ($this->request->getGet('q') ?? ''));
            $result = $this->processor->search($term, $this->getPaginationParams());

            return $this->respondPaginated($result['data'], $result['pagination']);
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        } finally {
            // reservado para log/auditoria/métricas
        }
    }

    /**
     * GET {{www}}/index.php/api/v1/user-management/get/{id}
     */
    public function get(int $id): ResponseInterface
    {
        try {
            $record = $this->processor->get($id);

            if (!$record) {
                return $this->respondNotFound('Registro não encontrado ou foi excluído');
            }

            return $this->respondSuccess($record, 'Registro encontrado com sucesso');
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        } finally {
            // reservado para log/auditoria/métricas
        }
    }

    /**
     * GET {{www}}/index.php/api/v1/user-management/get-all?page=1&limit=20&sort=id&order=desc
     */
    public function getAll(): ResponseInterface
    {
        try {
            $result = $this->processor->getAll($this->getPaginationParams());

            return $this->respondPaginated($result['data'], $result['pagination']);
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        } finally {
            // reservado para log/auditoria/métricas
        }
    }

    /**
     * GET {{www}}/index.php/api/v1/user-management/get-no-pagination?sort=id&order=desc
     */
    public function getNoPagination(): ResponseInterface
    {
        try {
            $sort  = trim((string) ($this->request->getGet('sort') ?? 'id'));
            $order = trim((string) ($this->request->getGet('order') ?? 'desc'));
            $data  = $this->processor->getNoPagination($sort, $order);

            return $this->respondSuccess($data);
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        } finally {
            // reservado para log/auditoria/métricas
        }
    }

    /**
     * GET {{www}}/index.php/api/v1/user-management/get-deleted/{id}
     */
    public function getDeleted(int $id): ResponseInterface
    {
        try {
            $record = $this->processor->getDeleted($id);

            if (!$record) {
                return $this->respondNotFound('Registro deletado não encontrado');
            }

            return $this->respondSuccess($record, 'Registro deletado encontrado com sucesso');
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        } finally {
            // reservado para log/auditoria/métricas
        }
    }

    /**
     * GET {{www}}/index.php/api/v1/user-management/get-deleted-all?page=1&limit=20&sort=id&order=desc
     */
    public function getDeletedAll(): ResponseInterface
    {
        try {
            $result = $this->processor->getDeletedAll($this->getPaginationParams());

            return $this->respondPaginated($result['data'], $result['pagination'], 'Registros deletados listados com sucesso');
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        } finally {
            // reservado para log/auditoria/métricas
        }
    }

    // -------------------------------------------------------------------------
    // Escrita
    // -------------------------------------------------------------------------

    /**
     * POST {{www}}/index.php/api/v1/user-management/create
     *
     * Body JSON: { "user": "nome", "password": "senha" }
     */
    public function create(): ResponseInterface
    {
        try {
            if (!$this->validate((new CreateRequest())->rules())) {
                return $this->respondValidationError($this->validator->getErrors());
            }

            $result = $this->processor->create($this->getJsonBody());

            if (!$result['success']) {
                return $this->respondError($result['message'], $result['code'] ?? 409);
            }

            return $this->respondCreated($result['data']);
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        } finally {
            // reservado para log/auditoria/métricas
        }
    }

    /**
     * PUT {{www}}/index.php/api/v1/user-management/update/{id}
     *
     * Body JSON: campos a atualizar conforme UpdateRequest
     */
    public function update(int $id): ResponseInterface
    {
        try {
            if (!$this->validate((new UpdateRequest())->rules())) {
                return $this->respondValidationError($this->validator->getErrors());
            }

            $result = $this->processor->update($id, $this->getJsonBody());

            if (!$result['success']) {
                return $this->respondError($result['message'], $result['code'] ?? 400);
            }

            return $this->respondSuccess($result['data'], 'Registro atualizado com sucesso');
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        } finally {
            // reservado para log/auditoria/métricas
        }
    }

    // -------------------------------------------------------------------------
    // Exclusão
    // -------------------------------------------------------------------------

    /**
     * DELETE {{www}}/index.php/api/v1/user-management/delete-soft/{id}
     */
    public function deleteSoft(int $id): ResponseInterface
    {
        try {
            $result = $this->processor->deleteSoft($id);

            if (!$result['success']) {
                return $this->respondError($result['message'], $result['code'] ?? 404);
            }

            return $this->respondSuccess(null, 'Registro excluído logicamente com sucesso');
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        } finally {
            // reservado para log/auditoria/métricas
        }
    }

    /**
     * PATCH {{www}}/index.php/api/v1/user-management/delete-restore/{id}
     */
    public function deleteRestore(int $id): ResponseInterface
    {
        try {
            $result = $this->processor->deleteRestore($id);

            if (!$result['success']) {
                return $this->respondError($result['message'], $result['code'] ?? 404);
            }

            return $this->respondSuccess(null, 'Registro restaurado com sucesso');
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        } finally {
            // reservado para log/auditoria/métricas
        }
    }

    /**
     * DELETE {{www}}/index.php/api/v1/user-management/delete-hard/{id}
     */
    public function deleteHard(int $id): ResponseInterface
    {
        try {
            $result = $this->processor->deleteHard($id);

            if (!$result['success']) {
                return $this->respondError($result['message'], $result['code'] ?? 404);
            }

            return $this->respondSuccess(null, 'Registro excluído permanentemente com sucesso');
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        } finally {
            // reservado para log/auditoria/métricas
        }
    }

    /**
     * DELETE {{www}}/index.php/api/v1/user-management/clear-deleted
     * DELETE {{www}}/index.php/api/v1/user-management/clear-deleted/{id}
     */
    public function clearDeleted(?int $id = null): ResponseInterface
    {
        try {
            $result = $this->processor->clearDeleted($id);

            return $this->respondSuccess(
                ['affected' => $result['affected']],
                'Registros deletados removidos com sucesso'
            );
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        } finally {
            // reservado para log/auditoria/métricas
        }
    }
}
