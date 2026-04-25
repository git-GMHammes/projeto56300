import { useState, useEffect } from 'react'
import * as TimelineService from '../../../../services/modules/V1/Messaging/timeline'

type ReactionType = TimelineService.ReactionType

const REACTIONS: { type: ReactionType; emoji: string; label: string }[] = [
  { type: 'like',  emoji: '👍', label: 'Curtir'  },
  { type: 'love',  emoji: '❤️',  label: 'Amei'    },
  { type: 'haha',  emoji: '😄', label: 'Haha'     },
  { type: 'wow',   emoji: '😮', label: 'Uau'      },
  { type: 'sad',   emoji: '😢', label: 'Triste'   },
  { type: 'angry', emoji: '😠', label: 'Grr'      },
]

function formatDateTime(dateStr: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(dateStr))
}

function MessagingTimeline() {
  const [posts, setPosts] = useState<TimelineService.TimelinePost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [content, setContent] = useState('')
  const [isPinned, setIsPinned] = useState(false)
  const [creating, setCreating] = useState(false)

  useEffect(() => { loadPosts() }, [])

  async function loadPosts() {
    setLoading(true)
    setError(null)
    try {
      const result = await TimelineService.find({
        page: 1,
        per_page: 30,
        order_by: 'is_pinned',
        order_dir: 'desc',
      })
      setPosts(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar posts')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate() {
    if (!content.trim()) return
    setCreating(true)
    try {
      await TimelineService.create({ content: content.trim(), is_pinned: isPinned ? 1 : 0 })
      setContent('')
      setIsPinned(false)
      document.getElementById('tlCloseModal')?.click()
      await loadPosts()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao publicar')
    } finally {
      setCreating(false)
    }
  }

  async function handleReact(postId: number, reaction: ReactionType) {
    try {
      await TimelineService.react(postId, reaction)
      await loadPosts()
    } catch { /* silent */ }
  }

  async function handleDelete(postId: number) {
    if (!confirm('Remover este post?')) return
    try {
      await TimelineService.deleteSoft(postId)
      await loadPosts()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao remover')
    }
  }

  async function handleTogglePin(post: TimelineService.TimelinePost) {
    try {
      if (post.is_pinned) {
        await TimelineService.unpin(post.id)
      } else {
        await TimelineService.pin(post.id)
      }
      await loadPosts()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao alterar fixação')
    }
  }

  return (
    <div className="container py-4" style={{ maxWidth: 720 }}>

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-0 fw-semibold">Timeline</h4>
          <small className="text-muted">Mural da empresa</small>
        </div>
        <button
          className="btn btn-primary btn-sm"
          data-bs-toggle="modal"
          data-bs-target="#tlCreateModal"
        >
          + Nova Publicação
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}{' '}
          <button className="btn btn-sm btn-link p-0 ms-1" onClick={loadPosts}>
            Tentar novamente
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      )}

      {/* Empty */}
      {!loading && posts.length === 0 && !error && (
        <div className="text-center text-muted py-5">
          <p className="mb-1">Nenhuma publicação ainda.</p>
          <small>Seja o primeiro a publicar!</small>
        </div>
      )}

      {/* Feed */}
      <div className="d-flex flex-column gap-3">
        {posts.map(post => (
          <div
            key={post.id}
            className={`card border-0 shadow-sm${post.is_pinned ? ' border-start border-4 border-warning' : ''}`}
          >
            <div className="card-body">

              {/* Post header */}
              <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="rounded-circle bg-secondary d-flex align-items-center justify-content-center text-white flex-shrink-0"
                    style={{ width: 38, height: 38, fontSize: 15 }}
                  >
                    {(post.author_name ?? 'U').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>
                      {post.author_name ?? `Usuário #${post.user_id}`}
                    </div>
                    <div className="text-muted" style={{ fontSize: '0.74rem' }}>
                      {formatDateTime(post.created_at)}
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  {post.is_pinned === 1 && (
                    <span className="badge bg-warning text-dark">📌 Fixado</span>
                  )}
                  <div className="dropdown">
                    <button
                      className="btn btn-sm btn-outline-secondary border-0"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      style={{ lineHeight: 1 }}
                    >
                      ⋯
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end shadow-sm">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() => handleTogglePin(post)}
                        >
                          {post.is_pinned ? '📌 Desafixar' : '📌 Fixar no topo'}
                        </button>
                      </li>
                      <li><hr className="dropdown-divider" /></li>
                      <li>
                        <button
                          className="dropdown-item text-danger"
                          onClick={() => handleDelete(post.id)}
                        >
                          Remover
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Conteúdo */}
              <p className="mb-3" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                {post.content}
              </p>

              {/* Barra de reações */}
              <div className="d-flex gap-1 flex-wrap pt-2 border-top">
                {REACTIONS.map(r => {
                  const count = post.reactions?.find(rc => rc.reaction === r.type)?.count ?? 0
                  const active = post.my_reaction === r.type
                  return (
                    <button
                      key={r.type}
                      className={`btn btn-sm${active ? ' btn-primary' : ' btn-outline-secondary'}`}
                      style={{ fontSize: '0.78rem', padding: '2px 8px' }}
                      onClick={() => handleReact(post.id, r.type)}
                      title={r.label}
                    >
                      {r.emoji}{count > 0 ? ` ${count}` : ''}
                    </button>
                  )
                })}
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Modal — Nova Publicação */}
      <div
        className="modal fade"
        id="tlCreateModal"
        tabIndex={-1}
        aria-labelledby="tlCreateModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="tlCreateModalLabel">Nova Publicação</h5>
              <button
                type="button"
                className="btn-close"
                id="tlCloseModal"
                data-bs-dismiss="modal"
                aria-label="Fechar"
              />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Conteúdo</label>
                <textarea
                  className="form-control"
                  rows={5}
                  placeholder="O que você quer compartilhar com a empresa?"
                  value={content}
                  onChange={e => setContent(e.target.value)}
                />
              </div>
              <div className="form-check">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="tlPinnedCheck"
                  checked={isPinned}
                  onChange={e => setIsPinned(e.target.checked)}
                />
                <label className="form-check-label" htmlFor="tlPinnedCheck">
                  📌 Fixar no topo do feed
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                data-bs-dismiss="modal"
              >
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleCreate}
                disabled={creating || !content.trim()}
              >
                {creating ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-1"
                      role="status"
                      aria-hidden="true"
                    />
                    Publicando...
                  </>
                ) : 'Publicar'}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default MessagingTimeline
