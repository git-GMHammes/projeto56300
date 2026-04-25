import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as GroupService from '../../../../services/modules/V1/Messaging/group'

function MessagingGroups() {
  const [groups, setGroups] = useState<GroupService.Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)
  const navigate = useNavigate()

  useEffect(() => { loadGroups() }, [])

  async function loadGroups() {
    setLoading(true)
    setError(null)
    try {
      const data = await GroupService.getAll()
      setGroups(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar grupos')
    } finally {
      setLoading(false)
    }
  }

  async function handleCreate() {
    if (!name.trim()) return
    setCreating(true)
    try {
      await GroupService.create({
        name: name.trim(),
        description: description.trim() || undefined,
      })
      setName('')
      setDescription('')
      document.getElementById('grpCloseModal')?.click()
      await loadGroups()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao criar grupo')
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="container py-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-0 fw-semibold">Grupos</h4>
          <small className="text-muted">Chats em grupo da empresa</small>
        </div>
        <button
          className="btn btn-primary btn-sm"
          data-bs-toggle="modal"
          data-bs-target="#grpCreateModal"
        >
          + Novo Grupo
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="alert alert-danger py-2" role="alert">
          {error}{' '}
          <button className="btn btn-sm btn-link p-0 ms-1" onClick={loadGroups}>
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
      {!loading && groups.length === 0 && !error && (
        <div className="text-center text-muted py-5">
          <p className="mb-1">Nenhum grupo encontrado.</p>
          <small>Crie o primeiro grupo da sua empresa!</small>
        </div>
      )}

      {/* Grid de grupos */}
      <div className="row g-3">
        {groups.map(group => (
          <div key={group.id} className="col-12 col-sm-6 col-lg-4">
            <div
              className="card border-0 shadow-sm h-100"
              style={{ cursor: 'pointer', transition: 'box-shadow 0.15s' }}
              onClick={() => navigate(`/v1/messaging/groups/${group.id}`)}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,.12)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '')}
            >
              <div className="card-body">
                <div className="d-flex align-items-center gap-3 mb-2">
                  <div
                    className="rounded-circle bg-primary d-flex align-items-center justify-content-center text-white flex-shrink-0"
                    style={{ width: 44, height: 44, fontSize: 18 }}
                  >
                    {group.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <div className="fw-semibold text-truncate">{group.name}</div>
                    {group.member_count !== undefined && (
                      <div className="text-muted" style={{ fontSize: '0.76rem' }}>
                        {group.member_count} membro{group.member_count !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>

                {group.description && (
                  <p
                    className="text-muted mb-0"
                    style={{ fontSize: '0.83rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}
                  >
                    {group.description}
                  </p>
                )}
              </div>

              <div className="card-footer bg-transparent border-top-0 pb-2 pt-0">
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex gap-1">
                    {group.my_role === 'admin' && (
                      <span className="badge bg-warning text-dark" style={{ fontSize: '0.7rem' }}>
                        Admin
                      </span>
                    )}
                    {(group.unread_count ?? 0) > 0 && (
                      <span className="badge bg-danger" style={{ fontSize: '0.7rem' }}>
                        {group.unread_count} nova{(group.unread_count ?? 0) !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <span className="text-muted" style={{ fontSize: '0.74rem' }}>Abrir →</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal — Novo Grupo */}
      <div
        className="modal fade"
        id="grpCreateModal"
        tabIndex={-1}
        aria-labelledby="grpCreateModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="grpCreateModalLabel">Novo Grupo</h5>
              <button
                type="button"
                className="btn-close"
                id="grpCloseModal"
                data-bs-dismiss="modal"
                aria-label="Fechar"
              />
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">
                  Nome do grupo <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ex: Equipe de Vendas"
                  value={name}
                  onChange={e => setName(e.target.value)}
                />
              </div>
              <div className="mb-1">
                <label className="form-label">Descrição</label>
                <textarea
                  className="form-control"
                  rows={3}
                  placeholder="Descreva o propósito do grupo..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
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
                disabled={creating || !name.trim()}
              >
                {creating ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-1"
                      role="status"
                      aria-hidden="true"
                    />
                    Criando...
                  </>
                ) : 'Criar Grupo'}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default MessagingGroups
