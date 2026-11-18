# Cantina do Kennedy

Site para fazer pedidos de lanches da cantina.

🌐 **Site no ar:** https://afonsomiguel700.github.io/cantina-kennedy/

## O que o site faz

- Cardápio com preços e **estoque** de cada produto.
- Carrinho com quantidades e total do pedido.
- Nome e turma do cliente e acompanhamento do status (Recebido → Preparando → Pronto → Entregue).
- Lista de **pessoas que já pediram** (sem senha).
- Área do administrador protegida por **senha única** e **CRUD de produtos**: cadastrar, editar, excluir e ajustar estoque.
- Ao finalizar um pedido, o estoque dos produtos baixa automaticamente.

> A senha do administrador está no código do site. Ela serve como uma barreira simples para não deixar qualquer pessoa mexer no cardápio, mas **não é segurança de verdade**: como o site é estático, a senha fica visível no código-fonte. Os dados salvos ficam somente no navegador.

## Fluxograma simples (versão fácil)

![Fluxograma simples da Cantina do Kennedy](fluxograma-simples.png)

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
| `app.js` | Regras: senha do administrador, produtos, estoque, carrinho, pedidos e pessoas |
| `fluxograma-simples.png` | Versão resumida do fluxo (7 passos) |
| `fluxograma.png` | Desenho do fluxo completo do site |
| `fluxograma-simples.html` | Versão interativa do fluxograma simples |
| `fluxograma.html` | Versão interativa do fluxograma completo |
| `fluxograma.md` | Código-fonte do fluxograma completo em Mermaid |
