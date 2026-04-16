<?php

namespace App\Controllers\Api\V1c\Mec\VehicleBrand;

use App\Controllers\Api\V1\BaseResourceTableController;
use App\Requests\V1\Mec\VehicleBrand\CreateRequest;
use App\Requests\V1\Mec\VehicleBrand\UpdateRequest;
use App\Services\V1\Mec\VehicleBrand\Processor;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

/**
 * Controller de recurso para operações diretas na tabela user_customer.
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
}
