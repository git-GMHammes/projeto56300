<?php

namespace App\Controllers\Api\V1\User\UserCustomerFiles;

use App\Controllers\Api\V1\BaseResourceTableController;
use App\Requests\V1\User\UserCustomerFiles\CreateRequest;
use App\Requests\V1\User\UserCustomerFiles\UpdateRequest;
use App\Services\V1\User\UserCustomerFiles\Processor;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

/**
 * Controller de recurso para operações diretas na tabela user_003_customer_files.
 *
 * Todos os 14 endpoints REST estão implementados em BaseResourceTableController.
 * Este controller declara apenas o Processor, as regras de validação do módulo
 * e o endpoint exclusivo de upload de avatar.
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
     * Recebe multipart/form-data com campo "file" (imagem JPEG, PNG ou WebP).
     * Salva o arquivo em writable/uploads/Projeto56300App/user_customer_files/
     * com o nome avatar_{user_customer_id}_{uuid}.{ext} e registra em
     * user_003_customer_files.
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

            return $this->respondSuccess($result['data'], 'Avatar enviado com sucesso');
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        }
    }
}
