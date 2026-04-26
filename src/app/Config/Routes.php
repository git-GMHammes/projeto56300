<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

$routes->group('api/v1', function ($routes) {

    // =========================================================================
    // /User — Módulo de usuários e autenticação
    // =========================================================================

    $routes->group('auth', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/User/AuthUser/EndPointView.php';
    });

    $routes->group('user-management', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/User/UserManagement/EndpointTable.php';
    });

    $routes->group('user-customer', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/User/UserCustomer/EndpointTable.php';
    });

    $routes->group('user-customer-view', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/User/UserCustomer/EndPointView.php';
    });

    $routes->group('user-password-resets', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/User/UserPasswordResets/EndpointTable.php';
    });

    // =========================================================================
    // /Mec — Módulo mecânico / veículos
    // =========================================================================

    $routes->group('vehicle-brand', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/Mec/VehicleBrand/EndpointTable.php';
    });

    $routes->group('vehicle-brand-view', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/Mec/VehicleBrand/EndPointView.php';
    });

    // =========================================================================
    // /Msg — Módulo de mensagens (prefixo plano msg-* no nível api/v1)
    // =========================================================================

    // Timeline — mural de posts públicos
    $routes->group('msg-timeline', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/Msg/MessageTimeline/EndpointTable.php';
    });
    $routes->group('msg-timeline-view', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/Msg/MessageTimeline/EndpointView.php';
    });

    // Timeline Reaction — reações aos posts
    $routes->group('msg-timeline-reaction', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/Msg/MessageTimelineReaction/EndpointTable.php';
    });

    // Private — mensagens diretas
    $routes->group('msg-private', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/Msg/MessagePrivate/EndpointTable.php';
    });
    $routes->group('msg-private-view', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/Msg/MessagePrivate/EndpointView.php';
    });

    // Group — grupos de chat
    $routes->group('msg-group', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/Msg/MsgGroup/EndpointTable.php';
    });
    $routes->group('msg-group-view', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/Msg/MsgGroup/EndpointView.php';
    });

    // Group Member — membros dos grupos
    $routes->group('msg-group-member', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/Msg/MessageGroupMember/EndpointTable.php';
    });

    // Group Message — mensagens de grupo
    $routes->group('message-group', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/Msg/MessageGroup/EndpointTable.php';
    });

    // Group Read — ponteiro de leitura
    $routes->group('msg-group-read', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/Msg/MessageGroupRead/EndpointTable.php';
    });

    // Msg File — anexos multimídia
    $routes->group('msg-file', function ($routes) {
        require __DIR__ . '/Routes/Api/v1/Msg/MessageFile/EndpointTable.php';
    });
});
