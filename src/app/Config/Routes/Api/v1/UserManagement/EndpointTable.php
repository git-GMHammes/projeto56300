<?php
// Rotas REST para manipulação da tabela user_customer
$routes->post('find', 'Api\V1\UserManagement\ResourceTableController::find');
$routes->post('get-grouped', 'Api\V1\UserManagement\ResourceTableController::getGrouped');
$routes->get('search', 'Api\V1\UserManagement\ResourceTableController::search');
$routes->get('get/(:num)', 'Api\V1\UserManagement\ResourceTableController::get/$1');
$routes->get('get-all', 'Api\V1\UserManagement\ResourceTableController::getAll');
$routes->get('get-no-pagination', 'Api\V1\UserManagement\ResourceTableController::getNoPagination');
$routes->get('get-deleted/(:num)', 'Api\V1\UserManagement\ResourceTableController::getDeleted/$1');
$routes->get('get-deleted-all', 'Api\V1\UserManagement\ResourceTableController::getDeletedAll');
$routes->post('create', 'Api\V1\UserManagement\ResourceTableController::create');
$routes->put('update/(:num)', 'Api\V1\UserManagement\ResourceTableController::update/$1');
$routes->delete('delete-soft/(:num)', 'Api\V1\UserManagement\ResourceTableController::deleteSoft/$1');
$routes->patch('delete-restore/(:num)', 'Api\V1\UserManagement\ResourceTableController::deleteRestore/$1');
$routes->delete('delete-hard/(:num)', 'Api\V1\UserManagement\ResourceTableController::deleteHard/$1');
$routes->delete('clear-deleted', 'Api\V1\UserManagement\ResourceTableController::clearDeleted');
$routes->delete('clear-deleted/(:num)', 'Api\V1\UserManagement\ResourceTableController::clearDeleted/$1');
