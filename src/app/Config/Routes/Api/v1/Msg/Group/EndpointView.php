<?php
// Rotas REST para consulta da view view_msg_group_summary
// {{www}}/index.php/api/v1/msg/group-view/find
$routes->post('find', 'Api\V1\Msg\Group\ResourceViewController::find');
// {{www}}/index.php/api/v1/msg/group-view/get-grouped
$routes->post('get-grouped', 'Api\V1\Msg\Group\ResourceViewController::getGrouped');
// {{www}}/index.php/api/v1/msg/group-view/search
$routes->get('search', 'Api\V1\Msg\Group\ResourceViewController::search');
// {{www}}/index.php/api/v1/msg/group-view/get/{id}
$routes->get('get/(:num)', 'Api\V1\Msg\Group\ResourceViewController::get/$1');
// {{www}}/index.php/api/v1/msg/group-view/get-all
$routes->get('get-all', 'Api\V1\Msg\Group\ResourceViewController::getAll');
// {{www}}/index.php/api/v1/msg/group-view/get-no-pagination
$routes->get('get-no-pagination', 'Api\V1\Msg\Group\ResourceViewController::getNoPagination');
// {{www}}/index.php/api/v1/msg/group-view/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\Msg\Group\ResourceViewController::getDeleted/$1');
// {{www}}/index.php/api/v1/msg/group-view/get-deleted-all
$routes->get('get-deleted-all', 'Api\V1\Msg\Group\ResourceViewController::getDeletedAll');
