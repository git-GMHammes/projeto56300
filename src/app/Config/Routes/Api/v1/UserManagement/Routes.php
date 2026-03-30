<?php

// Rotas do módulo User Management (v1)
// Todas as rotas seguem o padrão: /api/v1/user-management/...

use CodeIgniter\Router\RouteCollection;

/** @var RouteCollection $routes */

$routes->group('api/v1/user-management', ['namespace' => 'App\Controllers\Api\V1\UserManagement'], function ($routes) {
    // Busca paginada com filtros (POST /find?page=1&limit=20&sort=id&order=desc)
    $routes->post('find', 'ResourceController::find');
    // Busca agrupada por data de criação
    $routes->get('get-grouped', 'ResourceController::getGrouped');
    // Buscar usuário por ID
    $routes->get('get/(:num)', 'ResourceController::get/$1');
    // Buscar todos com paginação
    $routes->get('get-all', 'ResourceController::getAll');
    // Buscar todos sem paginação
    $routes->get('get-no-pagination', 'ResourceController::getNoPagination');
    // Buscar todos deletados com paginação
    $routes->get('get-deleted-all', 'ResourceController::getDeletedAll');
    // Buscar deletado por ID
    $routes->get('get-deleted/(:num)', 'ResourceController::getDeleted/$1');
    // Criar novo usuário
    $routes->post('create', 'ResourceController::create');
    // Atualizar usuário
    $routes->put('update/(:num)', 'ResourceController::update/$1');
    // Exclusão lógica (soft delete)
    $routes->delete('delete-soft/(:num)', 'ResourceController::deleteSoft/$1');
    // Restaurar usuário deletado
    $routes->patch('delete-restore/(:num)', 'ResourceController::deleteRestore/$1');
    // Exclusão definitiva (hard delete)
    $routes->delete('delete-hard/(:num)', 'ResourceController::deleteHard/$1');
    // Limpar todos os registros soft-deletados permanentemente
    $routes->delete('clear-deleted-all', 'ResourceController::clearDeletedAll');
    // Limpar registro soft-deletado por ID permanentemente
    $routes->delete('clear-deleted/(:num)', 'ResourceController::clearDeleted/$1');
});
