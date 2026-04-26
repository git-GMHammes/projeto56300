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
    // /Msg — Módulo de mensagens
    // =========================================================================

    $routes->group('msg', function ($routes) {

        // Timeline — mural de posts públicos
        $routes->group('timeline', function ($routes) {
            require __DIR__ . '/Routes/Api/v1/Msg/Timeline/EndpointTable.php';
        });
        $routes->group('timeline-view', function ($routes) {
            require __DIR__ . '/Routes/Api/v1/Msg/Timeline/EndpointView.php';
        });

        // Timeline Reaction — reações aos posts
        $routes->group('timeline-reaction', function ($routes) {
            require __DIR__ . '/Routes/Api/v1/Msg/TimelineReaction/EndpointTable.php';
        });

        // Private — mensagens diretas
        $routes->group('private', function ($routes) {
            require __DIR__ . '/Routes/Api/v1/Msg/Private/EndpointTable.php';
        });
        $routes->group('private-view', function ($routes) {
            require __DIR__ . '/Routes/Api/v1/Msg/Private/EndpointView.php';
        });

        // Group — grupos de chat
        $routes->group('group', function ($routes) {
            require __DIR__ . '/Routes/Api/v1/Msg/Group/EndpointTable.php';
        });
        $routes->group('group-view', function ($routes) {
            require __DIR__ . '/Routes/Api/v1/Msg/Group/EndpointView.php';
        });

        // Group Member — membros dos grupos
        $routes->group('group-member', function ($routes) {
            require __DIR__ . '/Routes/Api/v1/Msg/GroupMember/EndpointTable.php';
        });

        // Group Message — mensagens de grupo
        $routes->group('group-message', function ($routes) {
            require __DIR__ . '/Routes/Api/v1/Msg/GroupMessage/EndpointTable.php';
        });

        // Group Read — ponteiro de leitura
        $routes->group('group-read', function ($routes) {
            require __DIR__ . '/Routes/Api/v1/Msg/GroupRead/EndpointTable.php';
        });

        // Msg File — anexos multimídia
        $routes->group('msg-file', function ($routes) {
            require __DIR__ . '/Routes/Api/v1/Msg/MsgFile/EndpointTable.php';
        });
    });
});
