import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import * as GroupService from '../../../../../services/modules/V1/Messaging/group'

function formatTime(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(dateStr))
}

function getCurrentUserId(): number {
  try {
    const user = JSON.parse(sessionStorage.getItem('auth_user') ?? '{}')
    return Number(user.id ?? 0)
  } catch {
    return 0
  }
}

function MessagingGroupDetail() {
  const { groupId } = useParams<{ groupId: string }>()
  const navigate = useNavigate()
  const id = Number(groupId)

  const [group, setGroup] = useState<GroupService.Group | null>(null)
  const [members, setMembers] = useState<GroupService.GroupMember[]>([])
  const [messages, setMessages] = useState<GroupService.GroupMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [replyTo, setReplyTo] = useState<GroupService.GroupMessage | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentUserId = getCurrentUserId()

  useEffect(() => {
    if (!id) return
    loadAll()
  }, [id])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadAll() {
    setLoading(true)
    setError(null)
    try {
      const [groupData, membersData, messagesData] = await Promise.all([
        GroupService.getById(id),
        GroupService.getMembers(id),
        GroupService.getMessages(id),
      ])
      setGroup(groupData)
      setMembers(membersData)
      setMessages(messagesData.data)
      await GroupService.markRead(id)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar grupo')
    } finally {
      setLoading(false)
    }
  }

  async function handleSend() {
    if (!content.trim()) return
    setSending(true)
    try {
      await GroupService.sendMessage(id, {
        content: content.trim(),
        reply_to_id: replyTo?.id,
      })
      setContent('')
      setReplyTo(null)
      const result = await GroupService.getMessages(id)
      setMessages(result.data)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao enviar mensagem')
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  async function handleRemoveMember(userId: number) {
    if (!confirm('Remover este membro do grupo?')) return
    try {
      await GroupService.removeMember(id, userId)
      setMembers(prev => prev.filter(m => m.user_id !== userId))
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao remover membro')
    }
  }

  async function handleToggleRole(member: GroupService.GroupMember) {
    const newRole = member.role === 'admin' ? 'member' : 'admin'
    try {
      await GroupService.updateMemberRole(id, member.user_id, newRole)
      setMembers(prev =>
        prev.map(m => m.user_id === member.user_id ? { ...m, role: newRole } : m),
      )
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao alterar papel')
    }
  }

  const myRole = members.find(m => m.user_id === currentUserId && !m.left_at)?.role
  const activeMembers = members.filter(m => !m.left_at)
  const chatHeight = 'calc(100vh - 160px)'

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <div className="spinner-border text-primary" role="status" />
      </div>
    )
  }

  if (error || !group) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger">{error ?? 'Grupo não encontrado.'}</div>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => navigate('/v1/messaging/groups')}
        >
          ← Voltar aos Grupos
        </button>
      </div>
    )
  }

  return (
    <div className="container-fluid py-3">

      {/* Back + título */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate('/v1/messaging/groups')}
        >
          ←
        </button>
        <div
          className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white flex-shrink-0"
          style={{ width: 32, height: 32, fontSize: 14 }}
        >
          {group.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <h5 className="mb-0 fw-semibold">{group.name}</h5>
          {group.description && (
            <small className="text-muted">{group.description}</small>
          )}
        </div>
        {myRole === 'admin' && (
          <span className="badge bg-warning text-dark ms-1">Admin</span>
        )}
      </div>

      <div
        className="row g-0 border rounded overflow-hidden"
        style={{ height: chatHeight }}
      >
        {/* Sidebar — membros */}
        <div
          className="col-12 col-md-3 border-end"
          style={{ height: '100%', overflowY: 'auto', background: '#f8f9fa' }}
        >
          <div className="px-3 py-2 border-bottom">
            <small
              className="text-muted fw-semibold text-uppercase"
              style={{ fontSize: '0.68rem', letterSpacing: '0.06em' }}
            >
              Membros ({activeMembers.length})
            </small>
          </div>

          <ul className="list-group list-group-flush">
            {activeMembers.map(m => (
              <li
                key={m.id}
                className="list-group-item bg-transparent py-2 px-3"
              >
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white flex-shrink-0"
                    style={{ width: 28, height: 28, fontSize: 12 }}
                  >
                    {(m.user_name ?? 'U').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-grow-1 overflow-hidden">
                    <div className="text-truncate" style={{ fontSize: '0.82rem', fontWeight: 500 }}>
                      {m.user_name ?? `Usuário #${m.user_id}`}
                      {m.user_id === currentUserId && (
                        <span className="text-muted ms-1" style={{ fontSize: '0.7rem' }}>(você)</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.7rem' }}>
                      {m.role === 'admin'
                        ? <span className="text-warning fw-semibold">Admin</span>
                        : <span className="text-muted">Membro</span>}
                    </div>
                  </div>

                  {myRole === 'admin' && m.user_id !== currentUserId && (
                    <div className="dropdown">
                      <button
                        className="btn btn-sm btn-link text-muted p-0"
                        data-bs-toggle="dropdown"
                        style={{ lineHeight: 1 }}
                      >
                        ⋯
                      </button>
                      <ul className="dropdown-menu dropdown-menu-end shadow-sm" style={{ fontSize: '0.82rem' }}>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={() => handleToggleRole(m)}
                          >
                            {m.role === 'admin' ? 'Rebaixar para Membro' : 'Promover a Admin'}
                          </button>
                        </li>
                        <li><hr className="dropdown-divider" /></li>
                        <li>
                          <button
                            className="dropdown-item text-danger"
                            onClick={() => handleRemoveMember(m.user_id)}
                          >
                            Remover do grupo
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Área de chat */}
        <div
          className="col-12 col-md-9 d-flex flex-column"
          style={{ height: '100%' }}
        >
          {/* Mensagens */}
          <div
            className="flex-grow-1 p-3"
            style={{ overflowY: 'auto' }}
          >
            {messages.length === 0 ? (
              <p className="text-center text-muted py-4 mb-0" style={{ fontSize: '0.85rem' }}>
                Nenhuma mensagem ainda. Seja o primeiro a falar!
              </p>
            ) : (
              messages.map(msg => {
                const isMine = msg.user_id === currentUserId
                return (
                  <div
                    key={msg.id}
                    className={`d-flex mb-2${isMine ? ' justify-content-end' : ' justify-content-start'}`}
                  >
                    <div style={{ maxWidth: '70%' }}>
                      {!isMine && (
                        <div className="text-muted mb-1" style={{ fontSize: '0.72rem' }}>
                          {msg.author_name ?? `Usuário #${msg.user_id}`}
                        </div>
                      )}

                      {/* Preview da mensagem citada */}
                      {msg.reply_to_id && (
                        <div
                          className="mb-1 px-2 py-1 rounded border-start border-3 border-secondary bg-light"
                          style={{ fontSize: '0.74rem', opacity: 0.85 }}
                        >
                          <strong>{msg.reply_to_author ?? 'Alguém'}</strong>:{' '}
                          <em>{msg.reply_to_content?.slice(0, 80) ?? '—'}</em>
                        </div>
                      )}

                      <div
                        className={`px-3 py-2 rounded-3${isMine ? ' bg-primary text-white' : ' bg-light border'}`}
                        style={{ fontSize: '0.88rem' }}
                      >
                        <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                        <div
                          className="d-flex justify-content-between align-items-center mt-1 gap-3"
                        >
                          <button
                            className={`btn btn-link p-0 border-0${isMine ? ' text-white-50' : ' text-muted'}`}
                            style={{ fontSize: '0.68rem' }}
                            onClick={() => setReplyTo(msg)}
                          >
                            Responder
                          </button>
                          <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>
                            {formatTime(msg.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Preview do reply */}
          {replyTo && (
            <div
              className="px-3 py-1 border-top border-start border-3 border-secondary bg-light d-flex justify-content-between align-items-center"
              style={{ flexShrink: 0 }}
            >
              <small className="text-muted">
                Respondendo a <strong>{replyTo.author_name ?? `#${replyTo.user_id}`}</strong>:{' '}
                <em>{replyTo.content?.slice(0, 60) ?? ''}...</em>
              </small>
              <button
                className="btn btn-link btn-sm text-muted p-0 ms-2"
                onClick={() => setReplyTo(null)}
              >
                ✕
              </button>
            </div>
          )}

          {/* Input */}
          <div
            className="border-top p-2 d-flex gap-2 align-items-end"
            style={{ background: '#f8f9fa', flexShrink: 0 }}
          >
            <textarea
              className="form-control form-control-sm"
              rows={2}
              placeholder="Digite sua mensagem... (Enter para enviar)"
              value={content}
              onChange={e => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ resize: 'none' }}
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={handleSend}
              disabled={sending || !content.trim()}
              style={{ whiteSpace: 'nowrap' }}
            >
              {sending
                ? <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                : 'Enviar'}
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

export default MessagingGroupDetail
