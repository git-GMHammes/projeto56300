<?php

namespace App\Services\V1;

use App\Models\V1\User\UserCustomerFiles\SqlTableModel as FileModel;
use CodeIgniter\HTTP\Files\UploadedFile;

/**
 * Serviço genérico de upload para qualquer módulo da API V1.
 *
 * Organiza arquivos em:
 *   writable/uploads/Projeto56300App/user_customer_files/
 *     usu_{19-digit-id}/
 *       {module-slug}/
 *         file_upload_{uuid32hex}.{ext}
 *
 * Registra cada arquivo em user_003_customer_files com stored_path
 * RELATIVO ao WRITEPATH — portável entre ambientes e containers.
 *
 * Como usar em qualquer módulo:
 *   1. Instanciar no construtor do Processor: $this->fileUploadService = new FileUploadService();
 *   2. Chamar: $this->fileUploadService->uploadFiles($userId, $files, 'meu-modulo');
 *
 * Como expor via rota (opcional):
 *   1. Definir no controller do módulo: protected string $moduleSlug = 'meu-modulo';
 *   2. Adicionar rota: $routes->post('upload-files/(:num)', 'Controller::uploadAttachments/$1');
 */
class FileUploadService
{
    private FileModel $fileModel;

    private const BASE_UPLOAD_DIR = 'uploads/Projeto56300App/user_customer_files/';

    public function __construct()
    {
        $this->fileModel = new FileModel();
    }

    /**
     * Faz upload de um ou mais arquivos vinculados a um usuário, organizados por módulo.
     *
     * @param int            $userCustomerId   ID do cliente em user_002_customer
     * @param UploadedFile[] $files            Array de arquivos (campo files[] multipart/form-data)
     * @param string         $moduleSlug       Slug do módulo de origem (ex: 'msg-timeline', 'est-product')
     * @param string         $category         Categoria do registro: 'document' | 'avatar' | livre
     * @param int            $maxSizeMb        Tamanho máximo em MB por arquivo (default: 10)
     * @param string[]       $allowedMimes     MIMEs aceitos; array vazio = aceita qualquer tipo
     * @param int|null       $userSaasTenantId ID do tenant para isolamento multi-tenant (nullable)
     * @return array{success: bool, results: array, total: int, success_count: int, error_count: int}
     *              ou array{success: bool, message: string, code: int} em caso de erro fatal
     */
    public function uploadFiles(
        int    $userCustomerId,
        array  $files,
        string $moduleSlug       = 'general',
        string $category         = 'document',
        int    $maxSizeMb        = 10,
        array  $allowedMimes     = [],
        int    $userSaasTenantId
    ): array {
        if (!$this->fileModel->existsUserCustomer($userCustomerId)) {
            return ['success' => false, 'message' => 'Cliente não encontrado', 'code' => 404];
        }

        $userFolder = \sprintf('usu_%019d', $userCustomerId);
        $uploadDir  = self::BASE_UPLOAD_DIR . $userFolder . '/' . $moduleSlug . '/';
        $uploadPath = WRITEPATH . $uploadDir;

        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0755, true);
        }

        $results      = [];
        $successCount = 0;
        $errorCount   = 0;
        $maxBytes     = $maxSizeMb * 1024 * 1024;

        foreach ($files as $index => $file) {
            if (!($file instanceof UploadedFile) || !$file->isValid()) {
                $results[] = [
                    'index'   => $index,
                    'success' => false,
                    'message' => 'Arquivo inválido ou não enviado',
                ];
                $errorCount++;
                continue;
            }

            if ($file->getSize() > $maxBytes) {
                $results[] = [
                    'index'         => $index,
                    'success'       => false,
                    'message'       => "Arquivo muito grande. Máximo {$maxSizeMb}MB.",
                    'original_name' => $file->getName(),
                ];
                $errorCount++;
                continue;
            }

            if (!empty($allowedMimes) && !\in_array($file->getMimeType(), $allowedMimes, true)) {
                $results[] = [
                    'index'         => $index,
                    'success'       => false,
                    'message'       => 'Tipo de arquivo não permitido: ' . $file->getMimeType(),
                    'original_name' => $file->getName(),
                ];
                $errorCount++;
                continue;
            }

            $originalName = $file->getName();
            $mime         = $file->getMimeType();
            $size         = $file->getSize();
            $uuid         = \bin2hex(\random_bytes(16));
            $ext          = \strtolower($file->getClientExtension() ?: 'bin');
            $filename     = 'file_upload_' . $uuid . '.' . $ext;

            if (!$file->move($uploadPath, $filename)) {
                $results[] = [
                    'index'         => $index,
                    'success'       => false,
                    'message'       => 'Erro ao salvar o arquivo no servidor',
                    'original_name' => $originalName,
                ];
                $errorCount++;
                continue;
            }

            $storedPath = $uploadDir . $filename;
            $checksum   = \hash('sha256', \file_get_contents(WRITEPATH . $storedPath));
            $now        = \date('Y-m-d H:i:s');

            $insertData = [
                'user_customer_id' => $userCustomerId,
                'original_name'    => $originalName,
                'filename'         => $filename,
                'stored_path'      => $storedPath,
                'uuid'             => $uuid,
                'mime'             => $mime,
                'size'             => $size,
                'category'         => $category,
                'checksum'         => $checksum,
                'created_at'       => $now,
                'updated_at'       => $now,
            ];

            $insertData['user_saas_tenants_id'] = $userSaasTenantId;

            try {
                $id = $this->fileModel->insert($insertData);

                if (!$id) {
                    $results[] = [
                        'index'         => $index,
                        'success'       => false,
                        'message'       => 'Erro ao registrar no banco de dados',
                        'original_name' => $originalName,
                    ];
                    $errorCount++;
                    continue;
                }

                $results[] = [
                    'index'   => $index,
                    'success' => true,
                    'data'    => [
                        'id'                   => $id,
                        'user_customer_id'     => $userCustomerId,
                        'user_saas_tenants_id' => $userSaasTenantId,
                        'module_slug'          => $moduleSlug,
                        'original_name'        => $originalName,
                        'filename'             => $filename,
                        'stored_path'          => $storedPath,
                        'uuid'                 => $uuid,
                        'mime'                 => $mime,
                        'size'                 => $size,
                        'category'             => $category,
                        'checksum'             => $checksum,
                    ],
                ];
                $successCount++;
            } catch (\Throwable $e) {
                log_message('error', '[FileUploadService::uploadFiles] ' . $e->getMessage());
                $results[] = [
                    'index'         => $index,
                    'success'       => false,
                    'message'       => 'Erro interno ao registrar o arquivo',
                    'original_name' => $originalName,
                ];
                $errorCount++;
            }
        }

        return [
            'success'       => $successCount > 0,
            'results'       => $results,
            'total'         => \count($files),
            'success_count' => $successCount,
            'error_count'   => $errorCount,
        ];
    }
}
