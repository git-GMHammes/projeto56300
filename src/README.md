# SaaS - API REST Multi-tenant com Frontend Multi-plataforma

## Contexto

Sistema para cadastro e controle de diárias e solicitações para pagamento.

## Tecnologias

| Componente        | Tecnologia                                                           |
| ----------------- | -------------------------------------------------------------------- |
| **Backend**       | Codeigniter 7 (Lógica de negócio e API)                              |
| **Frontend**      | Templates CakePHP 5 + JavaScript (pastas: `service`, `core`, `page`) |
| **Estilo/Layout** | Bootstrap 5                                                          |
| **Tabelas**       | DataTables.min                                                       |

---

## Comportamento do Assistente

### Permissões

- **Leitura:** Você tem permissão para ler e analisar qualquer arquivo do projeto.
- **Análise:** Analise com calma e atenção antes de responder.

### Qualidade

- **Caminhos alterados:** Sempre exiba o caminho completo de todos os arquivos que serão alterados.
- **Dependências:** Se algo depender de arquivo ou pasta externa, informe os caminhos.
- **Análise global:** Análises globais somente se imprescindível para a tarefa.

### Limites

- **Escopo:** Siga exatamente o solicitado. Para fazer algo além, pergunte antes.
- **Autorização:** Antes de executar alterações, apresente o plano e aguarde aprovação.

---

## Padrões Técnicos

### Nomenclatura de Módulos

| Padrão       | Exemplo          |
| ------------ | ---------------- |
| `kebab-case` | `nome-do-modulo` |
| `PascalCase` | `NomeDoModulo`   |
| `snake_case` | `nome_do_modulo` |

> ⚠️ **Aviso:** Respeite o formato correto conforme o contexto de uso.

---

### Rotas da API

**Base:** `/api/v1/{modulo}`

| Método   | Endpoint                                              |
| -------- | ----------------------------------------------------- |
| `POST`   | `/find?page=1&limit=20&sort=id&order=desc`            |
| `POST`   | `/get-grouped?page=1&limit=20&sort=id&order=desc`     |
| `GET`    | `/get/{id}`                                           |
| `GET`    | `/get-all?page=1&limit=20&sort=id&order=desc`         |
| `GET`    | `/get-no-pagination?sort=id&order=desc`               |
| `GET`    | `/get-deleted/{id}`                                   |
| `GET`    | `/get-deleted-all?page=1&limit=20&sort=id&order=desc` |
| `POST`   | `/create`                                             |
| `PUT`    | `/update/{id}`                                        |
| `DELETE` | `/delete-soft/{id}`                                   |
| `PATCH`  | `/delete-restore/{id}`                                |
| `DELETE` | `/delete-hard/{id}`                                   |
| `DELETE` | `/clear-deleted`                                      |
| `DELETE` | `/clear-deleted/{id}`                                 |

# CodeIgniter 4 Framework

## What is CodeIgniter?

CodeIgniter is a PHP full-stack web framework that is light, fast, flexible and secure.
More information can be found at the [official site](https://codeigniter.com).

This repository holds the distributable version of the framework.
It has been built from the
[development repository](https://github.com/codeigniter4/CodeIgniter4).

More information about the plans for version 4 can be found in [CodeIgniter 4](https://forum.codeigniter.com/forumdisplay.php?fid=28) on the forums.

You can read the [user guide](https://codeigniter.com/user_guide/)
corresponding to the latest version of the framework.

## Important Change with index.php

`index.php` is no longer in the root of the project! It has been moved inside the _public_ folder,
for better security and separation of components.

This means that you should configure your web server to "point" to your project's _public_ folder, and
not to the project root. A better practice would be to configure a virtual host to point there. A poor practice would be to point your web server to the project root and expect to enter _public/..._, as the rest of your logic and the
framework are exposed.

**Please** read the user guide for a better explanation of how CI4 works!

## Repository Management

We use GitHub issues, in our main repository, to track **BUGS** and to track approved **DEVELOPMENT** work packages.
We use our [forum](http://forum.codeigniter.com) to provide SUPPORT and to discuss
FEATURE REQUESTS.

This repository is a "distribution" one, built by our release preparation script.
Problems with it can be raised on our forum, or as issues in the main repository.

## Contributing

We welcome contributions from the community.

Please read the [_Contributing to CodeIgniter_](https://github.com/codeigniter4/CodeIgniter4/blob/develop/CONTRIBUTING.md) section in the development repository.

## Server Requirements

PHP version 8.2 or higher is required, with the following extensions installed:

- [intl](http://php.net/manual/en/intl.requirements.php)
- [mbstring](http://php.net/manual/en/mbstring.installation.php)

> [!WARNING]
>
> - The end of life date for PHP 7.4 was November 28, 2022.
> - The end of life date for PHP 8.0 was November 26, 2023.
> - The end of life date for PHP 8.1 was December 31, 2025.
> - If you are still using below PHP 8.2, you should upgrade immediately.
> - The end of life date for PHP 8.2 will be December 31, 2026.

Additionally, make sure that the following extensions are enabled in your PHP:

- json (enabled by default - don't turn it off)
- [mysqlnd](http://php.net/manual/en/mysqlnd.install.php) if you plan to use MySQL
- [libcurl](http://php.net/manual/en/curl.requirements.php) if you plan to use the HTTP\CURLRequest library
