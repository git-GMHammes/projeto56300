<?php

namespace App\Controllers\Api\V1\Msg\Group;

use App\Controllers\Api\V1\BaseResourceViewController;
use App\Requests\V1\Msg\Group\SearchRequest;
use App\Services\V1\Msg\Group\Processor;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Psr\Log\LoggerInterface;

class ResourceViewController extends BaseResourceViewController
{
    public function initController(
        RequestInterface $request,
        ResponseInterface $response,
        LoggerInterface $logger
    ): void {
        parent::initController($request, $response, $logger);
        $this->processor = new Processor();
    }

    /**
     * GET .../group-view/search?q=termo
     * O termo é sanitizado pelo ContentFilter antes de consultar a view.
     */
    public function search(): ResponseInterface
    {
        try {
            $term   = trim((string) ($this->request->getGet('q') ?? ''));
            $term   = (new SearchRequest())->sanitizeTerm($term);
            $result = $this->processor->searchView($term, $this->getPaginationParams());

            return $this->respondPaginated($result['data'], $result['pagination']);
        } catch (\Throwable $e) {
            return $this->respondServerError($e);
        }
    }
}
