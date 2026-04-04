<?php
// Rotas REST para manipulação da tabela user_customer
$routes->post('find', 'Api\V1\UserCustomer\ResourceTableController::find');
$routes->post('get-grouped', 'Api\V1\UserCustomer\ResourceTableController::getGrouped');
$routes->get('search', 'Api\V1\UserCustomer\ResourceTableController::search');
$routes->get('get/(:num)', 'Api\V1\UserCustomer\ResourceTableController::get/$1');
$routes->get('get-all', 'Api\V1\UserCustomer\ResourceTableController::getAll');
$routes->get('get-no-pagination', 'Api\V1\UserCustomer\ResourceTableController::getNoPagination');
$routes->get('get-deleted/(:num)', 'Api\V1\UserCustomer\ResourceTableController::getDeleted/$1');
$routes->get('get-deleted-all', 'Api\V1\UserCustomer\ResourceTableController::getDeletedAll');
$routes->post('create', 'Api\V1\UserCustomer\ResourceTableController::create');
$routes->put('update/(:num)', 'Api\V1\UserCustomer\ResourceTableController::update/$1');
$routes->delete('delete-soft/(:num)', 'Api\V1\UserCustomer\ResourceTableController::deleteSoft/$1');
$routes->patch('delete-restore/(:num)', 'Api\V1\UserCustomer\ResourceTableController::deleteRestore/$1');
$routes->delete('delete-hard/(:num)', 'Api\V1\UserCustomer\ResourceTableController::deleteHard/$1');
$routes->delete('clear-deleted', 'Api\V1\UserCustomer\ResourceTableController::clearDeleted');
$routes->delete('clear-deleted/(:num)', 'Api\V1\UserCustomer\ResourceTableController::clearDeleted/$1');
