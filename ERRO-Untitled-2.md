---

1. Gerenciamento de Chats e Mensagens

✅ Abra novos chats frequentemente: Mude assunto, abra chat novo.
✅ Edite em vez de enviar nova mensagem: Edite mensagem original, economize tokens.
✅ Agrupe tarefas em um único prompt: Un prompt para múltiplos comandos.

    \--------------------
    Adição de uma API
    \--------------------
    Errado (prompts separados):
    "Crie o endpoint."
    "Agora adicione validação."
    "Agora documente."

    Correto (prompt único):
    "Crie um endpoint POST /api/pagamentos em PHP que:
      1. Receba valor, descricao e usuario_id no body JSON
      2. Valide se os três campos estão presentes e se valor é numérico positivo
      3. Insira o registro na tabela pagamentos usando PDO com prepared statement
      4. Retorne status 201 com o ID gerado em caso de sucesso, ou 422 com mensagem de erro em caso de falha de validação
      5. Adicione o bloco de comentário PHPDoc no topo da função
      6. Sem comentários adicionais, traga apenas o código."
    \--------------------------
    Adição de uma nova feature
    \--------------------------

    Errado (prompts separados):
    "Crie o componente de filtro."
    "Agora conecte ao estado."
    "Agora adicione o botão de limpar."

    Correto (prompt único):
    "Adicione a feature de filtro por status na listagem de pedidos:
      1. Crie o componente FiltroStatus.vue com opções: Todos, Pendente, Aprovado, Cancelado
      2. Conecte ao estado global em store/pedidos.js via getter pedidosFiltrados
      3. Adicione o botão 'Limpar filtro' que restaura o estado para 'Todos'
      4. Aplique o filtro sem recarregar a página (reatividade local)
      5. Mantenha o padrão visual dos outros filtros já existentes no projeto
      6. Sem explicações, apenas os arquivos alterados."

    \----------------
    Ajuste de UI/UX
    \----------------
    Errado (prompts separados):
    "Muda a cor do botão."
    "Aumenta o espaçamento."
    "Deixa responsivo."

    Correto (prompt único):
    "Ajuste o componente BotaoPrimario.vue":
      1. Troque a cor de fundo de #0057FF para #0041CC e o hover para #002F99
      2. Aumente o padding interno de 8px 16px para 10px 24px
      3. Adicione border-radius: 6px (atualmente está em 0)
      4. No mobile (max-width: 768px), o botão deve ocupar 100% da largura
      5. Mantenha o estado disabled com opacidade 50% já existente
      6. Retorne apenas o bloco <style> alterado.

    \-------------------
    Correção de um BUG
    \-------------------
    Errado (prompts separados):
    "Olha esse bug."
    "Por que acontece?"
    "Corrige."
    "Adiciona um log."

    Correto (prompt único):
    "No arquivo src/services/AuthService.php, linha 87, o token JWT não está sendo invalidado no logout quando o usuário tem sessão ativa em múltiplos dispositivos.
    Identifique a causa raiz no método logout()
    Corrija invalidando todos os tokens ativos do usuario_id na tabela tokens_ativos
    Garanta que o comportamento de logout em sessão única (fluxo já existente) não seja afetado
    Adicione um error_log() registrando usuario_id e timestamp no momento da invalidação
    Sem comentários, apenas o método corrigido."

    \----------------------------------------------
    Vamos analisar os resultados que deram erro.
    \----------------------------------------------
    Não quero apenas a solução, mas quero que vc explique a causa do erro, quero saber onde esta o arquivo que esta com erro e o que fazer com Ele.
    MAS COM UM PASSO a PASSO. Nada de dar 1000 passos ... Um passo de cada vez:
    1) Identifica e explica o erro
    2) Identifica e explica cada arquivo envolvido
    3) Analisa onde esta o erro
    4) Apresenta uma solução de cada vez sem atropelar os testes
    TUDO isso com você informando quando for necessário o reinicio de Docker ou do CACHE do LARAVEL.

    \----------------------
    Atualização corretiva
    \----------------------
    Errado (prompts separados):
    "Atualiza a versão da lib."
    "Verifica se quebrou algo."
    "Ajusta o que quebrou."

    Correto (prompt único):
    "Faça a atualização corretiva do pacote league/csv de ^8.0 para ^9.0 no projeto:
      1. Atualize a referência no composer.json
      2. Identifique todos os arquivos que usam League\Csv\Reader ou League\Csv\Writer
      3. Aplique as mudanças de API necessárias (na v9 o método createFromPath foi substituído por Reader::createFromPath estático)
      4. Verifique se o método fetchAssoc() foi substituído por getRecords() nos arquivos afetados e corrija
      5. Mantenha o comportamento funcional idêntico à versão anterior
      6. Liste os arquivos alterados ao final."

    \-----------------------
    Atualização evolutiva
    \-----------------------
    Errado (prompts separados):
    "Adiciona paginação."
    "Agora adiciona ordenação."
    "Agora adiciona busca."
    "Agora refatora o controller."

    Correto (prompt único):
    "Evolua o endpoint GET /api/clientes para suportar paginação, ordenação e busca:
      1. Paginação: parâmetros page (padrão 1) e per_page (padrão 20, máximo 100); resposta deve incluir total, pagina_atual e ultima_pagina
      2. Ordenação: parâmetro sort aceitando nome, criado_em e status; parâmetro order aceitando asc ou desc (padrão: criado_em desc)
      3. Busca: parâmetro q aplicando LIKE em nome e email simultaneamente
      4. Aplique todos os filtros de forma combinável (busca + ordenação + paginação ao mesmo tempo)
      5. Mantenha a query usando o QueryBuilder já adotado no projeto (não trocar por Eloquent raw)
      6. Retorne apenas o método do controller e a query alterada."


✅ Resuma e recomece: Resuma, abra chat, cole resumo.

---

2. Otimização de Arquivos e Mídias

✅ Converta arquivos para Markdown (.md): Texto limpo reduz tokens drasticamente.

    \------------------------------
    cd D:\Users\Dev\Desktop\pandoc
    pandoc teste.docx -o teste.md
    \------------------------------
    D:\Users\Dev\Desktop\pandoc\pandoc.exe D:\Users\Dev\Desktop\teste.docx -o D:\Users\Dev\Desktop\teste.md
    \------------------------------
    LLM/Claude (via skill /pdf)
    \------------------------------

✅ Corte Imagens: Envie só trecho estritamente necessário.
✅ Use a área de Projetos: Suba arquivos recorrentes uma vez.

---

3. Ajustes de Comportamento e Configurações

✅ Peça correções cirúrgicas: Refaça só a seção errada.
✅ Corte as justificativas: Peça apenas o resultado final.
✅ Desligue recursos desnecessários: Ative ferramentas só quando necessário.
✅ Escolha o modelo certo: Sonnet no dia a dia.
✅ Defina preferências globais: Configure estilo uma única vez.

---

4. Dicas Específicas para o Claude Code (Prompt de Comando)

✅ /compact: Compacta contexto mantendo informações essenciais.

    \--------------------------------------------------------------
    /compact
    \--------------------------------------------------------------
    /compact Foca nos arquivos alterados e nas pendências abertas.
    \--------------------------------------------------------------

✅ /clear: Limpa histórico da sessão atual.

    \-------
    /clear
    \-------

✅ Ativa planejamento antes de executar.

    CLAUDE.EXE
    \----------------------
    Shift + Ctrl + M
    Opção 3.
    \----------------------

    VSCODE:
    \--------------------------------------------------------------
    /plan
    \--------------------------------------------------------------
    /plan Antes de executar, faça um plano passo a passo.
    \--------------------------------------------------------------

✅ CLAUDE.md: Instruções globais persistentes do projeto.