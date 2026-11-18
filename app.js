'use strict';

/*
  Cantina do Kennedy
  App simples feito só com HTML, CSS e JavaScript.
  Tudo que é salvo fica no navegador (localStorage): não precisa de servidor.
*/

// Chaves usadas para guardar os dados no navegador
const CHAVES = {
  // Só os itens criados pelo responsável ficam salvos aqui.
  // Os itens padrão vêm sempre do código, então mudar preços no código sempre aparece.
  cardapioCustom: 'cantina.cardapio.custom',
  carrinho: 'cantina.carrinho',
  pedidos: 'cantina.pedidos',
  cliente: 'cantina.cliente',
  tema: 'cantina.tema'
};

// Chaves usadas por versões antigas do app (apagadas ao limpar os dados).
const CHAVES_ANTIGAS = ['cantina.cardapio', 'cantina.cardapio.v2'];

// Cardápio inicial (usado na primeira vez que o site é aberto)
const CARDAPIO_PADRAO = [
  { id: 'item-1', nome: 'Hamburgão', descricao: 'Hambúrguer da cantina', preco: 7.5, categoria: 'Lanches', emoji: '🍔' },
  { id: 'item-2', nome: 'Salgados variados', descricao: 'Escolha o seu salgado favorito', preco: 6.5, categoria: 'Salgados', emoji: '🥟' },
  { id: 'item-3', nome: 'Água com gás', descricao: 'Garrafa pequena', preco: 2.5, categoria: 'Bebidas', emoji: '💧' },
  { id: 'item-4', nome: 'Água sem gás', descricao: 'Garrafa pequena', preco: 2.5, categoria: 'Bebidas', emoji: '💧' },
  { id: 'item-5', nome: 'Barinha de cereais', descricao: 'Crocante e prática', preco: 2.5, categoria: 'Lanches', emoji: '🍫' },
  { id: 'item-6', nome: 'Bolinho', descricao: 'Feito na cantina', preco: 3.5, categoria: 'Sobremesas', emoji: '🧁' },
  { id: 'item-7', nome: 'Todynho', descricao: 'Bebida de chocolate', preco: 1.5, categoria: 'Bebidas', emoji: '🥤' },
  { id: 'item-8', nome: 'Torrone', descricao: 'Doce de amendoim', preco: 1.5, categoria: 'Sobremesas', emoji: '🍬' },
  { id: 'item-9', nome: 'Iogurte', descricao: 'Copo individual', preco: 5.5, categoria: 'Sobremesas', emoji: '🥛' },
  { id: 'item-10', nome: 'Suco pequeno', descricao: 'Caixinha individual', preco: 4, categoria: 'Bebidas', emoji: '🧃' },
  { id: 'item-11', nome: 'Leite fermentado', descricao: 'Garrafinha individual', preco: 5, categoria: 'Bebidas', emoji: '🥛' }
];

const STATUS = ['Recebido', 'Preparando', 'Pronto', 'Entregue'];

// Atalho para buscar elementos do HTML
const $ = (seletor) => document.querySelector(seletor);

const el = {
  contador: $('#contador-carrinho'),
  botaoTema: $('#alternar-tema'),
  abrirCarrinho: $('#abrir-carrinho'),
  fecharCarrinho: $('#fechar-carrinho'),
  carrinho: $('#carrinho'),
  fundo: $('#fundo-carrinho'),
  filtros: $('#filtros'),
  grade: $('#grade-cardapio'),
  itensCarrinho: $('#itens-carrinho'),
  total: $('#total-carrinho'),
  formPedido: $('#form-pedido'),
  nome: $('#nome-cliente'),
  turma: $('#turma-cliente'),
  btnFinalizar: $('#btn-finalizar'),
  listaPedidos: $('#lista-pedidos'),
  formItem: $('#form-item'),
  itemNome: $('#item-nome'),
  itemDescricao: $('#item-descricao'),
  itemPreco: $('#item-preco'),
  itemCategoria: $('#item-categoria'),
  itemEmoji: $('#item-emoji'),
  listaCustom: $('#lista-custom'),
  btnLimpar: $('#btn-limpar'),
  toast: $('#toast')
};

// ---------- Funções auxiliares ----------

// Lê um valor salvo no navegador. Se não houver nada, usa o valor padrão.
function ler(chave, valorPadrao) {
  try {
    const dado = localStorage.getItem(chave);
    return dado === null ? valorPadrao : JSON.parse(dado);
  } catch (erro) {
    console.warn('Não foi possível ler os dados salvos:', erro);
    return valorPadrao;
  }
}

// Salva um valor no navegador.
function salvar(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch (erro) {
    console.warn('Não foi possível salvar os dados:', erro);
  }
}

// Protege o site contra textos digitados com códigos HTML.
function escapar(texto) {
  return String(texto).replace(/[&<>"']/g, (caractere) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[caractere]));
}

// Mostra o preço no formato brasileiro: R$ 4,50
function dinheiro(valor) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

let timerToast;
function mostrarMensagem(texto) {
  el.toast.textContent = texto;
  el.toast.classList.add('visivel');
  clearTimeout(timerToast);
  timerToast = setTimeout(() => el.toast.classList.remove('visivel'), 3200);
}

// ---------- Tema claro / escuro ----------

function aplicarTema() {
  const escuro = tema === 'escuro';
  document.body.classList.toggle('tema-escuro', escuro);
  el.botaoTema.textContent = escuro ? '☀️' : '🌙';
  el.botaoTema.setAttribute('aria-label', escuro ? 'Mudar para o fundo claro' : 'Mudar para o fundo escuro');
}

// ---------- Estado do app (dados carregados) ----------
let cardapioCustom = ler(CHAVES.cardapioCustom, []);
let cardapio = [...CARDAPIO_PADRAO, ...cardapioCustom];
let carrinho = ler(CHAVES.carrinho, {}); // objeto: { "id-do-item": quantidade }
let pedidos = ler(CHAVES.pedidos, []);
let cliente = ler(CHAVES.cliente, { nome: '', turma: '' });
let tema = ler(CHAVES.tema, 'claro');
let filtroAtual = 'Todos';

// ---------- Cardápio ----------

function renderizarFiltros() {
  const categorias = ['Todos', ...new Set(cardapio.map((item) => item.categoria))];
  el.filtros.innerHTML = categorias.map((categoria) => `
    <button type="button" class="filtro ${categoria === filtroAtual ? 'ativo' : ''}"
            data-acao="filtrar" data-categoria="${escapar(categoria)}">
      ${escapar(categoria)}
    </button>
  `).join('');
}

function renderizarCardapio() {
  const itens = filtroAtual === 'Todos'
    ? cardapio
    : cardapio.filter((item) => item.categoria === filtroAtual);

  if (itens.length === 0) {
    el.grade.innerHTML = '<p class="vazio">Nenhum item nessa categoria ainda.</p>';
    return;
  }

  el.grade.innerHTML = itens.map((item) => `
    <article class="item-card">
      <div class="item-emoji">${escapar(item.emoji)}</div>
      <div class="item-info">
        <span class="item-categoria">${escapar(item.categoria)}</span>
        <h3>${escapar(item.nome)}</h3>
        <p>${escapar(item.descricao)}</p>
      </div>
      <div class="item-bottom">
        <strong class="preco">${dinheiro(item.preco)}</strong>
        <button type="button" class="botao-primario botao-pequeno"
                data-acao="adicionar" data-id="${escapar(item.id)}">Adicionar +</button>
      </div>
    </article>
  `).join('');
}

// ---------- Carrinho ----------

// Transforma o objeto do carrinho em uma lista com o item completo e a quantidade.
function itensDoCarrinho() {
  return Object.entries(carrinho)
    .map(([id, quantidade]) => {
      const item = cardapio.find((produto) => produto.id === id);
      return item ? { item, quantidade } : null;
    })
    .filter(Boolean);
}

function totalCarrinho() {
  return itensDoCarrinho().reduce((total, { item, quantidade }) => total + item.preco * quantidade, 0);
}

function renderizarCarrinho() {
  const itens = itensDoCarrinho();
  const quantidadeTotal = itens.reduce((soma, entry) => soma + entry.quantidade, 0);

  el.contador.textContent = quantidadeTotal;
  el.total.textContent = dinheiro(totalCarrinho());
  el.btnFinalizar.disabled = itens.length === 0;

  if (itens.length === 0) {
    el.itensCarrinho.innerHTML = '<p class="vazio">Seu carrinho está vazio. Escolha algo no cardápio! 🍽️</p>';
    return;
  }

  el.itensCarrinho.innerHTML = itens.map(({ item, quantidade }) => `
    <div class="item-carrinho">
      <div class="emoji">${escapar(item.emoji)}</div>
      <div>
        <h4>${escapar(item.nome)}</h4>
        <small>${dinheiro(item.preco)} cada</small>
      </div>
      <div class="controles">
        <button type="button" data-acao="diminuir" data-id="${escapar(item.id)}" aria-label="Diminuir quantidade">−</button>
        <span class="quantidade">${quantidade}</span>
        <button type="button" data-acao="aumentar" data-id="${escapar(item.id)}" aria-label="Aumentar quantidade">+</button>
        <button type="button" class="remover" data-acao="remover" data-id="${escapar(item.id)}" aria-label="Remover item">✕</button>
      </div>
    </div>
  `).join('');
}

function alterarQuantidade(id, delta) {
  const novaQuantidade = (carrinho[id] || 0) + delta;
  if (novaQuantidade <= 0) {
    delete carrinho[id];
  } else {
    carrinho[id] = novaQuantidade;
  }
  salvar(CHAVES.carrinho, carrinho);
  renderizarCarrinho();
}

function abrirCarrinho() {
  el.carrinho.classList.add('aberto');
  el.carrinho.setAttribute('aria-hidden', 'false');
  el.fundo.classList.add('visivel');
}

function fecharCarrinho() {
  el.carrinho.classList.remove('aberto');
  el.carrinho.setAttribute('aria-hidden', 'true');
  el.fundo.classList.remove('visivel');
}

// ---------- Pedidos ----------

function proximoNumero() {
  return pedidos.reduce((maior, pedido) => Math.max(maior, pedido.numero), 100) + 1;
}

function renderizarPedidos() {
  if (pedidos.length === 0) {
    el.listaPedidos.innerHTML = '<p class="vazio">Você ainda não fez nenhum pedido. 🛒</p>';
    return;
  }

  el.listaPedidos.innerHTML = pedidos.map((pedido) => {
    // Garante que o status sempre esteja entre 0 e 3, mesmo se o dado estiver estranho.
    const status = Math.min(Math.max(Number(pedido.status) || 0, 0), STATUS.length - 1);

    return `
      <article class="pedido">
        <div class="pedido-topo">
          <div>
            <span class="numero">Pedido #${pedido.numero}</span>
            <span class="data">${escapar(pedido.data)}</span>
          </div>
          <span class="status status-${status}">${STATUS[status]}</span>
        </div>
        <p class="cliente">${escapar(pedido.nome)} • Turma ${escapar(pedido.turma)}</p>
        <ul class="pedido-itens">
          ${pedido.itens.map((item) => `
            <li><span>${item.quantidade}× ${escapar(item.nome)}</span><span>${dinheiro(item.preco * item.quantidade)}</span></li>
          `).join('')}
        </ul>
        <div class="pedido-rodape">
          <strong>Total: ${dinheiro(pedido.total)}</strong>
          <div class="acoes">
            ${status < STATUS.length - 1
              ? `<button type="button" class="botao-secundario" data-acao="avancar" data-numero="${pedido.numero}">Avançar status →</button>`
              : '<span class="entregue">✅ Entregue</span>'}
            <button type="button" class="botao-texto" data-acao="excluir-pedido" data-numero="${pedido.numero}">Excluir</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function finalizarPedido(evento) {
  evento.preventDefault();

  const itens = itensDoCarrinho();
  if (itens.length === 0) return;

  const nome = el.nome.value.trim();
  const turma = el.turma.value.trim();
  if (!nome || !turma) {
    mostrarMensagem('Preencha seu nome e a turma.');
    return;
  }

  cliente = { nome, turma };
  salvar(CHAVES.cliente, cliente);

  const pedido = {
    numero: proximoNumero(),
    nome,
    turma,
    itens: itens.map(({ item, quantidade }) => ({
      nome: item.nome,
      quantidade,
      preco: item.preco
    })),
    total: totalCarrinho(),
    status: 0,
    data: new Date().toLocaleString('pt-BR')
  };

  pedidos.unshift(pedido);
  carrinho = {};
  salvar(CHAVES.pedidos, pedidos);
  salvar(CHAVES.carrinho, carrinho);

  renderizarTudo();
  fecharCarrinho();
  mostrarMensagem(`Pedido #${pedido.numero} enviado com sucesso!`);
  $('#pedidos').scrollIntoView({ behavior: 'smooth' });
}

// ---------- Gerenciamento do cardápio ----------

function renderizarItensPersonalizados() {
  const personalizados = cardapio.filter((item) => item.id.startsWith('custom-'));

  if (personalizados.length === 0) {
    el.listaCustom.innerHTML = '<small style="color:#78716c">Nenhum item personalizado ainda.</small>';
    return;
  }

  el.listaCustom.innerHTML = personalizados.map((item) => `
    <span class="chip">${escapar(item.emoji)} ${escapar(item.nome)}
      <button type="button" data-acao="remover-item" data-id="${escapar(item.id)}" aria-label="Remover item do cardápio">✕</button>
    </span>
  `).join('');
}

function adicionarItemPersonalizado(evento) {
  evento.preventDefault();

  const nome = el.itemNome.value.trim();
  const preco = Number(el.itemPreco.value);

  if (!nome || !Number.isFinite(preco) || preco <= 0) {
    mostrarMensagem('Informe um nome e um preço válidos.');
    return;
  }

  const novoItem = {
    id: 'custom-' + Date.now(),
    nome,
    descricao: el.itemDescricao.value.trim() || 'Item do cardápio',
    preco,
    categoria: el.itemCategoria.value,
    emoji: el.itemEmoji.value.trim() || '🍽️'
  };

  cardapioCustom.push(novoItem);
  cardapio.push(novoItem);
  salvar(CHAVES.cardapioCustom, cardapioCustom);
  filtroAtual = 'Todos';
  el.formItem.reset();
  renderizarTudo();
  mostrarMensagem('Item adicionado ao cardápio!');
}

// ---------- Renderização geral ----------

function renderizarTudo() {
  renderizarFiltros();
  renderizarCardapio();
  renderizarCarrinho();
  renderizarPedidos();
  renderizarItensPersonalizados();
}

// ---------- Eventos ----------

// Um único ouvinte cuida de todos os botões criados dinamicamente.
document.addEventListener('click', (evento) => {
  const botao = evento.target.closest('[data-acao]');
  if (!botao) return;

  const acao = botao.dataset.acao;
  const id = botao.dataset.id;
  const numero = Number(botao.dataset.numero);

  if (acao === 'filtrar') {
    filtroAtual = botao.dataset.categoria;
    renderizarFiltros();
    renderizarCardapio();
  }

  if (acao === 'adicionar') {
    carrinho[id] = (carrinho[id] || 0) + 1;
    salvar(CHAVES.carrinho, carrinho);
    renderizarCarrinho();
    mostrarMensagem('Adicionado ao carrinho!');
  }

  if (acao === 'aumentar') alterarQuantidade(id, 1);
  if (acao === 'diminuir') alterarQuantidade(id, -1);

  if (acao === 'remover') {
    delete carrinho[id];
    salvar(CHAVES.carrinho, carrinho);
    renderizarCarrinho();
  }

  if (acao === 'avancar') {
    const pedido = pedidos.find((item) => item.numero === numero);
    if (pedido && pedido.status < STATUS.length - 1) {
      pedido.status += 1;
      salvar(CHAVES.pedidos, pedidos);
      renderizarPedidos();
      mostrarMensagem(`Pedido #${numero}: ${STATUS[pedido.status]}`);
    }
  }

  if (acao === 'excluir-pedido') {
    pedidos = pedidos.filter((item) => item.numero !== numero);
    salvar(CHAVES.pedidos, pedidos);
    renderizarPedidos();
  }

  if (acao === 'remover-item') {
    cardapioCustom = cardapioCustom.filter((item) => item.id !== id);
    cardapio = cardapio.filter((item) => item.id !== id);
    delete carrinho[id];
    salvar(CHAVES.cardapioCustom, cardapioCustom);
    salvar(CHAVES.carrinho, carrinho);
    renderizarTudo();
  }
});

el.botaoTema.addEventListener('click', () => {
  tema = tema === 'escuro' ? 'claro' : 'escuro';
  salvar(CHAVES.tema, tema);
  aplicarTema();
});

el.abrirCarrinho.addEventListener('click', abrirCarrinho);
el.fecharCarrinho.addEventListener('click', fecharCarrinho);
el.fundo.addEventListener('click', fecharCarrinho);
document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape') fecharCarrinho();
});

el.formPedido.addEventListener('submit', finalizarPedido);
el.formItem.addEventListener('submit', adicionarItemPersonalizado);

// Lembra nome e turma enquanto a pessoa digita.
[el.nome, el.turma].forEach((campo) => campo.addEventListener('input', () => {
  cliente = { nome: el.nome.value, turma: el.turma.value };
  salvar(CHAVES.cliente, cliente);
}));

el.btnLimpar.addEventListener('click', () => {
  if (!confirm('Apagar os itens personalizados, o carrinho e todos os pedidos salvos?')) return;

  [...Object.values(CHAVES), ...CHAVES_ANTIGAS].forEach((chave) => localStorage.removeItem(chave));
  cardapioCustom = [];
  cardapio = CARDAPIO_PADRAO.slice();
  carrinho = {};
  pedidos = [];
  cliente = { nome: '', turma: '' };
  tema = 'claro';
  el.nome.value = '';
  el.turma.value = '';
  filtroAtual = 'Todos';
  aplicarTema();
  renderizarTudo();
  mostrarMensagem('Dados apagados. Cardápio original restaurado.');
});

// ---------- Início ----------
el.nome.value = cliente.nome || '';
el.turma.value = cliente.turma || '';
aplicarTema();
renderizarTudo();
