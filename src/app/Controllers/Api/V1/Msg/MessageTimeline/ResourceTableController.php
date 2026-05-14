<?php

namespace App\Controllers\Api\V1\Msg\MessageTimeline;

use App\Controllers\Api\V1\BaseResourceTableController;
use App\Requests\V1\Msg\MessageTimeline\CreateRequest;
use App\Requests\V1\Msg\MessageTimeline\UpdateRequest;
use App\Services\V1\Msg\MessageTimeline\Processor;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

class ResourceTableController extends BaseResourceTableController
{
    protected string $moduleSlug = 'msg-timeline';

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

    protected function handleInlineUpload(int $recordId = 0): ?array
    {
        $method = strtoupper($this->request->getMethod());
        $files  = $this->request->getFiles()['files'] ?? [];

        if (empty($files) && \in_array($method, ['PUT', 'PATCH'], true) && !empty($this->putFiles)) {
            $files = $this->putFiles;
        }

        if (empty($files)) {
            return null;
        }

        $body             = $this->getRequestBody();
        $userManagementId = (int) ($body['user_management_id'] ?? 0);

        if ($userManagementId <= 0) {
            return ['success' => false, 'message' => 'Informe user_management_id para processar o upload'];
        }

        $uploadService = new \App\Services\V1\MsgFileUploadService();

        return $uploadService->uploadFiles($recordId, 'timeline', $userManagementId, $files);
    }
}
