<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// Inclusão das rotas do módulo User Management v1
require_once __DIR__ . '/Routes/Api/V1/UserManagement/Routes.php';
