<!DOCTYPE html>
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

                    <!-- Cabeçalho -->
                    <tr>
                        <td style="background-color: #2c3e50; padding: 24px 32px;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 20px;">Sistema Habilidade</h1>
                        </td>
                    </tr>

                    <!-- Corpo -->
                    <tr>
                        <td style="padding: 32px;">
                            <h2 style="color: #2c3e50; margin-top: 0;">Recuperação de Senha</h2>

                            <p style="color: #555555; font-size: 15px;">
                                Olá, <strong><?= esc($name) ?></strong>!
                            </p>

                            <p style="color: #555555; font-size: 15px;">
                                Recebemos uma solicitação de recuperação de senha para o e-mail
                                <strong><?= esc($mail) ?></strong>.
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

                    <!-- Rodapé -->
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
</html>
