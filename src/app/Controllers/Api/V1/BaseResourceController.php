<?php

namespace App\Controllers\Api\V1;

use App\Controllers\BaseController;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

/**
 * Controller base para os recursos da API V1.
 *
 * Fornece helpers de resposta padronizados (method, endpoint, statusCode, message, success, data, errors, pagination)
 * e utilitários para extração de parâmetros de paginação e corpo JSON.
 *
 * Os controllers específicos de cada módulo devem herdar desta classe.
 * Nenhuma lógica de negócio deve existir aqui — apenas orquestração de resposta.
 */
abstract class BaseResourceController extends BaseController
{
    /**
     * Inicializa o controller base.
     * Chamar parent::initController() nos filhos para preservar a cadeia.
     */
    public function initController(
        RequestInterface $request,
        ResponseInterface $response,
        LoggerInterface $logger
    ): void {
        parent::initController($request, $response, $logger);
    }

    // -------------------------------------------------------------------------
    // Helpers de resposta
    // -------------------------------------------------------------------------

    /**
     * Resposta de sucesso genérica (padrão HTTP 200).
     *
     * @param mixed  $data       Dados a retornar (null omite a chave "data")
     * @param string $message    Mensagem legível para o cliente
     * @param int    $statusCode Código HTTP (default 200)
     */
    protected function respondSuccess(
        mixed $data = null,
        string $message = 'Operação realizada com sucesso',
        int $statusCode = 200
    ): ResponseInterface {
        $body = [
            'method'     => strtoupper($this->request->getMethod()),
            'endpoint'   => '/' . ltrim($this->request->getUri()->getPath(), '/'),
            'statusCode' => $statusCode,
            'message'    => $message,
            'success'    => true,
        ];

        if ($data !== null) {
            $body['data'] = $data;
        }

        return $this->response->setStatusCode($statusCode)->setJSON($body);
    }

    /**
     * Resposta de criação bem-sucedida (HTTP 201).
     *
     * @param mixed  $data    Registro criado
     * @param string $message Mensagem legível
     */
    protected function respondCreated(
        mixed $data = null,
        string $message = 'Registro criado com sucesso'
    ): ResponseInterface {
        return $this->respondSuccess($data, $message, 201);
    }

    /**
     * Resposta de sucesso com paginação (HTTP 200).
     *
     * @param array  $data       Lista de registros
     * @param array  $pagination Metadados: page, limit, total, pages
     * @param string $message    Mensagem legível
     */
    protected function respondPaginated(
        array $data,
        array $pagination,
        string $message = 'Registros listados com sucesso'
    ): ResponseInterface {
        return $this->response->setStatusCode(200)->setJSON([
            'method'     => strtoupper($this->request->getMethod()),
            'endpoint'   => '/' . ltrim($this->request->getUri()->getPath(), '/'),
            'statusCode' => 200,
            'message'    => $message,
            'success'    => true,
            'data'       => $data,
            'pagination' => $pagination,
        ]);
    }

    /**
     * Resposta de recurso não encontrado (HTTP 404).
     *
     * @param string $message Mensagem legível
     */
    protected function respondNotFound(
        string $message = 'Registro não encontrado'
    ): ResponseInterface {
        return $this->response->setStatusCode(404)->setJSON([
            'method'     => strtoupper($this->request->getMethod()),
            'endpoint'   => '/' . ltrim($this->request->getUri()->getPath(), '/'),
            'statusCode' => 404,
            'message'    => $message,
            'success'    => false,
        ]);
    }

    /**
     * Resposta de falha de validação (HTTP 422).
     *
     * @param array  $errors  Mapa de erros [campo => [regra => mensagem]]
     * @param string $message Mensagem legível
     */
    protected function respondValidationError(
        array $errors = [],
        string $message = 'Erro de validação'
    ): ResponseInterface {
        return $this->response->setStatusCode(422)->setJSON([
            'method'     => strtoupper($this->request->getMethod()),
            'endpoint'   => '/' . ltrim($this->request->getUri()->getPath(), '/'),
            'statusCode' => 422,
            'message'    => $message,
            'success'    => false,
            'errors'     => $errors,
        ]);
    }

    /**
     * Resposta de erro genérico.
     *
     * @param string $message    Mensagem de erro
     * @param int    $statusCode Código HTTP (default 400)
     */
    protected function respondError(
        string $message,
        int $statusCode = 400
    ): ResponseInterface {
        return $this->response->setStatusCode($statusCode)->setJSON([
            'method'     => strtoupper($this->request->getMethod()),
            'endpoint'   => '/' . ltrim($this->request->getUri()->getPath(), '/'),
            'statusCode' => $statusCode,
            'message'    => $message,
            'success'    => false,
        ]);
    }

    /**
     * Resposta de erro interno do servidor (HTTP 500).
     * Loga o Throwable e retorna JSON padronizado sem expor detalhes internos.
     *
     * @param \Throwable $e Exceção capturada
     */
    protected function respondServerError(\Throwable $e): ResponseInterface
    {
        log_message('error', '[API 500] ' . $e->getMessage() . ' em ' . $e->getFile() . ':' . $e->getLine());

        return $this->response->setStatusCode(500)->setJSON([
            'method'     => strtoupper($this->request->getMethod()),
            'endpoint'   => '/' . ltrim($this->request->getUri()->getPath(), '/'),
            'statusCode' => 500,
            'message'    => 'Erro interno no servidor',
            'success'    => false,
        ]);
    }

    // -------------------------------------------------------------------------
    // Utilitários de requisição
    // -------------------------------------------------------------------------

    /**
     * Extrai e normaliza os parâmetros de paginação da query string.
     *
     * @return array{page: int, limit: int, sort: string, order: string}
     */
    protected function getPaginationParams(): array
    {
        return [
            'page'  => max(1, (int) ($this->request->getGet('page') ?? 1)),
            'limit' => min(100, max(1, (int) ($this->request->getGet('limit') ?? 20))),
            'sort'  => trim((string) ($this->request->getGet('sort') ?? 'id')),
            'order' => trim((string) ($this->request->getGet('order') ?? 'desc')),
        ];
    }

    /**
     * Decodifica e retorna o corpo JSON da requisição como array.
     * Retorna array vazio se o corpo estiver ausente ou inválido.
     */
    protected function getJsonBody(): array
    {
        return (array) ($this->request->getJSON(true) ?? []);
    }
}
