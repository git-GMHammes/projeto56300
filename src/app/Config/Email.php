<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Email extends BaseConfig
{
    public string $fromEmail  = '';
    public string $fromName   = 'Sistema Habilidade';
    public string $recipients = '';

    /**
     * The "user agent"
     */
    public string $userAgent = 'CodeIgniter';

    /**
     * The mail sending protocol: mail, sendmail, smtp
     */
    public string $protocol = 'mail';

    /**
     * The server path to Sendmail.
     */
    public string $mailPath = '/usr/sbin/sendmail';

    /**
     * SMTP Server Hostname
     */
    public string $SMTPHost = '';

    /**
     * Which SMTP authentication method to use: login, plain
     */
    public string $SMTPAuthMethod = 'login';

    /**
     * SMTP Username
     */
    public string $SMTPUser = '';

    /**
     * SMTP Password
     */
    public string $SMTPPass = '';

    /**
     * SMTP Port
     */
    public int $SMTPPort = 25;

    /**
     * SMTP Timeout (in seconds)
     */
    public int $SMTPTimeout = 60;

    /**
     * Enable persistent SMTP connections
     */
    public bool $SMTPKeepAlive = false;

    /**
     * SMTP Encryption. 'ssl' para porta 465.
     */
    public string $SMTPCrypto = 'tls';

    /**
     * Enable word-wrap
     */
    public bool $wordWrap = true;

    /**
     * Character count to wrap at
     */
    public int $wrapChars = 76;

    /**
     * Type of mail, either 'text' or 'html'
     */
    public string $mailType = 'html';

    /**
     * Character set (utf-8, iso-8859-1, etc.)
     */
    public string $charset = 'UTF-8';

    /**
     * Whether to validate the email address
     */
    public bool $validate = false;

    /**
     * Email Priority. 1 = highest. 5 = lowest. 3 = normal
     */
    public int $priority = 3;

    /**
     * Newline character. (Use "\r\n" to comply with RFC 822)
     */
    public string $CRLF = "\r\n";

    /**
     * Newline character. (Use "\r\n" to comply with RFC 822)
     */
    public string $newline = "\r\n";

    /**
     * Enable BCC Batch Mode.
     */
    public bool $BCCBatchMode = false;

    /**
     * Number of emails in each BCC batch
     */
    public int $BCCBatchSize = 200;

    /**
     * Enable notify message from server
     */
    public bool $DSN = false;

    /**
     * E-mail de recuperação de senha.
     * Uso: $email->setFrom($config->recoveryEmail['email'], $config->recoveryEmail['name'])
     */
    public array $recoveryEmail = [];

    public function __construct()
    {
        parent::__construct();

        $this->fromEmail = defined('I2F3E4D5C6B7A8F9E0D1C2B3A4F5E6D7')
            ? I2F3E4D5C6B7A8F9E0D1C2B3A4F5E6D7
            : (getenv('MAIL_FROM_EMAIL') ?: '');

        $this->protocol = defined('J1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6')
            ? J1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6
            : (getenv('MAIL_PROTOCOL') ?: '');

        $this->SMTPHost = defined('K9E8D7C6B5A4F3E2D1C0B9A8F7E6D5C4')
            ? K9E8D7C6B5A4F3E2D1C0B9A8F7E6D5C4
            : (getenv('MAIL_SMTP_HOST') ?: '');

        $this->SMTPAuthMethod = defined('L8C7B6A5F4E3D2C1B0A9F8E7D6C5B4A3')
            ? L8C7B6A5F4E3D2C1B0A9F8E7D6C5B4A3
            : (getenv('MAIL_SMTP_AUTH_METHOD') ?: '');

        $this->SMTPUser = defined('M7F6E5D4C3B2A1F0E9D8C7B6A5F4E3D2')
            ? M7F6E5D4C3B2A1F0E9D8C7B6A5F4E3D2
            : (getenv('MAIL_SMTP_USER') ?: '');

        $this->SMTPPass = defined('N6A5B4C3D2E1F0A9B8C7D6E5F4A3B2C1')
            ? N6A5B4C3D2E1F0A9B8C7D6E5F4A3B2C1
            : (getenv('MAIL_SMTP_PASS') ?: '');

        $this->SMTPPort = defined('O5D4C3B2A1F0E9D8C7B6A5F4E3D2C1B0')
            ? (int) O5D4C3B2A1F0E9D8C7B6A5F4E3D2C1B0
            : (int) (getenv('MAIL_SMTP_PORT') ?: 0);

        $this->SMTPCrypto = defined('P4F3E2D1C0B9A8F7E6D5C4B3A2F1E0D9')
            ? P4F3E2D1C0B9A8F7E6D5C4B3A2F1E0D9
            : (getenv('MAIL_SMTP_CRYPTO') ?: '');

        $this->charset = defined('Q3A2B1C0D9E8F7A6B5C4D3E2F1A0B9C8')
            ? Q3A2B1C0D9E8F7A6B5C4D3E2F1A0B9C8
            : (getenv('MAIL_CHARSET') ?: '');

        $this->recoveryEmail = [
            'email' => defined('R2F1E0D9C8B7A6F5E4D3C2B1A0F9E8D7')
                ? R2F1E0D9C8B7A6F5E4D3C2B1A0F9E8D7
                : (getenv('MAIL_RECOVERY_EMAIL') ?: ''),

            'name'     => 'Recuperação de Senha Habilidade',

            'SMTPUser' => defined('S1A0B9C8D7E6F5A4B3C2D1E0F9A8B7C6')
                ? S1A0B9C8D7E6F5A4B3C2D1E0F9A8B7C6
                : (getenv('MAIL_RECOVERY_SMTP_USER') ?: ''),

            'SMTPPass' => defined('T9E8D7C6B5A4F3E2D1C0B9A8F7E6D5C4')
                ? T9E8D7C6B5A4F3E2D1C0B9A8F7E6D5C4
                : (getenv('MAIL_RECOVERY_SMTP_PASS') ?: ''),
        ];
    }
}
