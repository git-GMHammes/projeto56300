<?php
// Rotas REST para consulta da view vehicle_brand_view
// {{www}}/index.php/api/v1/vehicle-brand-view/find
$routes->post('find', 'Api\V1\VehicleBrand\ResourceViewController::find');
// {{www}}/index.php/api/v1/vehicle-brand-view/get-grouped
$routes->post('get-grouped', 'Api\V1\VehicleBrand\ResourceViewController::getGrouped');
// {{www}}/index.php/api/v1/vehicle-brand-view/search
$routes->get('search', 'Api\V1\VehicleBrand\ResourceViewController::search');
// {{www}}/index.php/api/v1/vehicle-brand-view/get/{id}
$routes->get('get/(:num)', 'Api\V1\VehicleBrand\ResourceViewController::get/$1');
// {{www}}/index.php/api/v1/vehicle-brand-view/get-all
$routes->get('get-all', 'Api\V1\VehicleBrand\ResourceViewController::getAll');
// {{www}}/index.php/api/v1/vehicle-brand-view/get-no-pagination
$routes->get('get-no-pagination', 'Api\V1\VehicleBrand\ResourceViewController::getNoPagination');
// {{www}}/index.php/api/v1/vehicle-brand-view/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\VehicleBrand\ResourceViewController::getDeleted/$1');
// {{www}}/index.php/api/v1/vehicle-brand-view/get-deleted-all
$routes->get('get-deleted-all', 'Api\V1\VehicleBrand\ResourceViewController::getDeletedAll');
