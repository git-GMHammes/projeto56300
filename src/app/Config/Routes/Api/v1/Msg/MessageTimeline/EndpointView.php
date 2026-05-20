<?php
// Rotas REST para consulta da view view_msg_timeline_feed
// {{www}}/index.php/api/v1/msg-timeline-view/find
$routes->post('find', 'Api\V1\Msg\MessageTimeline\ResourceViewController::find');
// {{www}}/index.php/api/v1/msg-timeline-view/get-grouped
$routes->post('get-grouped', 'Api\V1\Msg\MessageTimeline\ResourceViewController::getGrouped');
// {{www}}/index.php/api/v1/msg-timeline-view/search
$routes->get('search', 'Api\V1\Msg\MessageTimeline\ResourceViewController::search');
// {{www}}/index.php/api/v1/msg-timeline-view/get/{id}
$routes->get('get/(:num)', 'Api\V1\Msg\MessageTimeline\ResourceViewController::get/$1');
// {{www}}/index.php/api/v1/msg-timeline-view/get-all
$routes->get('get-all', 'Api\V1\Msg\MessageTimeline\ResourceViewController::getAll');
// {{www}}/index.php/api/v1/msg-timeline-view/get-no-pagination
$routes->get('get-no-pagination', 'Api\V1\Msg\MessageTimeline\ResourceViewController::getNoPagination');
// {{www}}/index.php/api/v1/msg-timeline-view/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\Msg\MessageTimeline\ResourceViewController::getDeleted/$1');
// {{www}}/index.php/api/v1/msg-timeline-view/get-all-with-deleted
$routes->get('get-all-with-deleted', 'Api\V1\Msg\MessageTimeline\ResourceViewController::getAllWithDeleted');
// {{www}}/index.php/api/v1/msg-timeline-view/get-deleted-all
$routes->get('get-deleted-all', 'Api\V1\Msg\MessageTimeline\ResourceViewController::getDeletedAll');
