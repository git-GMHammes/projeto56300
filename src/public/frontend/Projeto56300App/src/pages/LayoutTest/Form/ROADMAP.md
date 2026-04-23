# Diagnóstico e Correção — Formulário em branco (layout-test/formulario)

## Sintoma

Acessando `http://localhost:56303/#/layout-test/formulario`, a página ficava completamente em branco.  
O console do navegador mostrava:

```
No routes matched location "/layout-test/formulario"
```

---

## Causa raiz

### O problema: Vite cacheou o `AppRoutes.tsx` antigo

O container `node` (Vite dev server) foi iniciado **antes** de os arquivos da rota serem criados:

- `src/routes/LayoutTest/index.ts`
- `src/routes/LayoutTest/PublicRoutes.tsx`
- `src/pages/LayoutTest/Form/index.tsx`

Quando o `AppRoutes.tsx` foi editado no Windows para adicionar o import:

```ts
import { layoutTestPublicRoutes } from './LayoutTest'
```

...o Vite **não detectou a mudança** e continuou servindo a versão antiga em memória:

```ts
// O que o Vite servia (versão cacheada):
const publicRoutes = [...moduloTestePublicRoutes]; // ← LayoutTest ausente!
```

### Por que o file watcher não funcionou?

Podman no Windows roda os containers dentro de uma **máquina virtual Linux**.  
Mudanças feitas no sistema de arquivos do Windows **não propagam eventos inotify** para dentro do container.  
O Vite depende de inotify para detectar alterações nos arquivos e invalidar o cache — sem esses eventos, ele nunca sabe que o arquivo mudou.

Tentativas que **não funcionaram**:
- `touch` no arquivo dentro do container → Vite ignora, sem reconexão do módulo
- `cp` para reescrever o arquivo → mesmo resultado

---

## Solução aplicada

```bash
podman compose restart node
```

O restart **recria o processo do Vite do zero**, forçando-o a ler todos os arquivos do disco novamente — incluindo o `AppRoutes.tsx` já atualizado com o import correto.

Após o restart, o Vite passou a servir:

```ts
const publicRoutes = [...moduloTestePublicRoutes, ...layoutTestPublicRoutes]; // ✓
```

---

## Lição aprendida

> Sempre que adicionar **novos arquivos** ou **novos imports** em um projeto rodando dentro de Podman/Docker no Windows, é necessário reiniciar o container para que o Vite reconheça as mudanças.

```bash
podman compose restart node
```

Para mudanças em arquivos **já existentes** (editar código dentro de um arquivo), o Vite geralmente detecta normalmente, pois o polling periódico do Vite consegue capturar alterações de conteúdo via polling de timestamp (configurável via `server.watch.usePolling` no `vite.config.ts`).
