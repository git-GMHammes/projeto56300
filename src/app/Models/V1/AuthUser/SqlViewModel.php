<?php

namespace App\Models\V1\AuthUser;

use App\Models\V1\BaseViewModel;

/**
 * Model de leitura para a view view_auth_user.
 *
 * Responsável exclusivamente por consultas (read-only).
 * A view une user_customer (uc) com user_management (um).
 *
 * O campo deleted_at reflete user_management.deleted_at.
 *
 * Todos os métodos de leitura genéricos estão disponíveis via BaseViewModel.
 * Este model expõe apenas os métodos específicos de autenticação.
 */
class SqlViewModel extends BaseViewModel
{
    protected $DBGroup    = DB_GROUP_001;
    protected $table      = 'view_auth_user';
    protected $primaryKey = 'id';

    /**
     * Campos de texto que usam LIKE %valor% no findPaginatedView.
     */
    protected array $likeFields = [
        'um_user', 'uc_name', 'uc_cpf', 'uc_whatsapp', 'uc_phone',
        'uc_mail', 'uc_address', 'uc_profile', 'uc_zip_code',
    ];

    /** Campos válidos para ordenação */
    protected array $sortableFields = [
        'id',
        'um_user',
        'uc_name',
        'uc_cpf',
        'uc_mail',
        'uc_whatsapp',
        'created_at',
        'updated_at',
    ];

    /** Campos utilizados na busca textual (GET /search) */
    public array $searchFields = [
        'um_user',
        'uc_name',
        'uc_cpf',
        'uc_mail',
        'uc_whatsapp',
        'uc_phone',
        'uc_address',
    ];

    // -------------------------------------------------------------------------
    // Consultas específicas de autenticação
    // -------------------------------------------------------------------------

    /**
     * Busca um usuário ativo na view pelo campo um_user (login).
     *
     * @param  string $user Valor do campo um_user
     * @return array|null   Registro completo da view ou null se não encontrado
     */
    public function findByUser(string $user): ?array
    {
        $result = $this->db->table($this->table)
            ->where('um_user', $user)
            ->where('deleted_at IS NULL', null, false)
            ->get()
            ->getRowArray();

        return $result ?: null;
    }

    /**
     * Busca um usuário ativo na view pelo campo uc_mail.
     *
     * @param  string $mail Valor do campo uc_mail
     * @return array|null   Registro completo da view ou null se não encontrado
     */
    public function findByMail(string $mail): ?array
    {
        $result = $this->db->table($this->table)
            ->where('uc_mail', $mail)
            ->where('deleted_at IS NULL', null, false)
            ->get()
            ->getRowArray();

        return $result ?: null;
    }
}
