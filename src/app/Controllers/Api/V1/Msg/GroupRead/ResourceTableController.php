<?php

namespace App\Controllers\Api\V1\Msg\GroupRead;

use App\Controllers\Api\V1\BaseResourceTableController;
use App\Requests\V1\Msg\GroupRead\CreateRequest;
use App\Requests\V1\Msg\GroupRead\UpdateRequest;
use App\Services\V1\Msg\GroupRead\Processor;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

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
     * PATCH .../mark-read
     * Body JSON: { "group_id": 1, "user_id": 2, "last_read_id": 99 }
     */
    public function markRead(): ResponseInterface
    {
        try {
            $body       = $this->getJsonBody();
            $groupId    = (int) ($body['group_id'] ?? 0);
            $userId     = (int) ($body['user_id'] ?? 0);
            $lastReadId = (int) ($body['last_read_id'] ?? 0);

            if (!$groupId || !$userId || !$lastReadId) {
                return $this->respondValidationError([
                    'group_id'     => 'group_id é obrigatório e deve ser maior que zero',
                    'user_id'      => 'user_id é obrigatório e deve ser maior que zero',
                    'last_read_id' => 'last_read_id é obrigatório e deve ser maior que zero',
                ]);
            }

            $result = $this->processor->markRead($groupId, $userId, $lastReadId);

            if (!$result['success']) {
                return $this->respondError($result['message'], $result['code'] ?? 400);
            }

            return $this->respondSuccess($result['data'], 'Leitura marcada com sucesso');
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        }
    }
}
