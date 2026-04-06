<?php
// Rotas de autenticação
// {{www}}/index.php/api/v1/auth/login
$routes->post('login',            'Api\V1\AuthUser\ResourceViewController::login');
// {{www}}/index.php/api/v1/auth/logout
$routes->post('logout',           'Api\V1\AuthUser\ResourceViewController::logout');
// {{www}}/index.php/api/v1/auth/recover-password
$routes->post('recover-password', 'Api\V1\AuthUser\ResourceViewController::recoverPassword');

// Rotas REST para consulta da view user_customer_view
// {{www}}/index.php/api/v1/auth/find
$routes->post('find', 'Api\V1\AuthUser\ResourceViewController::find');
// {{www}}/index.php/api/v1/auth/get-grouped
$routes->post('get-grouped', 'Api\V1\AuthUser\ResourceViewController::getGrouped');
// {{www}}/index.php/api/v1/auth/search
$routes->get('search', 'Api\V1\AuthUser\ResourceViewController::search');
// {{www}}/index.php/api/v1/auth/get/{id}
$routes->get('get/(:num)', 'Api\V1\AuthUser\ResourceViewController::get/$1');
// {{www}}/index.php/api/v1/auth/get-all
$routes->get('get-all', 'Api\V1\AuthUser\ResourceViewController::getAll');
// {{www}}/index.php/api/v1/auth/get-no-pagination
$routes->get('get-no-pagination', 'Api\V1\AuthUser\ResourceViewController::getNoPagination');
// {{www}}/index.php/api/v1/auth/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\AuthUser\ResourceViewController::getDeleted/$1');
// {{www}}/index.php/api/v1/auth/get-deleted-all
$routes->get('get-deleted-all', 'Api\V1\AuthUser\ResourceViewController::getDeletedAll');
