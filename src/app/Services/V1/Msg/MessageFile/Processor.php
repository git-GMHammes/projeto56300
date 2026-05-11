<?php

namespace App\Services\V1\Msg\MessageFile;

use App\Models\V1\Msg\MessageFile\SqlTableModel;
use App\Models\V1\Msg\MessageFile\SqlViewModel;
use App\Services\V1\Msg\MsgBaseService;

/**
 * Service de negócio para anexos multimídia (msg_008_file).
 *
 * Polimorfismo via discriminador `source` (timeline|private|group) + `source_id`.
 * Após o upload, os campos de identificação do arquivo (stored_path, uuid, checksum)
 * são imutáveis — arquivos só podem ser excluídos (soft delete), não substituídos.
 *
 * Tabela : msg_008_file — source, source_id, user_id, original_name,
 *                         filename, stored_path, uuid, mime, size, category, checksum
 * View   : (sem view dedicada neste momento)
 *
 * Métodos de tabela: find, getGrouped, search, get, getAll, getNoPagination,
 *                    getDeleted, getDeletedAll, create, update,
 *                    deleteSoft, deleteRestore, deleteHard, clearDeleted
 */
class Processor extends MsgBaseService
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

    /**
     * Valida:
     *   - FK do uploader (user_id)
     *   - Unicidade de stored_path (evita duplicata física no disco)
     *   - Unicidade de uuid (garante download seguro único)
     */
    protected function validateOnCreate(array $data): ?array
    {
        if (!empty($data['user_management_id']) && !$this->existsUser((int) $data['user_management_id'])) {
            return ['success' => false, 'message' => 'Usuário não encontrado', 'code' => 422];
        }

        if (!empty($data['stored_path']) && $this->tableModel->existsByField('stored_path', $data['stored_path'])) {
            return ['success' => false, 'message' => 'Arquivo já registrado com esse caminho', 'code' => 409];
        }

        if (!empty($data['uuid']) && $this->tableModel->existsByField('uuid', $data['uuid'])) {
            return ['success' => false, 'message' => 'UUID de arquivo já existe', 'code' => 409];
        }

        return null;
    }

    // -------------------------------------------------------------------------
    // Hooks de preparação de dados
    // -------------------------------------------------------------------------

    /**
     * Gera UUID v4 se não fornecido pelo uploader.
     */
    protected function prepareData(array $data): array
    {
        if (empty($data['uuid'])) {
            $data['uuid'] = sprintf(
                '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
                mt_rand(0, 0xffff), mt_rand(0, 0xffff),
                mt_rand(0, 0xffff),
                mt_rand(0, 0x0fff) | 0x4000,
                mt_rand(0, 0x3fff) | 0x8000,
                mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
            );
        }

        return $data;
    }

    /**
     * Campos de identificação do arquivo são imutáveis após o upload.
     * Apenas category e mime podem ser corrigidos via update.
     */
    protected function prepareUpdateData(int $id, array $data): array
    {
        unset(
            $data['source'], $data['source_id'], $data['user_management_id'],
            $data['original_name'], $data['filename'], $data['stored_path'],
            $data['uuid'], $data['size'], $data['checksum']
        );

        return $data;
    }
}
