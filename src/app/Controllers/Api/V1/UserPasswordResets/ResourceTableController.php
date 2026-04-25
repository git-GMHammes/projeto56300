<?php

namespace App\Controllers\Api\V1\UserPasswordResets;

use App\Controllers\Api\V1\BaseResourceTableController;
use App\Requests\V1\UserPasswordResets\CreateRequest;
use App\Requests\V1\UserPasswordResets\UpdateRequest;
use App\Services\V1\UserPasswordResets\Processor;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

/**
 * Controller de recurso para operações diretas na tabela user_password_resets.
 *
 * Todos os 14 endpoints REST estão implementados em BaseResourceTableController.
 * Este controller declara apenas o Processor e as regras de validação do módulo.
 *
 * O fluxo de reset de senha (solicitar, validar token, aplicar senha) está em
 * Api\V1\AuthUser\ResourceViewController.
 */
class ResourceTableController extends BaseResourceTableController
{
    public function initController(
        RequestInterface $request,
        ResponseInterface $response,
        LoggerInterface $logger
    ): void {
        parent::initController($request, $response, $logger);
        $this->processor = new Processor();
    }

    protected function getCreateRules(): array
    {
        return (new CreateRequest())->rules();
    }

    protected function getUpdateRules(): array
    {
        return (new UpdateRequest())->rules();
    }
}
