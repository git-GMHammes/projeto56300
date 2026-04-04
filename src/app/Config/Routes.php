<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// Rotas agrupadas por versão e módulo (profissional, escalável)
$routes->group('api/v1', function($routes) {
	// Rotas de autenticação (login e consultas da view auth)
	$routes->group('auth', function($routes) {
		require __DIR__ . '/Routes/Api/v1/AuthUser/EndPointView.php';
	});

	// Rotas para manipulação direta da tabela user_customer
	$routes->group('user-management', function($routes) {
		require __DIR__ . '/Routes/Api/v1/UserManagement/EndpointTable.php';
	});

	// Rotas para manipulação direta da tabela user_customer
	$routes->group('user-customer', function($routes) {
		require __DIR__ . '/Routes/Api/v1/UserCustomer/EndpointTable.php';
	});

	// Rotas para consulta através da View user_customer_view
	$routes->group('user-customer-view', function($routes) {
		require __DIR__ . '/Routes/Api/v1/UserCustomer/EndPointView.php';
	});
});
