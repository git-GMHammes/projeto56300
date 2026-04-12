<?php

namespace App\Services\V1\AuthUser;

use App\Libraries\JwtHelper;
use App\Models\V1\AuthUser\SqlViewModel;
use App\Services\V1\BaseViewService;

/**
 * Service de autenticação do módulo AuthUser.
 *
 * Contém todas as regras de negócio de autenticação:
 *   - Consulta do usuário via Model
 *   - Verificação de senha com password_verify
 *   - Geração e revogação de token JWT
 *   - Envio de e-mail de recuperação de senha via view
 *
 * Nunca acessa Request nem Response diretamente.
 */
class Processor extends BaseViewService
{
    /** Tempo de vida do token JWT em segundos (10 horas). */
    private const JWT_TTL = 36000;

    /** View do template de e-mail de recuperação de senha. */
    private const EMAIL_VIEW_RECOVERY = 'emails/recovery_password';

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
     *   1. Sanitizar entrada
     *   2. Buscar usuário ativo pelo campo um_user na view
     *   3. Verificar senha com password_verify
     *   4. Gerar token JWT com payload (sub, cpf, iat, exp)
     *   5. Retornar token e dados do usuário (sem senha)
     *
     * @param  string $user     Identificador do usuário (campo um_user)
     * @param  string $password Senha em texto plano para verificação
     * @return array            Dados de autenticação (token, token_type, expires_in, user)
     *
     * @throws \InvalidArgumentException Se usuário não encontrado ou senha inválida
     */
    public function authenticate(string $user, string $password): array
    {
        $user   = $this->sanitizeString($user);
        $record = $this->viewModel->findByUser($user);

        if ($record === null || !password_verify($password, $record['um_password'])) {
            throw new \InvalidArgumentException('Credenciais inválidas');
        }

        $payload = [
            'sub' => $record['uc_user_id'],
            'cpf' => $record['uc_cpf'],
        ];

        $token    = JwtHelper::encode($payload, self::JWT_TTL);
        $userData = $record;
        unset($userData['um_password']);

        return [
            'token'      => $token,
            'token_type' => 'Bearer',
            'expires_in' => self::JWT_TTL,
            'user'       => $userData,
        ];
    }

    // -------------------------------------------------------------------------
    // Recuperação de senha
    // -------------------------------------------------------------------------

    /**
     * Verifica se o e-mail existe na view e envia o e-mail de recuperação.
     *
     * Fluxo:
     *   1. Sanitizar entrada
     *   2. Buscar usuário ativo pelo campo uc_mail na view
     *   3. Renderizar template HTML via view()
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
        $mail   = $this->sanitizeString($mail);
        $record = $this->viewModel->findByMail($mail);

        if ($record === null) {
            throw new \InvalidArgumentException('E-mail não encontrado');
        }

        $name = $record['uc_name'] ?? 'Usuário';

        $body = view(self::EMAIL_VIEW_RECOVERY, [
            'name' => $name,
            'mail' => $mail,
        ]);

        $this->dispatchEmail($mail, $name, 'Recuperação de Senha - Sistema Habilidade', $body);

        return [
            'uc_mail' => $mail,
            'uc_name' => $name,
        ];
    }

    // -------------------------------------------------------------------------
    // Logout
    // -------------------------------------------------------------------------

    /**
     * Valida o token JWT e o revoga no cache pelo tempo restante de expiração.
     *
     * Como o JWT é stateless, o logout é confirmado pelo servidor via blacklist
     * em cache. O cliente descarta o token localmente.
     *
     * @param  string $token Token JWT recebido no header Authorization
     * @return array         Dados de identificação (user_id)
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

        $ttl = max(0, ($payload['exp'] ?? 0) - time());

        if ($ttl > 0) {
            cache()->save('jwt_revoked_' . hash('sha256', $token), true, $ttl);
        }

        return [
            'user_id' => $payload['sub'] ?? null,
        ];
    }

    // -------------------------------------------------------------------------
    // Auxiliares privados
    // -------------------------------------------------------------------------

    /**
     * Configura e envia o e-mail via SMTP usando o remetente de recuperação.
     *
     * @param string $to      Endereço do destinatário
     * @param string $name    Nome do destinatário (para log)
     * @param string $subject Assunto do e-mail
     * @param string $body    Corpo HTML já renderizado
     *
     * @throws \RuntimeException Se o envio falhar
     */
    private function dispatchEmail(string $to, string $name, string $subject, string $body): void
    {
        $recovery = config('Email')->recoveryEmail;

        $email = \Config\Services::email();
        $email->initialize([
            'SMTPUser' => $recovery['SMTPUser'],
            'SMTPPass' => $recovery['SMTPPass'],
        ]);
        $email->setFrom($recovery['email'], $recovery['name']);
        $email->setTo($to);
        $email->setSubject($subject);
        $email->setMessage($body);

        if (!$email->send()) {
            log_message('error', "[AuthUser::sendRecoveryEmail] Falha ao enviar para {$to}: " . $email->printDebugger(['headers']));

            throw new \RuntimeException('Falha ao enviar o e-mail de recuperação.');
        }
    }
}
