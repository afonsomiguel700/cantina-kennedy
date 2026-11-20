# Fluxograma simples — Cantina do Kennedy

Versão resumida: o caminho principal do site em 7 passos, incluindo conta de cliente, acesso reservado do administrador, estoque e gerenciamento de produtos.

![Fluxograma simples](fluxograma-simples.png)

- [Abrir versão interativa](https://afonsomiguel700.github.io/cantina-kennedy/fluxograma-simples.html)
- [Ver fluxograma completo](fluxograma.md)

## Código Mermaid

```mermaid
flowchart LR
    A(["Abrir o site<br/>Cantina do Kennedy"])
    B["1. Ver cardápio<br/>preço e estoque"]
    C["2. Adicionar item ao carrinho"]
    D["3. Digitar nome e turma<br/>e escolher o pagamento"]
    E["4. Finalizar pedido"]
    F["5. Estoque baixa<br/>automaticamente"]
    G["6. Acompanhar status<br/>até Entregue ✅"]
    H(["7. Ver quem já pediu<br/>na seção Pessoas"])

    A --> B --> C --> D --> E --> F --> G --> H

    B -.-> I["🧑‍🎓 Cliente"]
    I -.-> J["No início: entrar ou criar conta<br/>e-mail + senha numérica"]
    J -.-> N["Histórico de login salvo<br/>no dispositivo, sem senha"]
    B -.-> L["🔒 Acesso reservado<br/>da cantina"]
    L -.-> M["Senha muda todo dia<br/>(Cantina@DDMMAAAA Kennedy!)"]
    M -.-> K["Cadastrar, editar,<br/>excluir e ajustar estoque"]

    classDef inicio fill:#166534,stroke:#14532d,color:#ffffff;
    classDef acao fill:#fef3c7,stroke:#b45309,color:#78350f;
    classDef salvo fill:#dbeafe,stroke:#1d4ed8,color:#1e3a8a;
    classDef extra fill:#f5f5f4,stroke:#a8a29e,color:#44403c;
    class A,H inicio;
    class B,C,D,E,G acao;
    class F salvo;
    class I,J,L,M,K,N extra;
```
