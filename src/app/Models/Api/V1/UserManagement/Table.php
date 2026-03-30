<?php

/**
 * Class Table
 *
 * Model da tabela `user_management`.
 * Gerencia: campos permitidos, soft delete, timestamps e hash automático de senha
 * via callbacks de ciclo de vida do CI4 (beforeInsert / beforeUpdate).
 *
 * Regras de validação completas estão nas classes Request — o Model propositalmente
 * não duplica essas regras (DRY).
 *
 * @package App\Models\Api\V1\UserManagement
 */

namespace App\Models\Api\V1\UserManagement;

use CodeIgniter\Model;

class Table extends Model
{
    // -------------------------------------------------------------------------
    // Configuração da tabela
    // -------------------------------------------------------------------------

    protected $table            = 'user_management';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';

    // Campos que podem ser inseridos/atualizados (whitelist — proteção contra mass-assignment)
    protected $allowedFields = ['user', 'password', 'last_login'];

    // -------------------------------------------------------------------------
    // Soft Delete
    // -------------------------------------------------------------------------

    protected $useSoftDeletes = true;
    protected $deletedField   = 'deleted_at';

    // -------------------------------------------------------------------------
    // Timestamps automáticos
    // -------------------------------------------------------------------------

    protected $useTimestamps = true;
    protected $createdField  = 'created_at';
    protected $updatedField  = 'updated_at';
    protected $dateFormat    = 'datetime';

    // -------------------------------------------------------------------------
    // Validação no Model — desativada intencionalmente
    // A validação é responsabilidade das classes Request (desacoplamento)
    // -------------------------------------------------------------------------

    protected $skipValidation       = true;
    protected $cleanValidationRules = true;

    // -------------------------------------------------------------------------
    // Callbacks de ciclo de vida
    // -------------------------------------------------------------------------

    protected $beforeInsert = ['hashPassword'];
    protected $beforeUpdate = ['hashPassword'];

    /**
     * Faz o hash da senha antes de qualquer persistência no banco.
     * Ignora silenciosamente quando o campo não está presente na operação.
     *
     * @param array $data Dados do evento de callback
     * @return array
     */
    protected function hashPassword(array $data): array
    {
        if (!empty($data['data']['password'])) {
            $data['data']['password'] = password_hash(
                $data['data']['password'],
                PASSWORD_BCRYPT,
                ['cost' => 12]
            );
        }

        return $data;
    }
}
