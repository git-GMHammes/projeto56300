import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Offcanvas } from 'bootstrap'
import menuData from '../../../data/ods/menu.json'

interface OdsLayoutProps {
  children?: ReactNode
}

function OdsLayout({ children }: OdsLayoutProps) {
  function handleLinkClick() {
    const el = document.getElementById('odsOffcanvas')
    if (el) {
      Offcanvas.getInstance(el)?.hide()
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-dark position-fixed top-0 end-0 m-3"
        style={{ zIndex: 1055 }}
        data-bs-toggle="offcanvas"
        data-bs-target="#odsOffcanvas"
        aria-controls="odsOffcanvas"
        aria-label="Abrir menu ODS"
      >
        ☰
      </button>

      <div
        className="offcanvas offcanvas-end"
        tabIndex={-1}
        id="odsOffcanvas"
        aria-labelledby="odsOffcanvasLabel"
      >
        <div className="offcanvas-header border-bottom">
          <h6 className="offcanvas-title fw-bold" id="odsOffcanvasLabel">
            Objetivos de Desenvolvimento Sustentável
          </h6>
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="offcanvas"
            aria-label="Fechar"
          />
        </div>
        <div className="offcanvas-body p-0">
          <ul className="list-group list-group-flush">
            {menuData.map((item, index) => {
              const pageNum = String(index + 1).padStart(2, '0')
              const to = item.link === '#' ? `/ods/p${pageNum}` : item.link
              return (
                <li key={item.ods} className="list-group-item list-group-item-action p-0">
                  <Link
                    to={to}
                    className="d-flex flex-column text-decoration-none text-dark px-3 py-2"
                    onClick={handleLinkClick}
                  >
                    <span className="fw-semibold" style={{ fontSize: '0.82rem' }}>{item.ods}</span>
                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>{item.description}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {children}
    </>
  )
}

export default OdsLayout
