<?php

/**
 * Class ResourceController
 *
 * Controlador do módulo UserManagement — camada HTTP pura.
 * Responsabilidades: validar Request, chamar o Manager, retornar ResponseInterface.
 * Zero lógica de negócio aqui — tudo delega ao Manager (Service Pattern).
 *
 * @package App\Controllers\Api\V1\UserManagement
 */

namespace App\Controllers\Api\V1\UserManagement;

use App\Controllers\Api\V1\BaseResourceController;
use App\Models\Api\V1\UserManagement\Table;
use App\Request\Api\V1\UserManagement\CreateRequest;
use App\Request\Api\V1\UserManagement\FindRequest;
use App\Request\Api\V1\UserManagement\GetGroupedRequest;
use App\Request\Api\V1\UserManagement\UpdateRequest;
use App\Service\Api\V1\UserManagement\Manager;
use CodeIgniter\HTTP\ResponseInterface;

class ResourceController extends BaseResourceController
{
    protected Manager $manager;

    public function __construct()
    {
        $this->manager = new Manager(new Table());
    }

    // =========================================================================
    // Leitura — registros ativos
    // =========================================================================

    /**
     * Busca paginada com filtros opcionais.
     * POST /api/v1/user-management/find?page=1&limit=20&sort=id&order=desc
     */
    public function find(): ResponseInterface
    {
        $request = new FindRequest();
        $validation = $this->validateRequest($request->rules(), $request->messages());

        if ($validation !== true) {
            return $this->validationErrorResponse($validation['errors']);
        }

        return $this->executeService(function () {
            $queryParams = $this->request->getGet();
            $bodyFilters = (array) $this->request->getJSON(true);

            $result = $this->manager->findPaginated($queryParams, $bodyFilters);

            return $this->successResponse($result);
        }, 'Erro ao realizar busca de usuários.');
    }

    /**
     * Busca agrupada por data de criação.
     * GET /api/v1/user-management/get-grouped?page=1&limit=20&sort=id&order=desc
     */
    public function getGrouped(): ResponseInterface
    {
        $request = new GetGroupedRequest();
        $validation = $this->validateRequest($request->rules(), $request->messages());

        if ($validation !== true) {
            return $this->validationErrorResponse($validation['errors']);
        }

        return $this->executeService(function () {
            $result = $this->manager->getGrouped($this->request->getGet());

            return $this->successResponse($result);
        }, 'Erro ao buscar usuários agrupados.');
    }

    /**
     * Busca usuário ativo por ID.
     * GET /api/v1/user-management/get/{id}
     */
    public function get($id): ResponseInterface
    {
        return $this->executeService(function () use ($id) {
            $user = $this->manager->getById((int) $id);

            if ($user === null) {
                return $this->notFoundResponse('Usuário não encontrado.');
            }

            return $this->successResponse($user);
        }, 'Erro ao buscar usuário.');
    }

    /**
     * Busca todos os usuários ativos com paginação.
     * GET /api/v1/user-management/get-all?page=1&limit=20&sort=id&order=desc
     */
    public function getAll(): ResponseInterface
    {
        return $this->executeService(function () {
            $result = $this->manager->getAllPaginated($this->request->getGet());

            return $this->successResponse($result);
        }, 'Erro ao buscar usuários.');
    }

    /**
     * Busca todos os usuários ativos sem paginação.
     * GET /api/v1/user-management/get-no-pagination?sort=id&order=desc
     */
    public function getNoPagination(): ResponseInterface
    {
        return $this->executeService(function () {
            $items = $this->manager->getAllNoPagination($this->request->getGet());

            return $this->successResponse($items);
        }, 'Erro ao buscar usuários.');
    }

    // =========================================================================
    // Leitura — registros soft-deletados
    // =========================================================================

    /**
     * Busca todos os usuários soft-deletados com paginação.
     * GET /api/v1/user-management/get-deleted-all?page=1&limit=20&sort=id&order=desc
     */
    public function getDeletedAll(): ResponseInterface
    {
        return $this->executeService(function () {
            $result = $this->manager->getDeletedAllPaginated($this->request->getGet());

            return $this->successResponse($result);
        }, 'Erro ao buscar usuários deletados.');
    }

    /**
     * Busca um usuário soft-deletado por ID.
     * GET /api/v1/user-management/get-deleted/{id}
     */
    public function getDeleted($id): ResponseInterface
    {
        return $this->executeService(function () use ($id) {
            $user = $this->manager->getDeletedById((int) $id);

            if ($user === null) {
                return $this->notFoundResponse('Usuário deletado não encontrado.');
            }

            return $this->successResponse($user);
        }, 'Erro ao buscar usuário deletado.');
    }

    // =========================================================================
    // Escrita
    // =========================================================================

    /**
     * Cria um novo usuário.
     * POST /api/v1/user-management/create
     */
    public function create(): ResponseInterface
    {
        $request = new CreateRequest();
        $validation = $this->validateRequest($request->rules(), $request->messages());

        if ($validation !== true) {
            return $this->validationErrorResponse($validation['errors']);
        }

        return $this->executeService(function () {
            $data = (array) $this->request->getJSON(true);
            $user = $this->manager->createUser($data);

            return $this->createdResponse($user);
        }, 'Erro ao criar usuário.');
    }

    /**
     * Atualiza um usuário existente.
     * PUT /api/v1/user-management/update/{id}
     */
    public function update($id = null): ResponseInterface
    {
        $request = new UpdateRequest();
        $validation = $this->validateRequest($request->rules((int) $id), $request->messages());

        if ($validation !== true) {
            return $this->validationErrorResponse($validation['errors']);
        }

        return $this->executeService(function () use ($id) {
            $data = (array) $this->request->getJSON(true);
            $user = $this->manager->updateUser((int) $id, $data);

            return $this->successResponse($user);
        }, 'Erro ao atualizar usuário.');
    }

    // =========================================================================
    // Exclusão
    // =========================================================================

    /**
     * Exclusão lógica (soft delete) — preenche deleted_at.
     * DELETE /api/v1/user-management/delete-soft/{id}
     */
    public function deleteSoft($id): ResponseInterface
    {
        return $this->executeService(function () use ($id) {
            $this->manager->softDelete((int) $id);

            return $this->successResponse(['message' => 'Usuário desativado com sucesso.', 'id' => (int) $id]);
        }, 'Erro ao desativar usuário.');
    }

    /**
     * Restaura um usuário soft-deletado — zera deleted_at.
     * PATCH /api/v1/user-management/delete-restore/{id}
     */
    public function deleteRestore($id): ResponseInterface
    {
        return $this->executeService(function () use ($id) {
            $this->manager->restoreDeleted((int) $id);

            return $this->successResponse(['message' => 'Usuário restaurado com sucesso.', 'id' => (int) $id]);
        }, 'Erro ao restaurar usuário.');
    }

    /**
     * Exclusão definitiva de um usuário ativo (hard delete).
     * DELETE /api/v1/user-management/delete-hard/{id}
     */
    public function deleteHard($id): ResponseInterface
    {
        return $this->executeService(function () use ($id) {
            $this->manager->hardDelete((int) $id);

            return $this->successResponse(['message' => 'Usuário removido permanentemente.', 'id' => (int) $id]);
        }, 'Erro ao remover usuário permanentemente.');
    }

    /**
     * Remove permanentemente TODOS os registros soft-deletados.
     * DELETE /api/v1/user-management/clear-deleted-all
     */
    public function clearDeletedAll(): ResponseInterface
    {
        return $this->executeService(function () {
            $count = $this->manager->clearAllDeleted();

            return $this->successResponse(['message' => "Total de {$count} registro(s) removido(s) permanentemente."]);
        }, 'Erro ao limpar registros deletados.');
    }

    /**
     * Remove permanentemente um registro soft-deletado pelo ID.
     * DELETE /api/v1/user-management/clear-deleted/{id}
     */
    public function clearDeleted($id): ResponseInterface
    {
        return $this->executeService(function () use ($id) {
            $this->manager->clearDeletedById((int) $id);

            return $this->successResponse(['message' => 'Registro deletado removido permanentemente.', 'id' => (int) $id]);
        }, 'Erro ao limpar registro deletado.');
    }
}
