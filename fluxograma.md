# Fluxograma — Cantina do Kennedy

Este arquivo mostra o caminho completo do site: o que acontece quando a pessoa abre a página, como ela cria conta de cliente, faz pedidos, acompanha o status, usa o acesso reservado da cantina e o que o administrador pode fazer.

> Os textos abaixo estão em **Mermaid**, uma linguagem para desenhar fluxogramas. Você pode colar este código em sites como https://mermaid.live para ver o desenho, ou abrir o arquivo `fluxograma.html` que já vem pronto para visualizar.

---

## 1. Fluxograma principal (o site inteiro)

```mermaid
flowchart TD
    INICIO(["Usuário abre o site<br/>GitHub Pages ou index.html"])
    CARREGA["Carregar dados salvos no navegador<br/>tema, contas, carrinho, pedidos,<br/>cliente e itens personalizados"]
    TEMA["Aplicar tema claro ou escuro<br/>🌙 / ☀️"]
    RENDER["Renderizar tudo:<br/>filtros, cardápio, carrinho,<br/>pedidos, pessoas e itens personalizados"]
    MENU{"Qual ação do usuário?"}

    INICIO --> CARREGA --> TEMA --> RENDER --> MENU

    MENU -->|"Ver cardápio"| CARDAPIO["Seção Cardápio<br/>mostra preço e estoque"]
    CARDAPIO --> FILTRO["Filtrar por categoria:<br/>Todos, Lanches, Salgados,<br/>Bebidas, Sobremesas, Outros"]
    FILTRO --> CARDAPIO
    CARDAPIO -->|"Adicionar +"| ADICIONAR["Adiciona 1 unidade se houver estoque<br/>e salva no navegador"]
    ADICIONAR --> ATUALIZA["Atualiza contador 🛒 e total"]
    ATUALIZA --> MENU

    MENU -->|"Abrir carrinho"| CARRINHO["Abre painel lateral<br/>🛒 Seu carrinho"]
    CARRINHO --> AJUSTE{"Ajustar itens?"}
    AJUSTE -->|"+ / − / ✕"| QTDE["Aumenta, diminui ou remove o item<br/>salva e recalcula o total"]
    QTDE --> AJUSTE
    AJUSTE -->|"Finalizar pedido"| VALIDA{"Nome, turma e forma de pagamento<br/>preenchidos?"}
    VALIDA -->|"Não"| AVISO["⚠️ Aviso na tela:<br/>preencha nome, turma e escolha o pagamento"]
    AVISO --> CARRINHO
    VALIDA -->|"Sim"| CRIA["Cria pedido #101, #102...<br/>com a forma de pagamento escolhida<br/>status inicial: Recebido"]
    CRIA --> SALVA["Salva pedido e esvazia carrinho<br/>no localStorage"]
    SALVA --> BAIXA["Estoque dos produtos<br/>baixa automaticamente"]
    BAIXA --> SUCESSO["✅ Aviso de sucesso<br/>rola a página para Meus pedidos"]
    SUCESSO --> MENU

    MENU -->|"Meus pedidos"| PEDIDOS["Mostra pedidos:<br/>número, data, itens,<br/>pagamento e total"]
    PEDIDOS --> ACAO{"Ação no pedido"}
    ACAO -->|"Avançar status"| STATUS["Recebido → Preparando →<br/>Pronto → Entregue ✅"]
    ACAO -->|"Excluir"| EXCLUI["Remove o pedido<br/>e salva no navegador"]
    STATUS --> MENU
    EXCLUI --> MENU

    MENU -->|"Pessoas"| PESSOAS["Agrupa os pedidos por<br/>nome + turma"]
    PESSOAS --> CARDPESSOA["Mostra para cada pessoa:<br/>pedidos, total gasto e último pedido"]
    CARDPESSOA --> MENU

    MENU -->|"Entrar / Criar conta no início<br/>ou pelo atalho do topo"| ENTRADA{"Entrar ou criar conta?"}

    ENTRADA -->|"Entrar"| LOGIN["Informa e-mail e senha numérica<br/>(conta de cliente)"]
    LOGIN --> LOGINOK{"Dados corretos?"}
    LOGINOK -->|"Não"| ERROLOGIN["⚠️ Aviso:<br/>e-mail ou senha incorretos"]
    ERROLOGIN --> ENTRADA
    LOGINOK -->|"Sim"| SESSAO["Salva a sessão no navegador<br/>e entra direto na conta de cliente"]
    SESSAO --> HISTORICO["Registra no histórico<br/>do dispositivo, sem senha"]

    ENTRADA -->|"Criar conta"| CRIARCLI["Nome, turma da lista,<br/>e-mail e senha numérica<br/>conta criada e já logada"]
    CRIARCLI --> SESSAO

    ENTRADA -.->|"Link discreto:<br/>Acesso da cantina"| SENHAADMIN["Digita a senha do dia<br/>(Cantina@DDMMAAAA<br/>Kennedy!)"]
    SENHAADMIN --> ADMINOK{"Senha correta?"}
    ADMINOK -->|"Não"| ERROADMIN["⚠️ Aviso:<br/>senha da cantina incorreta"]
    ERROADMIN --> ENTRADA
    ADMINOK -->|"Sim"| SESSAOADMIN["Salva sessão de administrador<br/>e registra no histórico"]
    SESSAOADMIN --> TIPOSESSAO

    HISTORICO --> TIPOSESSAO{"Tipo da conta"}
    TIPOSESSAO -->|"Cliente"| CLIENTELOGADO["🧑‍🎓 Faz pedidos<br/>não vê gerenciamento"]
    TIPOSESSAO -->|"Administrador"| ADMIN["⚙️ Área do administrador<br/>aparece no site"]
    CLIENTELOGADO --> MENU
    ADMIN --> NOVO["Cadastrar produto:<br/>nome, preço, categoria,<br/>emoji e estoque"]
    ADMIN --> EDITAR["Editar produto:<br/>preço, categoria e estoque"]
    ADMIN --> REMOVE["Excluir produto<br/>pede confirmação"]
    ADMIN --> LIMPAR["Limpar todos os dados<br/>pede confirmação"]
    ADMIN --> SAIR["Sair da conta<br/>botão visível no topo"]
    NOVO --> SALVACUSTOM["Salva no navegador<br/>produto aparece no cardápio"]
    EDITAR --> SALVACUSTOM
    REMOVE --> SALVACUSTOM
    SALVACUSTOM --> MENU
    LIMPAR --> MENU
    SAIR --> ENTRADA

    MENU -->|"Botão 🌙 / ☀️"| TROCATEMA["Troca tema claro/escuro<br/>e salva a escolha"]
    TROCATEMA --> MENU
```

---

## 2. Estado dos pedidos

```mermaid
stateDiagram-v2
    [*] --> Recebido: Pedido finalizado
    Recebido --> Preparando: Avançar status
    Preparando --> Pronto: Avançar status
    Pronto --> Entregue: Avançar status
    Entregue --> [*]
```

---

## 3. De onde vêm os dados

```mermaid
flowchart LR
    HTML["index.html<br/>estrutura das telas"] --> CSS["style.css<br/>cores, tema e layout"]
    HTML --> JS["app.js<br/>regras do site"]
    JS --> LS[("localStorage<br/>cantina.tema<br/>cantina.carrinho<br/>cantina.pedidos<br/>cantina.cliente<br/>cantina.cardapio.custom")]
    LS --> JS
    JS --> PAGES["GitHub Pages<br/>site publicado na internet"]
```

**Observação importante:** os dados ficam salvos **apenas no navegador** de quem usou o site. Por isso a lista de pessoas mostra só os pedidos feitos naquele mesmo navegador.
