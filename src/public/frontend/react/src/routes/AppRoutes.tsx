import { HashRouter, Routes, Route } from 'react-router-dom'
import { moduloTestePublicRoutes } from './ModuloTeste'
import { layoutTestPublicRoutes } from './LayoutTest'
import { authPublicRoutes } from './Auth'
import Home from '../pages/Home'

// Agrupa todas as rotas públicas de todos os módulos
const publicRoutes = [
  ...authPublicRoutes,
  ...moduloTestePublicRoutes,
  ...layoutTestPublicRoutes,
]

function AppRoutes() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {publicRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </HashRouter>
  )
}

export default AppRoutes
