<?php

namespace App\Controllers\Api\V1\User\UserCustomer;

use App\Controllers\Api\V1\BaseResourceTableController;
use App\Requests\V1\User\UserCustomer\CreateRequest;
use App\Requests\V1\User\UserCustomer\UpdateRequest;
use App\Services\V1\User\UserCustomer\Processor;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

/**
 * Controller de recurso para operações diretas na tabela user_002_customer.
 *
 * Todos os 14 endpoints REST estão implementados em BaseResourceTableController.
 * Este controller declara apenas o Processor e as regras de validação do módulo.
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

    /**
     * POST .../upload-avatar/{id}
     *
     * Recebe multipart/form-data com campo "file" (imagem).
     * Salva o arquivo, registra em user_003_customer_files e
     * atualiza user_002_customer.profile com o caminho gravado.
     * Endpoint público — não requer autenticação (fluxo de registro).
     */
    public function uploadAvatar(int $id): ResponseInterface
    {
        try {
            $file = $this->request->getFile('file');

            if (!$file || !$file->isValid()) {
                return $this->respondValidationError(['file' => 'Arquivo inválido ou não enviado']);
            }

            $result = $this->processor->uploadAvatar($id, $file);

            if (!$result['success']) {
                return $this->respondError($result['message'], $result['code'] ?? 400);
            }

            return $this->respondSuccess($result['data'], 'Foto de perfil enviada com sucesso');
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        }
    }
}
