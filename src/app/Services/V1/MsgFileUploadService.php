<?php

declare(strict_types=1);

namespace App\Services\V1;

use App\Models\V1\Msg\MessageFile\SqlTableModel as MsgFileModel;
use CodeIgniter\HTTP\Files\UploadedFile;

/**
 * Serviço de upload para módulos de mensagens (msg_*).
 *
 * Salva o arquivo em disco e registra em msg_003_timeline_file com o discriminador
 * polimórfico source (timeline | private | group) e source_id apontando
 * para o registro-pai na tabela do módulo.
 *
 * Como usar em um módulo msg_*:
 *   Sobrescrever handleInlineUpload(int $recordId) no controller do módulo:
 *
 *   protected function handleInlineUpload(int $recordId = 0): ?array
 *   {
 *       // ... obter $files e $userManagementId do request ...
 *       $svc = new MsgFileUploadService();
 *       return $svc->uploadFiles($recordId, 'private', $userManagementId, $files);
 *   }
 */
class MsgFileUploadService
{
    private MsgFileModel $fileModel;

    private const BASE_UPLOAD_DIR = 'uploads/Projeto56300App/msg_files/';

    public function __construct()
    {
        $this->fileModel = new MsgFileModel();
    }

    /**
     * @param int            $sourceId         ID do registro na tabela-mãe (timeline, private ou group)
     * @param string         $source           Discriminador: 'timeline' | 'private' | 'group'
     * @param int            $userManagementId FK para user_001_management (uploader)
     * @param UploadedFile[] $files            Arquivos recebidos (campo files[] multipart)
     * @param int            $maxSizeMb        Limite por arquivo em MB
     * @param string[]       $allowedMimes     MIMEs aceitos; vazio = qualquer tipo
     */
    public function uploadFiles(
        int    $sourceId,
        string $source,
        int    $userManagementId,
        array  $files,
        int    $maxSizeMb    = 10,
        array  $allowedMimes = []
    ): array {
        $uploadDir  = self::BASE_UPLOAD_DIR . $source . '/' . \sprintf('%019d', $sourceId) . '/';
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
                $results[] = ['index' => $index, 'success' => false, 'message' => 'Arquivo inválido ou não enviado'];
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
            $category   = $this->detectCategory($mime);

            try {
                $id = $this->fileModel->insert([
                    'source'             => $source,
                    'source_id'          => $sourceId,
                    'user_management_id' => $userManagementId,
                    'original_name'      => $originalName,
                    'filename'           => $filename,
                    'stored_path'        => $storedPath,
                    'uuid'               => $uuid,
                    'mime'               => $mime,
                    'size'               => $size,
                    'category'           => $category,
                    'checksum'           => $checksum,
                ]);

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
                        'id'                 => $id,
                        'source'             => $source,
                        'source_id'          => $sourceId,
                        'user_management_id' => $userManagementId,
                        'original_name'      => $originalName,
                        'filename'           => $filename,
                        'stored_path'        => $storedPath,
                        'uuid'               => $uuid,
                        'mime'               => $mime,
                        'size'               => $size,
                        'category'           => $category,
                        'checksum'           => $checksum,
                    ],
                ];
                $successCount++;
            } catch (\Throwable $e) {
                log_message('error', '[MsgFileUploadService::uploadFiles] ' . $e->getMessage());
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

    private function detectCategory(string $mime): string
    {
        return match(true) {
            \str_starts_with($mime, 'image/') => 'image',
            \str_starts_with($mime, 'video/') => 'video',
            \str_starts_with($mime, 'audio/') => 'audio',
            default                            => 'document',
        };
    }
}
