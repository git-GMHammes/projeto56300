<?php
// Rotas REST para consulta da view view_msg_private_inbox
// {{www}}/index.php/api/v1/message-private-view/find
$routes->post('find', 'Api\V1\Msg\MessagePrivate\ResourceViewController::find');
// {{www}}/index.php/api/v1/message-private-view/get-grouped
$routes->post('get-grouped', 'Api\V1\Msg\MessagePrivate\ResourceViewController::getGrouped');
// {{www}}/index.php/api/v1/message-private-view/search
$routes->get('search', 'Api\V1\Msg\MessagePrivate\ResourceViewController::search');
// {{www}}/index.php/api/v1/message-private-view/get/{id}
$routes->get('get/(:num)', 'Api\V1\Msg\MessagePrivate\ResourceViewController::get/$1');
// {{www}}/index.php/api/v1/message-private-view/get-all
$routes->get('get-all', 'Api\V1\Msg\MessagePrivate\ResourceViewController::getAll');
// {{www}}/index.php/api/v1/message-private-view/get-no-pagination
$routes->get('get-no-pagination', 'Api\V1\Msg\MessagePrivate\ResourceViewController::getNoPagination');
// {{www}}/index.php/api/v1/message-private-view/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\Msg\MessagePrivate\ResourceViewController::getDeleted/$1');
// {{www}}/index.php/api/v1/message-private-view/get-all-with-deleted
$routes->get('get-all-with-deleted', 'Api\V1\Msg\MessagePrivate\ResourceViewController::getAllWithDeleted');
// {{www}}/index.php/api/v1/message-private-view/get-deleted-all
$routes->get('get-deleted-all', 'Api\V1\Msg\MessagePrivate\ResourceViewController::getDeletedAll');
