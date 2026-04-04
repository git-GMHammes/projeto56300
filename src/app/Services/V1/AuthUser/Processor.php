<?php

namespace App\Services\V1\AuthUser;

use App\Libraries\JwtHelper;
use App\Models\V1\AuthUser\SqlViewModel;
use App\Services\V1\BaseService;

/**
 * Service de autenticação do módulo AuthUser.
 *
 * Contém TODAS as regras de negócio de autenticação:
 *   - Consulta do usuário via Model
 *   - Verificação da senha com password_verify
 *   - Geração do token JWT
 *   - Montagem do payload de resposta
 *
 * Nunca acessa Request nem Response diretamente.
 */
class Processor extends BaseService
{
    protected SqlViewModel $viewModel;

    public function __construct()
    {
        $this->viewModel = new SqlViewModel();
    }

    // -------------------------------------------------------------------------
    // Autenticação
    // -------------------------------------------------------------------------

    /**
     * Autentica o usuário pelo campo user e password.
     *
     * Fluxo:
     *   1. Buscar usuário ativo pelo campo um_user na view
     *   2. Verificar senha com password_verify
     *   3. Gerar token JWT com payload (sub, cpf, iat, exp)
     *   4. Retornar token e dados do usuário
     *
     * @param  string $user     Identificador do usuário (campo um_user)
     * @param  string $password Senha em texto plano para verificação
     * @return array            Dados de autenticação (token, token_type, expires_in, user)
     *
     * @throws \InvalidArgumentException Se usuário não encontrado ou senha inválida
     */
    public function authenticate(string $user, string $password): array
    {
        // Sanitizar entrada
        $user = $this->sanitizeString($user);

        // Buscar usuário na view pelo campo um_user
        $record = $this->viewModel->findByUser($user);

        if ($record === null) {
            throw new \InvalidArgumentException('Credenciais inválidas');
        }

        // Verificar senha com password_verify
        if (!password_verify($password, $record['um_password'])) {
            throw new \InvalidArgumentException('Credenciais inválidas');
        }

        // Montar payload JWT
        $ttl     = 36000;
        $payload = [
            'sub' => $record['uc_user_id'],
            'cpf' => $record['uc_cpf'],
        ];

        // Gerar token JWT (iat e exp são adicionados internamente pelo JwtHelper)
        $token = JwtHelper::encode($payload, $ttl);

        // Dados do usuário retornados na resposta (sem senha)
        $userData = $record;
        unset($userData['um_password']);

        return [
            'token'      => $token,
            'token_type' => 'Bearer',
            'expires_in' => $ttl,
            'user'       => $userData,
        ];
    }

    // -------------------------------------------------------------------------
    // Recuperação de senha
    // -------------------------------------------------------------------------

    /**
     * Verifica se o e-mail existe na view e envia e-mail de recuperação de senha.
     *
     * Fluxo:
     *   1. Buscar usuário ativo pelo campo uc_mail na view
     *   2. Lançar exceção se não encontrado
     *   3. Montar template HTML genérico de teste
     *   4. Enviar via SMTP usando o remetente de recuperação
     *
     * @param  string $mail E-mail informado pelo usuário (campo uc_mail)
     * @return array        Confirmação do envio com dados do destinatário
     *
     * @throws \InvalidArgumentException Se o e-mail não existir na base
     * @throws \RuntimeException         Se o envio falhar
     */
    public function sendRecoveryEmail(string $mail): array
    {
        // Sanitizar entrada
        $mail = $this->sanitizeString($mail);

        // Buscar usuário na view pelo campo uc_mail
        $record = $this->viewModel->findByMail($mail);

        if ($record === null) {
            throw new \InvalidArgumentException('E-mail não encontrado');
        }

        // Carregar configurações de e-mail
        $emailConfig = config('Email');
        $recovery    = $emailConfig->recoveryEmail;

        // Montar template HTML genérico de teste
        $name    = $record['uc_name'] ?? 'Usuário';
        $subject = 'Recuperação de Senha - Sistema Habilidade';
        $body    = '<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Recuperação de Senha</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f4; padding: 30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color: #2c3e50; padding: 24px 32px;">
              <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Sistema Habilidade</h1>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px;">
              <h2 style="color: #2c3e50; margin-top: 0;">Recuperação de Senha</h2>
              <p style="color: #555555; font-size: 15px;">Olá, <strong>' . htmlspecialchars($name) . '</strong>!</p>
              <p style="color: #555555; font-size: 15px;">
                Recebemos uma solicitação de recuperação de senha para o e-mail
                <strong>' . htmlspecialchars($mail) . '</strong>.
              </p>
              <p style="color: #555555; font-size: 15px;">
                Este é um e-mail de teste. Em produção, aqui estará o link para redefinição de senha.
              </p>
              <table cellpadding="0" cellspacing="0" style="margin: 24px 0;">
                <tr>
                  <td style="background-color: #2c3e50; border-radius: 4px; padding: 12px 24px;">
                    <a href="#" style="color: #ffffff; text-decoration: none; font-size: 15px; font-weight: bold;">
                      Redefinir Senha
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color: #999999; font-size: 13px;">
                Se você não solicitou a recuperação de senha, ignore este e-mail.
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f9f9f9; padding: 16px 32px; border-top: 1px solid #eeeeee;">
              <p style="color: #aaaaaa; font-size: 12px; margin: 0;">
                Sistema Habilidade &mdash; E-mail gerado automaticamente, não responda.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>';

        // Configurar e enviar e-mail com remetente de recuperação
        $email = \Config\Services::email();
        $email->initialize([
            'SMTPUser' => $recovery['SMTPUser'],
            'SMTPPass' => $recovery['SMTPPass'],
        ]);
        $email->setFrom($recovery['email'], $recovery['name']);
        $email->setTo($mail);
        $email->setSubject($subject);
        $email->setMessage($body);

        if (!$email->send()) {
            throw new \RuntimeException('Falha ao enviar o e-mail de recuperação: ' . $email->printDebugger(['headers']));
        }

        return [
            'uc_mail' => $mail,
            'uc_name' => $name,
        ];
    }

    // -------------------------------------------------------------------------
    // Logout
    // -------------------------------------------------------------------------

    /**
     * Valida o token JWT e retorna os dados de identificação do usuário.
     *
     * Como o JWT é stateless (sem blacklist), o logout é do lado do cliente.
     * O servidor apenas confirma que o token era válido no momento do logout.
     *
     * @param  string $token Token JWT recebido no header Authorization
     * @return array         Dados de identificação (sub, exp)
     *
     * @throws \InvalidArgumentException Se o token for inválido ou expirado
     */
    public function logout(string $token): array
    {
        try {
            $payload = JwtHelper::decode($token);
        } catch (\RuntimeException $e) {
            throw new \InvalidArgumentException($e->getMessage());
        }

        // Revogar o token: gravar no cache até o momento de expiração original
        $ttl = max(0, ($payload['exp'] ?? 0) - time());
        if ($ttl > 0) {
            cache()->save('jwt_revoked_' . hash('sha256', $token), true, $ttl);
        }

        return [
            'user_id' => $payload['sub'] ?? null,
        ];
    }
}
