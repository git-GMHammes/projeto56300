<?php

namespace App\Controllers\Api\V1\AuthUser;

use App\Controllers\Api\V1\BaseResourceTableController;
use App\Requests\V1\AuthUser\LoginRequest;
use App\Requests\V1\AuthUser\RecoverPasswordRequest;
use App\Services\V1\AuthUser\Processor;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

/**
 * Controller de recurso para o módulo AuthUser.
 *
 * Expõe o endpoint de autenticação e as consultas somente leitura
 * da view view_auth_user.
 *
 * Nenhuma lógica de negócio aqui — apenas:
 *   1. Valida a requisição (Request)
 *   2. Chama o Processor (Service)
 *   3. Retorna a resposta padronizada
 */
class ResourceViewController extends BaseResourceTableController
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
    // Autenticação
    // -------------------------------------------------------------------------

    /**
     * POST {{www}}/index.php/api/v1/auth/login
     *
     * Autentica o usuário e retorna um token JWT.
     */
    public function login(): ResponseInterface
    {
        try {
            // Validar entrada via LoginRequest
            $loginRequest = new LoginRequest();
            $validation   = \Config\Services::validation();
            $validation->setRules($loginRequest->rules(), $loginRequest->messages());

            $body = $this->getJsonBody();

            if (!$validation->run($body)) {
                return $this->respondValidationError($validation->getErrors());
            }

            // Delegar autenticação ao Service
            $result = $this->processor->authenticate(
                (string) ($body['um_user'] ?? ''),
                (string) ($body['um_password'] ?? '')
            );

            return $this->respondSuccess($result, 'Autenticacao realizada com sucesso');
        } catch (\InvalidArgumentException $e) {
            return $this->respondError($e->getMessage(), 401);
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        }
    }

    /**
     * POST {{www}}/index.php/api/v1/auth/recover-password
     *
     * Verifica se o e-mail existe e envia o e-mail de recuperação de senha.
     */
    public function recoverPassword(): ResponseInterface
    {
        try {
            $recoverRequest = new RecoverPasswordRequest();
            $validation     = \Config\Services::validation();
            $validation->setRules($recoverRequest->rules(), $recoverRequest->messages());

            $body = $this->getJsonBody();

            if (!$validation->run($body)) {
                return $this->respondValidationError($validation->getErrors());
            }

            $result = $this->processor->sendRecoveryEmail(
                (string) ($body['uc_mail'] ?? '')
            );

            return $this->respondSuccess($result, 'E-mail de recuperação enviado com sucesso');
        } catch (\InvalidArgumentException $e) {
            return $this->respondError($e->getMessage(), 404);
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        }
    }

    /**
     * POST {{www}}/index.php/api/v1/auth/logout
     *
     * Valida o token Bearer e encerra a sessão do usuário.
     * O token é extraído do header Authorization e repassado ao Processor.
     */
    public function logout(): ResponseInterface
    {
        try {
            $authHeader = $this->request->getHeaderLine('Authorization');
            $token      = substr($authHeader, 7); // Remove "Bearer "

            $result = $this->processor->logout($token);

            return $this->respondSuccess($result, 'Logout realizado com sucesso');
        } catch (\InvalidArgumentException $e) {
            return $this->respondError($e->getMessage(), 401);
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        }
    }
}
