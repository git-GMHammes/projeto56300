<?php

namespace App\Libraries;

use CodeIgniter\Debug\ExceptionHandlerInterface;
use CodeIgniter\Exceptions\PageNotFoundException;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Throwable;

/**
 * Handler global de exceções para rotas da API.
 *
 * Intercepta qualquer Throwable não tratado nos controllers e retorna
 * JSON padronizado sem expor detalhes internos ao cliente.
 *
 * Casos tratados:
 *  - PageNotFoundException → 404 (rota não encontrada)
 *  - Throwable genérico    → 500 (erro interno no servidor)
 */
class ApiExceptionHandler implements ExceptionHandlerInterface
{
    /**
     * Processa a exceção e emite a resposta JSON padronizada.
     */
    public function handle(
        Throwable $exception,
        RequestInterface $request,
        ResponseInterface $response,
        int $statusCode
    ): void {
        // Determina código HTTP e mensagem conforme o tipo de exceção
        if ($exception instanceof PageNotFoundException) {
            $statusCode = 404;
            $message    = 'Rota não encontrada';
        } else {
            $statusCode = ($statusCode >= 400) ? $statusCode : 500;
            $message    = 'Erro interno no servidor';

            // Loga detalhes internos sem expor ao cliente
            log_message(
                'error',
                '[API ' . $statusCode . '] ' . $exception->getMessage()
                    . ' em ' . $exception->getFile() . ':' . $exception->getLine()
            );
        }

        $body = [
            'method'     => strtoupper($request->getMethod()),
            'endpoint'   => '/' . ltrim($request->getUri()->getPath(), '/'),
            'statusCode' => $statusCode,
            'message'    => $message,
            'success'    => false,
        ];

        $response
            ->setStatusCode($statusCode)
            ->setContentType('application/json')
            ->setBody(json_encode($body))
            ->send();
    }
}
