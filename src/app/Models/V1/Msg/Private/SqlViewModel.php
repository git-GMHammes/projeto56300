<?php

namespace App\Models\V1\Private;

use App\Models\V1\BaseViewModel;

/**
 * Model de leitura para a view view_msg_private_inbox.
 *
 * Responsável exclusivamente por consultas (read-only).
 * A view une user_customer (uc) com user_management (um),
 * expondo os dados com prefixo uc_ para campos do cliente
 * e usando os timestamps de user_management.
 *
 * Campos disponíveis na view:
 * ...
 *
 * O campo deleted_at reflete user_management.deleted_at.
 *
 * Todos os métodos de leitura (findPaginatedView, findById, findDeletedById,
 * findDeletedPaginatedView, searchByTermView, findGroupedView, findAllView)
 * estão disponíveis via BaseViewModel.
 */
class SqlViewModel extends BaseViewModel
{
    protected $DBGroup = DB_GROUP_001;
    protected $table = 'view_msg_private_inbox';
    protected $primaryKey = 'id';

    /**
     * Campos de texto que usam LIKE %valor% no findPaginatedView.
     */
    protected array $likeFields = [
        // ...
    ];

    /** Campos válidos para ordenação */
    protected array $sortableFields = [
        // ...
    ];

    /** Campos utilizados na busca textual (GET /search) */
    public array $searchFields = [
        // ...
    ];
}
