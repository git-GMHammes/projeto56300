<?php

namespace App\Models\V1\UserManagement;

use App\Models\V1\BaseModel;

/**
 * Model de escrita para a tabela user_management.
 *
 * Responsável por todas as operações CRUD diretas na tabela física.
 *
 * Tabela: user_management
 * DDL: id, user, password, last_login, created_at, updated_at, deleted_at
 */
class SqlTableModel extends BaseModel
{
    protected $DBGroup = DB_GROUP_001;
    protected $table = 'user_management';
    protected $primaryKey = 'id';
    protected $useSoftDeletes = true;
    protected $useTimestamps = true;

    /**
     * Campos excluídos de qualquer retorno de consulta via Model.
     * Evita exposição acidental de dados sensíveis nas respostas da API.
     */
    protected $hidden = [
        'password',
    ];

    /**
     * Campos que podem ser inseridos/atualizados via Model.
     * Exclui: id (PK), created_at/updated_at/deleted_at (timestamps).
     */
    protected $allowedFields = [
        'user',
        'password',
        'last_login',
    ];

    /**
     * Campos de texto que usam LIKE %valor% no find.
     */
    protected array $likeFields = [
        'user',
    ];

    /** Campos válidos para ordenação */
    protected array $sortableFields = [
        'id',
        'user',
        'last_login',
        'created_at',
        'updated_at',
    ];

    /** Campos utilizados na busca textual (GET /search) */
    public array $searchFields = [
        'user',
    ];

    // -------------------------------------------------------------------------
    // Verificações de unicidade
    // -------------------------------------------------------------------------

    /**
     * Verifica se já existe registro ativo com o username informado.
     *
     * @param string   $user      Username a verificar
     * @param int|null $excludeId ID a ignorar (usado no update)
     */
    public function existsByUser(string $user, ?int $excludeId = null): bool
    {
        $builder = $this->db->table($this->table)
            ->where('user', $user)
            ->where('deleted_at IS NULL', null, false);

        if ($excludeId !== null) {
            $builder->where('id !=', $excludeId);
        }

        return $builder->countAllResults() > 0;
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
