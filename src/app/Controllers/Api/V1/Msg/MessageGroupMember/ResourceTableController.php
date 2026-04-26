<?php

namespace App\Controllers\Api\V1\Msg\MessageGroupMember;

use App\Controllers\Api\V1\BaseResourceTableController;
use App\Requests\V1\Msg\MessageGroupMember\CreateRequest;
use App\Requests\V1\Msg\MessageGroupMember\UpdateRequest;
use App\Services\V1\Msg\MessageGroupMember\Processor;
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
}
