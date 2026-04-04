<?php

namespace App\Models\V1\UserCustomer;

use App\Models\V1\BaseModel;

/**
 * Model de escrita para a tabela user_customer.
 *
 * Responsável por todas as operações CRUD diretas na tabela física.
 * Inclui verificações de unicidade para CPF, WhatsApp e e-mail,
 * respeitando os registros com soft delete.
 *
 * Tabela: user_customer
 * DDL: id, user_id, name, cpf, whatsapp, profile, mail, phone,
 *      date_birth, zip_code, address, tenant_at, validity, created_at, updated_at, deleted_at, user_id_active (generated)
 */
class SqlTableModel extends BaseModel
{
    protected $DBGroup = DB_GROUP_001;
    protected $table = 'user_customer';
    protected $primaryKey = 'id';
    protected $useSoftDeletes = true;
    protected $useTimestamps = true;

    /**
     * Campos que podem ser inseridos/atualizados via Model.
     * Exclui: id (PK), created_at/updated_at/deleted_at (timestamps), user_id_active (coluna gerada).
     */
    protected $allowedFields = [
        'user_id',
        'name',
        'cpf',
        'whatsapp',
        'profile',
        'mail',
        'phone',
        'date_birth',
        'zip_code',
        'address',
        'tenant_at',
        'validity',
    ];

    /**
     * Campos de texto que usam LIKE %valor% no find.
     * Campos relacionais/numéricos (id, user_id, datas) usam WHERE exato.
     */
    protected array $likeFields = [
        'name', 'cpf', 'whatsapp', 'phone', 'mail', 'address', 'profile', 'zip_code', 'tenant_at',
    ];

    /** Campos válidos para ordenação */
    protected array $sortableFields = [
        'id',
        'user_id',
        'name',
        'cpf',
        'mail',
        'whatsapp',
        'date_birth',
        'validity',
        'created_at',
        'updated_at',
    ];

    /** Campos utilizados na busca textual (GET /search) */
    public array $searchFields = [
        'name',
        'cpf',
        'mail',
        'whatsapp',
        'phone',
        'address',
        'tenant_at',
    ];

    // -------------------------------------------------------------------------
    // Verificações de unicidade (ignora registros soft-deleted)
    // -------------------------------------------------------------------------

    /**
     * Verifica se já existe registro ativo com o CPF informado.
     *
     * @param string   $cpf       CPF a verificar
     * @param int|null $excludeId ID a ignorar (usado no update)
     */
    public function existsByCpf(string $cpf, ?int $excludeId = null): bool
    {
        $builder = $this->db->table($this->table)
            ->where('cpf', $cpf)
            ->where('deleted_at IS NULL', null, false);

        if ($excludeId !== null) {
            $builder->where('id !=', $excludeId);
        }

        return $builder->countAllResults() > 0;
    }

    /**
     * Verifica se já existe registro ativo com o WhatsApp informado.
     *
     * @param string   $whatsapp  WhatsApp a verificar
     * @param int|null $excludeId ID a ignorar (usado no update)
     */
    public function existsByWhatsapp(string $whatsapp, ?int $excludeId = null): bool
    {
        $builder = $this->db->table($this->table)
            ->where('whatsapp', $whatsapp)
            ->where('deleted_at IS NULL', null, false);

        if ($excludeId !== null) {
            $builder->where('id !=', $excludeId);
        }

        return $builder->countAllResults() > 0;
    }

    /**
     * Verifica se já existe registro ativo com o e-mail informado.
     *
     * @param string   $mail      E-mail a verificar
     * @param int|null $excludeId ID a ignorar (usado no update)
     */
    public function existsByMail(string $mail, ?int $excludeId = null): bool
    {
        $builder = $this->db->table($this->table)
            ->where('mail', $mail)
            ->where('deleted_at IS NULL', null, false);

        if ($excludeId !== null) {
            $builder->where('id !=', $excludeId);
        }

        return $builder->countAllResults() > 0;
    }

    // -------------------------------------------------------------------------
    // Verificações de integridade referencial
    // -------------------------------------------------------------------------

    /**
     * Verifica se o user_id existe na tabela pai user_management (registro ativo).
     *
     * Usado antes do insert para evitar violação de FK e retornar erro controlado.
     *
     * @param int $userId ID a verificar em user_management
     */
    public function existsUserManagement(int $userId): bool
    {
        return $this->db->table('user_management')
            ->where('id', $userId)
            ->where('deleted_at IS NULL', null, false)
            ->countAllResults() > 0;
    }

    // -------------------------------------------------------------------------
    // Consultas com soft delete
    // -------------------------------------------------------------------------

    /**
     * Busca registro pelo ID, incluindo os soft-deleted (para restauração).
     */
    public function findWithDeleted(int $id): ?array
    {
        return $this->withDeleted()->find($id);
    }

    /**
     * Busca registro pelo ID somente se estiver soft-deleted.
     */
    public function findOnlyDeleted(int $id): ?array
    {
        return $this->onlyDeleted()->find($id);
    }

    /**
     * Lista registros soft-deleted com paginação.
     */
    public function findDeletedPaginated(
        int $page = 1,
        int $limit = 20,
        string $sort = 'id',
        string $order = 'desc'
    ): array {
        [$sort, $order] = $this->sanitizeSort($sort, $order);

        $builder = $this->db->table($this->table)
            ->where('deleted_at IS NOT NULL', null, false);

        $total = $builder->countAllResults(false);

        $data = $builder
            ->orderBy($sort, $order)
            ->limit($limit, ($page - 1) * $limit)
            ->get()
            ->getResultArray();

        return $this->buildPaginatedResult($data, $total, $page, $limit);
    }

    /**
     * Remove permanentemente (hard delete) todos os registros soft-deleted,
     * ou apenas um específico se $id for informado.
     *
     * @return int Quantidade de registros removidos
     */
    public function clearDeleted(?int $id = null): int
    {
        $builder = $this->db->table($this->table)
            ->where('deleted_at IS NOT NULL', null, false);

        if ($id !== null) {
            $builder->where('id', $id);
        }

        $affected = $builder->countAllResults(false);
        $builder->delete();

        return $affected;
    }
}
