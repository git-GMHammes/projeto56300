<?php

namespace App\Controllers\Api\V1\UserCustomer;

use App\Controllers\Api\V1\BaseResourceController;
use App\Services\V1\UserCustomer\Processor;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

/**
 * Controller de recurso para consultas na view v_user_customer.
 *
 * Orquestra 8 endpoints REST somente leitura:
 *   find, getGrouped, search, get, getAll, getNoPagination,
 *   getDeleted, getDeletedAll
 *
 * Nenhuma operação de escrita está disponível neste controller.
 * Nenhuma lógica de negócio aqui — apenas:
 *   1. Valida a requisição (Request)
 *   2. Chama o Processor (Service)
 *   3. Retorna a resposta padronizada
 */
class ResourceViewController extends BaseResourceController
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
    // Endpoints de leitura (view)
    // -------------------------------------------------------------------------

    /**
     * POST {{www}}/index.php/api/v1/user-customer-view/find?page=1&limit=20&sort=id&order=desc
     *
     * Body JSON: { "campo": "valor", "outro": "valor" }
     * Cada chave é um campo da view; cada valor é um escalar para WHERE exato.
     */
    public function find(): ResponseInterface
    {
        try {
            $body    = $this->getJsonBody();
            $filters = \is_array($body) ? $body : [];

            $result = $this->processor->findView($filters, $this->getPaginationParams());

            return $this->respondPaginated($result['data'], $result['pagination']);
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        } finally {
            // reservado para log/auditoria/métricas
        }
    }

    /**
     * POST {{www}}/index.php/api/v1/user-customer-view/get-grouped?page=1&limit=20&sort=id&order=desc
     *
     * Body JSON: { "coluna": ["valor1", "valor2"], "outra_coluna": ["valorX"] }
     * Cada chave é um campo da view; cada valor é um array de strings aceitas.
     * Retorna todos os registros que correspondam via WHERE IN — sem GROUP BY.
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

            $result = $this->processor->getGroupedView($multiFilters, $this->getPaginationParams());

            return $this->respondPaginated($result['data'], $result['pagination'], 'Registros listados com sucesso');
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        } finally {
            // reservado para log/auditoria/métricas
        }
    }

    /**
     * GET {{www}}/index.php/api/v1/user-customer-view/search?q=termo&page=1&limit=20&sort=id&order=desc
     */
    public function search(): ResponseInterface
    {
        try {
            $term   = trim((string) ($this->request->getGet('q') ?? ''));
            $result = $this->processor->searchView($term, $this->getPaginationParams());

            return $this->respondPaginated($result['data'], $result['pagination']);
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        } finally {
            // reservado para log/auditoria/métricas
        }
    }

    /**
     * GET {{www}}/index.php/api/v1/user-customer-view/get/{id}
     */
    public function get(int $id): ResponseInterface
    {
        try {
            $record = $this->processor->getView($id);

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
     * GET {{www}}/index.php/api/v1/user-customer-view/get-all?page=1&limit=20&sort=id&order=desc
     */
    public function getAll(): ResponseInterface
    {
        try {
            $result = $this->processor->getAllView($this->getPaginationParams());

            return $this->respondPaginated($result['data'], $result['pagination']);
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        } finally {
            // reservado para log/auditoria/métricas
        }
    }

    /**
     * GET {{www}}/index.php/api/v1/user-customer-view/get-no-pagination?sort=id&order=desc
     */
    public function getNoPagination(): ResponseInterface
    {
        try {
            $sort  = trim((string) ($this->request->getGet('sort') ?? 'id'));
            $order = trim((string) ($this->request->getGet('order') ?? 'desc'));
            $data  = $this->processor->getNoPaginationView($sort, $order);

            return $this->respondSuccess($data);
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        } finally {
            // reservado para log/auditoria/métricas
        }
    }

    /**
     * GET {{www}}/index.php/api/v1/user-customer-view/get-deleted/{id}
     */
    public function getDeleted(int $id): ResponseInterface
    {
        try {
            $record = $this->processor->getDeletedView($id);

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
     * GET {{www}}/index.php/api/v1/user-customer-view/get-deleted-all?page=1&limit=20&sort=id&order=desc
     */
    public function getDeletedAll(): ResponseInterface
    {
        try {
            $result = $this->processor->getDeletedAllView($this->getPaginationParams());

            return $this->respondPaginated($result['data'], $result['pagination'], 'Registros deletados listados com sucesso');
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        } finally {
            // reservado para log/auditoria/métricas
        }
    }
}
