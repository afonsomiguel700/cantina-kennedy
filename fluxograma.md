# Fluxograma — Cantina do Kennedy

Este arquivo mostra o caminho completo do site: o que acontece quando a pessoa abre a página, como ela cria conta (cliente ou administrador), faz pedidos, acompanha o status e o que o administrador pode fazer.

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
    AJUSTE -->|"Finalizar pedido"| VALIDA{"Nome e turma<br/>preenchidos?"}
    VALIDA -->|"Não"| AVISO["⚠️ Aviso na tela:<br/>preencha nome e turma"]
    AVISO --> CARRINHO
    VALIDA -->|"Sim"| CRIA["Cria pedido #101, #102...<br/>status inicial: Recebido"]
    CRIA --> SALVA["Salva pedido e esvazia carrinho<br/>no localStorage"]
    SALVA --> BAIXA["Estoque dos produtos<br/>baixa automaticamente"]
    BAIXA --> SUCESSO["✅ Aviso de sucesso<br/>rola a página para Meus pedidos"]
    SUCESSO --> MENU

    MENU -->|"Meus pedidos"| PEDIDOS["Mostra pedidos:<br/>número, data, itens e total"]
    PEDIDOS --> ACAO{"Ação no pedido"}
    ACAO -->|"Avançar status"| STATUS["Recebido → Preparando →<br/>Pronto → Entregue ✅"]
    ACAO -->|"Excluir"| EXCLUI["Remove o pedido<br/>e salva no navegador"]
    STATUS --> MENU
    EXCLUI --> MENU

    MENU -->|"Pessoas"| PESSOAS["Agrupa os pedidos por<br/>nome + turma"]
    PESSOAS --> CARDPESSOA["Mostra para cada pessoa:<br/>pedidos, total gasto e último pedido"]
    CARDPESSOA --> MENU

    MENU -->|"Entrar / Criar conta no início<br/>ou pelo atalho do topo"| ENTRADA{"Entrar ou criar conta?"}

    ENTRADA -->|"Entrar"| LOGIN["Escolhe cliente ou administrador<br/>informa e-mail e senha numérica"]
    LOGIN --> LOGINOK{"Dados corretos?"}
    LOGINOK -->|"Não"| ERROLOGIN["⚠️ Aviso:<br/>e-mail ou senha incorretos"]
    ERROLOGIN --> ENTRADA
    LOGINOK -->|"Sim"| GERACODIGO["Gera código de 6 dígitos,<br/>abre o Gmail e não mostra<br/>o código no site"]
    GERACODIGO --> CODIGO["Digita o código do e-mail<br/>e clica em Confirmar"]
    CODIGO --> CODIGOOK{"Código correto?"}
    CODIGOOK -->|"Não"| ERROCODIGO["⚠️ Aviso:<br/>código incorreto"]
    ERROCODIGO --> CODIGO
    CODIGOOK -->|"Sim"| SESSAO["Salva a sessão<br/>no navegador"]
    SESSAO --> HISTORICO["Registra no histórico<br/>do dispositivo, sem senha nem código"]

    ENTRADA -->|"Criar conta"| TIPO{"Cliente ou administrador?"}
    TIPO -->|"Cliente"| CRIARCLI["Nome, turma, e-mail e senha numérica<br/>conta criada e já logada"]
    CRIARCLI --> SESSAO
    TIPO -->|"Administrador"| IDADE{"Mais de 18 anos<br/>e declarou?"}
    IDADE -->|"Não"| ERROIDADE["⚠️ Aviso:<br/>é preciso ter mais de 18 anos"]
    ERROIDADE --> ENTRADA
    IDADE -->|"Sim"| GERARSENHA["Gera senha de 6 dígitos,<br/>abre o Gmail e não mostra<br/>a senha no site"]
    GERARSENHA --> LOGIN

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
