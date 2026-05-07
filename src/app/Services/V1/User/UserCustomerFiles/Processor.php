<?php

namespace App\Services\V1\User\UserCustomerFiles;

use App\Models\V1\User\UserCustomerFiles\SqlTableModel;
use App\Models\V1\User\UserCustomerFiles\SqlViewModel;
use App\Services\V1\BaseTableService;
use CodeIgniter\HTTP\Files\UploadedFile;

/**
 * Service de negócio para o módulo UserCustomerFiles.
 *
 * Gerencia arquivos vinculados ao perfil do cliente (user_003_customer_files).
 *
 * Métodos de tabela: find, getGrouped, search, get, getAll, getNoPagination,
 *                    getDeleted, getDeletedAll, create, update,
 *                    deleteSoft, deleteRestore, deleteHard, clearDeleted
 *
 * Métodos de view:   findView, getGroupedView, searchView, getView,
 *                    getAllView, getNoPaginationView, getDeletedView, getDeletedAllView
 */
class Processor extends BaseTableService
{
    protected SqlTableModel $tableModel;
    protected SqlViewModel  $viewModel;

    public function __construct()
    {
        $this->tableModel = new SqlTableModel();
        $this->viewModel  = new SqlViewModel();
    }

    // -------------------------------------------------------------------------
    // Hooks de validação
    // -------------------------------------------------------------------------

    protected function validateOnCreate(array $data): ?array
    {
        if (!empty($data['user_customer_id']) && !$this->tableModel->existsUserCustomer((int) $data['user_customer_id'])) {
            return ['success' => false, 'message' => 'Cliente não encontrado em user_002_customer', 'code' => 422];
        }

        return null;
    }

    // -------------------------------------------------------------------------
    // Hooks de preparação de dados
    // -------------------------------------------------------------------------

    protected function prepareUpdateData(int $id, array $data): array
    {
        unset($data['user_customer_id']);

        return $data;
    }

    // -------------------------------------------------------------------------
    // Upload de avatar
    // -------------------------------------------------------------------------

    /**
     * Recebe o arquivo de imagem, valida, salva no filesystem e registra
     * em user_003_customer_files.
     *
     * Filename gerado: avatar_{userCustomerId}_{uuid}.{ext}
     * Diretório:       writable/uploads/Projeto56300App/user_customer_files/
     *
     * @param int          $userCustomerId ID do registro em user_002_customer
     * @param UploadedFile $file           Arquivo recebido via multipart
     * @return array{success: bool, data?: array, message?: string, code?: int}
     */
    public function uploadAvatar(int $userCustomerId, UploadedFile $file): array
    {
        if (!$this->tableModel->existsUserCustomer($userCustomerId)) {
            return ['success' => false, 'message' => 'Cliente não encontrado', 'code' => 404];
        }

        $allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!in_array($file->getMimeType(), $allowedMimes, true)) {
            return ['success' => false, 'message' => 'Tipo de arquivo não permitido. Use JPEG, PNG ou WebP.', 'code' => 422];
        }

        if ($file->getSize() > 5 * 1024 * 1024) {
            return ['success' => false, 'message' => 'Arquivo muito grande. Máximo 5MB.', 'code' => 422];
        }

        $uuid       = bin2hex(random_bytes(16));
        $ext        = strtolower($file->getClientExtension() ?: 'jpg');
        $filename   = 'avatar_' . $userCustomerId . '_' . $uuid . '.' . $ext;
        $uploadDir  = 'uploads/Projeto56300App/user_customer_files/';
        $uploadPath = WRITEPATH . $uploadDir;

        if (!is_dir($uploadPath)) {
            mkdir($uploadPath, 0755, true);
        }

        if (!$file->move($uploadPath, $filename)) {
            return ['success' => false, 'message' => 'Erro ao salvar o arquivo no servidor', 'code' => 500];
        }

        $storedPath = $uploadPath . $filename;
        $checksum   = hash('sha256', file_get_contents($storedPath));
        $now        = date('Y-m-d H:i:s');

        $insertData = [
            'user_customer_id' => $userCustomerId,
            'original_name'    => $file->getClientFilename(),
            'filename'         => $filename,
            'stored_path'      => $storedPath,
            'uuid'             => $uuid,
            'mime'             => $file->getMimeType(),
            'size'             => $file->getSize(),
            'category'         => 'avatar',
            'checksum'         => $checksum,
            'created_at'       => $now,
            'updated_at'       => $now,
        ];

        try {
            $id = $this->tableModel->insert($insertData);

            if (!$id) {
                return ['success' => false, 'message' => 'Erro ao registrar o arquivo no banco de dados', 'code' => 500];
            }

            return [
                'success' => true,
                'data'    => [
                    'id'           => $id,
                    'user_customer_id' => $userCustomerId,
                    'filename'     => $filename,
                    'stored_path'  => $storedPath,
                    'uuid'         => $uuid,
                    'mime'         => $file->getMimeType(),
                    'size'         => $file->getSize(),
                    'category'     => 'avatar',
                ],
            ];
        } catch (\Throwable $e) {
            log_message('error', '[UserCustomerFiles::uploadAvatar] ' . $e->getMessage());

            return ['success' => false, 'message' => 'Erro interno ao registrar o arquivo', 'code' => 500];
        }
    }
}
