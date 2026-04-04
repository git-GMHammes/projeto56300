<?php
// Rotas de autenticação
$routes->post('login',            'Api\V1\AuthUser\ResourceViewController::login');
$routes->post('logout',           'Api\V1\AuthUser\ResourceViewController::logout');
$routes->post('recover-password', 'Api\V1\AuthUser\ResourceViewController::recoverPassword');

// Rotas REST para consulta da view user_customer_view
$routes->post('find', 'Api\V1\AuthUser\ResourceViewController::find');
$routes->post('get-grouped', 'Api\V1\AuthUser\ResourceViewController::getGrouped');
$routes->get('search', 'Api\V1\AuthUser\ResourceViewController::search');
$routes->get('get/(:num)', 'Api\V1\AuthUser\ResourceViewController::get/$1');
$routes->get('get-all', 'Api\V1\AuthUser\ResourceViewController::getAll');
$routes->get('get-no-pagination', 'Api\V1\AuthUser\ResourceViewController::getNoPagination');
$routes->get('get-deleted/(:num)', 'Api\V1\AuthUser\ResourceViewController::getDeleted/$1');
$routes->get('get-deleted-all', 'Api\V1\AuthUser\ResourceViewController::getDeletedAll');
