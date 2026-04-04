<?php
// Rotas REST para consulta da view user_customer_view
$routes->post('find', 'Api\V1\UserCustomer\ResourceViewController::find');
$routes->post('get-grouped', 'Api\V1\UserCustomer\ResourceViewController::getGrouped');
$routes->get('search', 'Api\V1\UserCustomer\ResourceViewController::search');
$routes->get('get/(:num)', 'Api\V1\UserCustomer\ResourceViewController::get/$1');
$routes->get('get-all', 'Api\V1\UserCustomer\ResourceViewController::getAll');
$routes->get('get-no-pagination', 'Api\V1\UserCustomer\ResourceViewController::getNoPagination');
$routes->get('get-deleted/(:num)', 'Api\V1\UserCustomer\ResourceViewController::getDeleted/$1');
$routes->get('get-deleted-all', 'Api\V1\UserCustomer\ResourceViewController::getDeletedAll');
