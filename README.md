# Cantina do Kennedy

Site para fazer pedidos de lanches da cantina.

🌐 **Site no ar:** https://afonsomiguel700.github.io/cantina-kennedy/

🔑 **Senha do administrador de hoje (24/11/2026):** `Cantina@24112026Kennedy!`

> Essa linha é atualizada automaticamente todo dia pelo GitHub Actions.

## O que o site faz

- Cardápio com preços e **estoque** de cada produto.
- Carrinho com quantidades e total do pedido.
- **Forma de pagamento** na finalização: cartão de débito, cartão de crédito ou dinheiro.
- Nome e turma do cliente e acompanhamento do status (Recebido → Preparando → Pronto → Entregue).
- Lista de **pessoas que já pediram** (sem senha).
- **Histórico de login** salvo no dispositivo (nome, e-mail, tipo e data/hora — sem senha).
- **Conta de cliente** para fazer pedidos e **acesso reservado** para o administrador.
- Área do administrador com **CRUD de produtos**: cadastrar, editar, excluir e ajustar estoque.
- Ao finalizar um pedido, o estoque dos produtos baixa automaticamente.

## Como funcionam as contas

A seção **Minha conta** fica no **início da página**, logo após a apresentação, bem visível. Você também encontra o atalho **🔑 Entrar / Criar conta** no topo, ao lado de Cardápio, Meus pedidos e Pessoas. Lá você escolhe entre **Entrar** e **Criar conta**.

Quando estiver logado, o topo mostra seu nome e um botão **Sair** fácil de encontrar — ele encerra a sessão de qualquer lugar do site.

### 🧑‍🎓 Cliente
- Informa nome, turma, e-mail e senha (somente números, mínimo 4 dígitos).
- A turma é escolhida em uma lista: `6º A/B/C`, separador, `7º A/B/C`, separador, `8º A/B/C`, separador, `9º A/B/C`, separador e depois `1º ADM` e `1º DSB`.
- Serve somente para fazer pedidos e acompanhar o status.
- Não consegue mexer nos produtos.

### 🔒 Administrador (acesso reservado)
- **Não existe mais cadastro de administrador** no site — o botão e a opção “Sou administrador” foram removidos.
- Na área de login, clique no link discreto **“🔒 Acesso da cantina”** e digite a **senha reservada**.
- A senha **muda todo dia automaticamente**, usando a data do navegador no modelo **`Cantina@DDMMAAAA Kennedy!`**.
  - Exemplo: em 20/11/2026 a senha é `Cantina@20112026Kennedy!`.
  - A senha de ontem **não serve mais**: isso evita que uma senha copiada continue funcionando.
- As partes fixas (`Cantina@` e `Kennedy!`) ficam no topo do `app.js` em `PREFIXO_SENHA_ADMIN` e `SUFIXO_SENHA_ADMIN`. Troque essas linhas quando quiser.
- A senha gerada precisa seguir as regras de senha forte: **mínimo de 8 caracteres, pelo menos 2 números, 1 letra maiúscula, 1 letra minúscula e 1 símbolo**. Se as partes fixas não gerarem uma senha válida, o site bloqueia o acesso e avisa no console.
- A senha é comparada exatamente como foi digitada — diferencia maiúsculas de minúsculas e símbolos.
- Depois de entrar, a área de gerenciar produtos aparece normalmente. O acesso também aparece no histórico de login, mas **nunca** salva a senha.

> ⚠️ A troca diária ajuda contra senha copiada ou compartilhada, **mas não é segurança de verdade**: o modelo da senha está no código-fonte. Em um site estático (GitHub Pages), quem abrir o `app.js` consegue calcular a senha de qualquer dia. Para segurança real, seria preciso um servidor.

### 🔐 Entrar na conta de cliente

Ao escolher **Entrar**, informe o **e-mail** e a **senha numérica** cadastrados e clique em **“Entrar”**. Você entra direto na conta de cliente — **não há mais código de 6 dígitos nem etapa com Gmail**.

O acesso reservado do administrador continua usando apenas a senha do dia.

### 🕘 Histórico de login

Cada login feito com sucesso fica salvo no **localStorage deste navegador/dispositivo**. Na seção Minha conta aparece a lista com nome, e-mail, tipo de conta e data/hora do acesso — mais recente primeiro (até os 30 últimos). **Nunca** é guardada a senha.

O botão **“Limpar histórico”** apaga só essa lista. O botão de limpar todos os dados também apaga o histórico. Se trocar de navegador, dispositivo ou apagar os dados do site, o histórico não vem junto.

> ⚠️ Como o site é estático (GitHub Pages), tudo fica salvo somente neste navegador. Não há envio de e-mails nem verificação em duas etapas — o login é feito só com e-mail e senha numérica.

## 💳 Forma de pagamento

Ao abrir o carrinho e clicar em **Finalizar pedido**, escolha uma das opções:

- **💳 Cartão de débito**
- **💳 Cartão de crédito**
- **💵 Dinheiro**

Se nenhuma estiver marcada, o site avisa e o pedido não é criado. A escolha fica salva junto com o pedido e aparece em **Meus pedidos**, na linha **Pagamento**. Pedidos feitos antes dessa opção aparecem como **Não informado**. A última escolha continua marcada no carrinho para o próximo pedido — basta trocar se quiser.

## Fluxograma simples (versão fácil)

- [ Abrir fluxograma simples interativo](https://afonsomiguel700.github.io/cantina-kennedy/fluxograma-simples.html)

## Fluxograma completo

![Fluxograma completo da Cantina do Kennedy](fluxograma.png)

- [ Abrir fluxograma completo interativo](https://afonsomiguel700.github.io/cantina-kennedy/fluxograma.html)
- [ Ver código do fluxograma completo (Mermaid)](fluxograma.md)

## Arquivos

| Arquivo | O que faz |
| --- | --- |
| `index.html` | Estrutura das telas do site |
| `style.css` | Cores, layout e tema claro/escuro |
| `app.js` | Regras: contas, produtos, estoque, carrinho, pedidos e pessoas |
| `fluxograma.png` | Desenho do fluxo completo do site |
| `fluxograma-simples.html` | Versão interativa do fluxograma simples |
| `fluxograma.html` | Versão interativa do fluxograma completo |
| `fluxograma.md` | Código-fonte do fluxograma completo em Mermaid |
