<?php
// -------------------------------------------------------------------------
// Rotas de autenticação
// -------------------------------------------------------------------------

// POST {{www}}/index.php/api/v1/auth/login
$routes->post('login',           'Api\V1\AuthUser\ResourceViewController::login');
// POST {{www}}/index.php/api/v1/auth/logout
$routes->post('logout',          'Api\V1\AuthUser\ResourceViewController::logout');

// -------------------------------------------------------------------------
// Fluxo de reset de senha (3 passos)
// -------------------------------------------------------------------------

// Passo 1 — Solicita reset: verifica e-mail, gera token, envia e-mail
// POST {{www}}/index.php/api/v1/auth/recover-password
// Body: { "uc_mail": "usuario@email.com" }
$routes->post('recover-password', 'Api\V1\AuthUser\ResourceViewController::recoverPassword');

// Passo 2 — Valida o token antes de exibir o formulário de nova senha
// GET {{www}}/index.php/api/v1/auth/reset-password/{token}
// Retorna: { id, user_id, expires_at } ou 422 se inválido/expirado
$routes->get('reset-password/(:segment)', 'Api\V1\AuthUser\ResourceViewController::validateResetToken/$1');

// Passo 3 — Aplica a nova senha e invalida o token
// POST {{www}}/index.php/api/v1/auth/reset-password
// Body: { "token": "<64 hex chars>", "password": "...", "password_confirm": "..." }
$routes->post('reset-password',  'Api\V1\AuthUser\ResourceViewController::resetPassword');

// -------------------------------------------------------------------------
// Rotas REST para consulta da view view_auth_user
// -------------------------------------------------------------------------

// POST {{www}}/index.php/api/v1/auth/find
$routes->post('find',              'Api\V1\AuthUser\ResourceViewController::find');
// POST {{www}}/index.php/api/v1/auth/get-grouped
$routes->post('get-grouped',       'Api\V1\AuthUser\ResourceViewController::getGrouped');
// GET {{www}}/index.php/api/v1/auth/search
$routes->get('search',             'Api\V1\AuthUser\ResourceViewController::search');
// GET {{www}}/index.php/api/v1/auth/get/{id}
$routes->get('get/(:num)',         'Api\V1\AuthUser\ResourceViewController::get/$1');
// GET {{www}}/index.php/api/v1/auth/get-all
$routes->get('get-all',            'Api\V1\AuthUser\ResourceViewController::getAll');
// GET {{www}}/index.php/api/v1/auth/get-no-pagination
$routes->get('get-no-pagination',  'Api\V1\AuthUser\ResourceViewController::getNoPagination');
// GET {{www}}/index.php/api/v1/auth/get-deleted/{id}
$routes->get('get-deleted/(:num)', 'Api\V1\AuthUser\ResourceViewController::getDeleted/$1');
// GET {{www}}/index.php/api/v1/auth/get-deleted-all
$routes->get('get-deleted-all',    'Api\V1\AuthUser\ResourceViewController::getDeletedAll');
