# Fluxograma — Cantina do Kennedy

Este arquivo mostra o caminho completo do site: o que acontece quando a pessoa abre a página, como ela faz um pedido, como acompanha o status e o que o responsável pela cantina pode fazer.

> Os textos abaixo estão em **Mermaid**, uma linguagem para desenhar fluxogramas. Você pode colar este código em sites como https://mermaid.live para ver o desenho, ou abrir o arquivo `fluxograma.html` que já vem pronto para visualizar.

---

## 1. Fluxograma principal (o site inteiro)

```mermaid
flowchart TD
    INICIO(["Usuário abre o site<br/>GitHub Pages ou index.html"])
    CARREGA["Carregar dados salvos no navegador<br/>tema, carrinho, pedidos, cliente<br/>e itens personalizados"]
    TEMA["Aplicar tema claro ou escuro<br/>🌙 / ☀️"]
    RENDER["Renderizar tudo:<br/>filtros, cardápio, carrinho,<br/>pedidos, pessoas e itens personalizados"]
    MENU{"Qual ação do usuário?"}

    INICIO --> CARREGA --> TEMA --> RENDER --> MENU

    MENU -->|"Ver cardápio"| CARDAPIO["Seção Cardápio"]
    CARDAPIO --> FILTRO["Filtrar por categoria:<br/>Todos, Lanches, Salgados,<br/>Bebidas, Sobremesas, Outros"]
    FILTRO --> CARDAPIO
    CARDAPIO -->|"Adicionar +"| ADICIONAR["Adiciona 1 unidade ao carrinho<br/>e salva no navegador"]
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
    SALVA --> SUCESSO["✅ Aviso de sucesso<br/>rola a página para Meus pedidos"]
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

    MENU -->|"Gerenciar cardápio"| ADMIN["⚙️ Área do responsável"]
    ADMIN --> NOVO["Adicionar item personalizado<br/>nome, preço, categoria e emoji"]
    NOVO --> SALVACUSTOM["Salva no navegador<br/>item aparece no cardápio"]
    ADMIN --> REMOVE["Remover item personalizado"]
    ADMIN --> LIMPAR["Limpar todos os dados<br/>pede confirmação e restaura o original"]
    SALVACUSTOM --> MENU
    REMOVE --> MENU
    LIMPAR --> MENU

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
