import { useState, useEffect, useRef } from 'react'
import * as PrivateService from '../../../../services/modules/V1/Messaging/private'

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

function MessagingPrivate() {
  const [conversations, setConversations] = useState<PrivateService.Conversation[]>([])
  const [selectedConv, setSelectedConv] = useState<PrivateService.Conversation | null>(null)
  const [messages, setMessages] = useState<PrivateService.PrivateMessage[]>([])
  const [content, setContent] = useState('')
  const [loadingConvs, setLoadingConvs] = useState(true)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const currentUserId = getCurrentUserId()

  useEffect(() => { loadConversations() }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function loadConversations() {
    setLoadingConvs(true)
    try {
      const data = await PrivateService.getConversations()
      setConversations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar conversas')
    } finally {
      setLoadingConvs(false)
    }
  }

  async function selectConversation(conv: PrivateService.Conversation) {
    setSelectedConv(conv)
    setLoadingMsgs(true)
    setMessages([])
    try {
      const result = await PrivateService.getThread(conv.user_management_id)
      setMessages(result.data)
      await PrivateService.markRead(conv.user_management_id)
      setConversations(prev =>
        prev.map(c => c.user_management_id === conv.user_management_id ? { ...c, unread_count: 0 } : c),
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar mensagens')
    } finally {
      setLoadingMsgs(false)
    }
  }

  async function handleSend() {
    if (!content.trim() || !selectedConv) return
    setSending(true)
    try {
      await PrivateService.send({ receiver_id: selectedConv.user_management_id, content: content.trim() })
      setContent('')
      const result = await PrivateService.getThread(selectedConv.user_management_id)
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

  const chatHeight = 'calc(100vh - 140px)'

  return (
    <div className="container-fluid py-3">

      <h4 className="mb-3 fw-semibold">Mensagens Privadas</h4>

      {error && <div className="alert alert-danger py-2 mb-3">{error}</div>}

      <div
        className="row g-0 border rounded overflow-hidden"
        style={{ height: chatHeight }}
      >
        {/* Sidebar — conversas */}
        <div
          className="col-12 col-md-4 col-lg-3 border-end"
          style={{ height: '100%', overflowY: 'auto' }}
        >
          {loadingConvs ? (
            <div className="d-flex justify-content-center py-4">
              <div className="spinner-border spinner-border-sm text-secondary" role="status" />
            </div>
          ) : conversations.length === 0 ? (
            <p className="text-muted text-center p-4 mb-0" style={{ fontSize: '0.85rem' }}>
              Nenhuma conversa ainda.
            </p>
          ) : (
            <ul className="list-group list-group-flush">
              {conversations.map(conv => (
                <li
                  key={conv.user_management_id}
                  className={`list-group-item list-group-item-action py-3 px-3${selectedConv?.user_management_id === conv.user_management_id ? ' active' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => selectConversation(conv)}
                >
                  <div className="d-flex align-items-center gap-2">
                    <div
                      className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white flex-shrink-0"
                      style={{ width: 36, height: 36, fontSize: 14 }}
                    >
                      {conv.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-grow-1 overflow-hidden">
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-semibold" style={{ fontSize: '0.88rem' }}>
                          {conv.user_name}
                        </span>
                        {conv.unread_count > 0 && (
                          <span className="badge bg-primary rounded-pill">
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                      <div
                        className="text-truncate"
                        style={{ fontSize: '0.76rem', opacity: 0.7 }}
                      >
                        {conv.last_message ?? 'Nenhuma mensagem'}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Área do chat */}
        <div
          className="col-12 col-md-8 col-lg-9 d-flex flex-column"
          style={{ height: '100%' }}
        >
          {!selectedConv ? (
            <div className="d-flex align-items-center justify-content-center h-100 text-muted">
              Selecione uma conversa para começar
            </div>
          ) : (
            <>
              {/* Cabeçalho do chat */}
              <div
                className="px-3 py-2 border-bottom d-flex align-items-center gap-2"
                style={{ background: '#f8f9fa', flexShrink: 0 }}
              >
                <div
                  className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white flex-shrink-0"
                  style={{ width: 32, height: 32, fontSize: 13 }}
                >
                  {selectedConv.user_name.charAt(0).toUpperCase()}
                </div>
                <span className="fw-semibold">{selectedConv.user_name}</span>
              </div>

              {/* Mensagens */}
              <div
                className="flex-grow-1 p-3"
                style={{ overflowY: 'auto' }}
              >
                {loadingMsgs ? (
                  <div className="d-flex justify-content-center py-4">
                    <div className="spinner-border text-secondary" role="status" />
                  </div>
                ) : messages.length === 0 ? (
                  <p className="text-center text-muted py-4 mb-0" style={{ fontSize: '0.85rem' }}>
                    Inicie a conversa!
                  </p>
                ) : (
                  messages.map(msg => {
                    const isMine = msg.sender_id === currentUserId
                    return (
                      <div
                        key={msg.id}
                        className={`d-flex mb-2${isMine ? ' justify-content-end' : ' justify-content-start'}`}
                      >
                        <div
                          className={`px-3 py-2 rounded-3${isMine ? ' bg-primary text-white' : ' bg-light border'}`}
                          style={{ maxWidth: '70%', fontSize: '0.88rem' }}
                        >
                          <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</div>
                          <div
                            style={{ fontSize: '0.7rem', opacity: 0.7, textAlign: 'right', marginTop: 2 }}
                          >
                            {formatTime(msg.created_at)}
                            {isMine && msg.read_at && ' ✓✓'}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

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
            </>
          )}
        </div>
      </div>

    </div>
  )
}

export default MessagingPrivate
