<?php

/**
 * Class BaseResourceController
 *
 * Controlador base abstrato para recursos RESTful da API v1.
 * Centraliza: formato JSON, envelope de resposta padronizado, validação de Request,
 * execução segura de serviços com log de exceções e respostas HTTP semânticas.
 *
 * @package App\Controllers\Api\V1
 */

namespace App\Controllers\Api\V1;

use CodeIgniter\RESTful\ResourceController;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;

abstract class BaseResourceController extends ResourceController
{
    // Força todas as respostas como JSON
    protected $format = 'json';

    // -------------------------------------------------------------------------
    // Validação
    // -------------------------------------------------------------------------

    /**
     * Valida os dados da requisição usando regras e mensagens customizadas.
     * Retorna true em caso de sucesso ou array com chave 'errors' em caso de falha.
     *
     * @param array $rules    Regras de validação do CI4
     * @param array $messages Mensagens customizadas por campo
     * @return true|array
     */
    protected function validateRequest(array $rules, array $messages = []): bool|array
    {
        $validation = Services::validation();
        $validation->reset();
        $validation->setRules($rules, $messages);

        if (!$validation->withRequest($this->request)->run()) {
            return ['errors' => $validation->getErrors()];
        }

        return true;
    }

    // -------------------------------------------------------------------------
    // Execução segura de serviços
    // -------------------------------------------------------------------------

    /**
     * Executa um callable de serviço capturando qualquer exceção.
     * Em caso de erro, registra log e retorna resposta HTTP 500 padronizada.
     *
     * @param callable    $callback     Lógica de serviço a executar
     * @param string|null $errorMessage Mensagem customizada para o log/resposta
     * @return ResponseInterface
     */
    protected function executeService(callable $callback, ?string $errorMessage = null): ResponseInterface
    {
        try {
            return $callback();
        } catch (\Throwable $e) {
            log_message('error', '[{class}] {message} | Arquivo: {file} | Linha: {line}', [
                'class'   => static::class,
                'message' => $e->getMessage(),
                'file'    => $e->getFile(),
                'line'    => $e->getLine(),
            ]);

            return $this->failServerError($errorMessage ?? 'Erro interno do servidor.');
        }
    }

    // -------------------------------------------------------------------------
    // Respostas padronizadas — envelope JSON consistente
    // -------------------------------------------------------------------------

    /**
     * Resposta de sucesso com envelope padronizado.
     *
     * @param mixed $data Dados a retornar
     * @param int   $code Código HTTP (padrão 200)
     * @return ResponseInterface
     */
    protected function successResponse(mixed $data, int $code = ResponseInterface::HTTP_OK): ResponseInterface
    {
        return $this->respond([
            'status' => true,
            'code'   => $code,
            'data'   => $data,
        ], $code);
    }

    /**
     * Resposta de criação de recurso com HTTP 201.
     *
     * @param mixed $data Dados do recurso criado
     * @return ResponseInterface
     */
    protected function createdResponse(mixed $data): ResponseInterface
    {
        return $this->successResponse($data, ResponseInterface::HTTP_CREATED);
    }

    /**
     * Resposta de erro de validação com HTTP 422.
     *
     * @param array $errors Mapa campo → mensagem de erro
     * @return ResponseInterface
     */
    protected function validationErrorResponse(array $errors): ResponseInterface
    {
        return $this->failValidationErrors($errors);
    }

    /**
     * Resposta de recurso não encontrado com HTTP 404.
     *
     * @param string $message Mensagem descritiva
     * @return ResponseInterface
     */
    protected function notFoundResponse(string $message = 'Registro não encontrado.'): ResponseInterface
    {
        return $this->failNotFound($message);
    }

    /**
     * Resposta de operação não autorizada com HTTP 401.
     *
     * @param string $message Mensagem descritiva
     * @return ResponseInterface
     */
    protected function unauthorizedResponse(string $message = 'Não autorizado.'): ResponseInterface
    {
        return $this->failUnauthorized($message);
    }
}
