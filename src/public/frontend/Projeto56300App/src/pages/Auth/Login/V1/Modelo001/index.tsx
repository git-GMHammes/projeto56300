import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import FormGrid, { FormGridSchema } from '../../../../../components/ui/FormGrid/Input'
import notDefinedImg from '../../../../../assets/images/not_defined.png'
import { palette1 as palette } from '../../../../../themes/login'

// ─── Schema do formulário ─────────────────────────────────────────────────────
const schema: FormGridSchema = {
    rows: [
        {
            fields: [
                {
                    col: 12,
                    label: 'Usuário',
                    id: 'um_user',
                    name: 'um_user',
                    placeholder: 'Digite seu usuário',
                    required: true,
                    autoComplete: 'username',
                },
                {
                    type: 'password',
                    col: 12,
                    label: 'Senha',
                    id: 'um_password',
                    name: 'um_password',
                    placeholder: 'Digite sua senha',
                    required: true,
                    autoComplete: 'current-password',
                },
                {
                    col: 12,
                    id: 'ut_tenant_id',
                    name: 'ut_tenant_id',
                    defaultValue: '1',
                    hidden: true,
                },
            ],
        },
    ],
}

// ─── Componente ───────────────────────────────────────────────────────────────
function LoginModelo001() {
    const [loading, setLoading] = useState(false)

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const data = new FormData(e.currentTarget)
        const _payload = {
            um_user: data.get('um_user') as string,
            um_password: data.get('um_password') as string,
            ut_tenant_id: data.get('ut_tenant_id') as string,
        }

        // TODO: integrar com o serviço de autenticação
        setLoading(false)
    }

    return (
        <div
            style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${palette.bgStart} 0%, ${palette.bgMid} 55%, ${palette.bgEnd} 100%)`,
                padding: '1.5rem',
            }}
        >
            <div
                className="card shadow-lg border-0"
                style={{
                    width: '100%',
                    maxWidth: 420,
                    borderRadius: '1rem',
                    backgroundColor: palette.cardBg,
                    overflow: 'hidden',
                }}
            >
                {/* ── Cabeçalho colorido ── */}
                <div
                    style={{
                        background: `linear-gradient(135deg, ${palette.headerStart} 0%, ${palette.headerEnd} 100%)`,
                        padding: '2rem 2rem 1.5rem',
                        textAlign: 'center',
                    }}
                >
                    <img
                        src={notDefinedImg}
                        alt="Logo"
                        style={{
                            maxHeight: 72,
                            maxWidth: '100%',
                            objectFit: 'contain',
                            marginBottom: '0.75rem',
                        }}
                    />
                    <h5
                        className="mb-0 fw-semibold"
                        style={{ color: palette.headerText, letterSpacing: '0.03em' }}
                    >
                        Acesso ao Sistema
                    </h5>
                </div>

                {/* ── Corpo do card ── */}
                <div className="card-body px-4 pt-4 pb-3">
                    <form onSubmit={handleSubmit} noValidate>
                        <FormGrid schema={schema} />

                        <button
                            type="submit"
                            className="btn w-100 mt-2 fw-semibold"
                            disabled={loading}
                            style={{
                                backgroundColor: palette.btnBg,
                                borderColor: palette.btnBg,
                                color: palette.btnText,
                                borderRadius: '0.5rem',
                                padding: '0.6rem',
                                transition: 'background-color 0.2s',
                            }}
                            onMouseEnter={e =>
                                ((e.currentTarget as HTMLButtonElement).style.backgroundColor = palette.btnBgHover)
                            }
                            onMouseLeave={e =>
                                ((e.currentTarget as HTMLButtonElement).style.backgroundColor = palette.btnBg)
                            }
                        >
                            {loading ? 'Entrando…' : 'Entrar'}
                        </button>
                    </form>
                </div>

                {/* ── Rodapé com links ── */}
                <div
                    className="d-flex justify-content-between px-4 pb-4 pt-1"
                    style={{ fontSize: '0.85rem' }}
                >
                    <Link
                        to="/v1/novo-registro"
                        style={{ color: palette.link, textDecoration: 'none' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = palette.linkHover)}
                        onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = palette.link)}
                    >
                        Novo Registro
                    </Link>
                    <Link
                        to="/v1/recuperar-senha"
                        style={{ color: palette.link, textDecoration: 'none' }}
                        onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = palette.linkHover)}
                        onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = palette.link)}
                    >
                        Recuperação de Senha
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default LoginModelo001
