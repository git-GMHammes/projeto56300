<?php
// Rotas REST para consulta da view user_customer_view
// {{www}}/index.php/api/v1/user-customer-view/find
$routes->post('find', 'Api\V1\UserCustomer\ResourceViewController::find');
// {{www}}/index.php/api/v1/user-customer-view/get-grouped
$routes->post('get-grouped', 'Api\V1\UserCustomer\ResourceViewController::getGrouped');
// {{www}}/index.php/api/v1/user-customer-view/search
$routes->get('search', 'Api\V1\UserCustomer\ResourceViewController::search');
// {{www}}/index.php/api/v1/user-customer-view/get/{id}
$routes->get('get/(:num)', 'Api\V1\UserCustomer\ResourceViewController::get/$1');
// {{www}}/index.php/api/v1/user-customer-view/get-all
$routes->get('get-all', 'Api\V1\UserCustomer\ResourceViewController::getAll');
// {{www}}/index.php/api/v1/user-customer-view/get-no-pagination
$routes->get('get-no-pagination', 'Api\V1\UserCustomer\ResourceViewController::getNoPagination');
// {{www}}/index.php/api/v1/user-customer-view/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\UserCustomer\ResourceViewController::getDeleted/$1');
// {{www}}/index.php/api/v1/user-customer-view/get-deleted-all
$routes->get('get-deleted-all', 'Api\V1\UserCustomer\ResourceViewController::getDeletedAll');
