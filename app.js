'use strict';

/*
  Cantina do Kennedy
  App simples feito só com HTML, CSS e JavaScript.
  Tudo que é salvo fica no navegador (localStorage): não precisa de servidor.
*/

// Chaves usadas para guardar os dados no navegador
const CHAVES = {
  // Os itens padrão vêm do código. As alterações, exclusões e estoque ficam salvos à parte.
  cardapioCustom: 'cantina.cardapio.custom',
  cardapioEditados: 'cantina.cardapio.editados',
  cardapioExcluidos: 'cantina.cardapio.excluidos',
  cardapioEstoque: 'cantina.cardapio.estoque',
  usuarios: 'cantina.usuarios',
  sessao: 'cantina.sessao',
  carrinho: 'cantina.carrinho',
  pedidos: 'cantina.pedidos',
  cliente: 'cantina.cliente',
  tema: 'cantina.tema'
};

// Chaves usadas por versões antigas do app (apagadas ao limpar os dados).
const CHAVES_ANTIGAS = ['cantina.cardapio', 'cantina.cardapio.v2'];

// Cardápio inicial (usado na primeira vez que o site é aberto)
const CARDAPIO_PADRAO = [
  { id: 'item-1', nome: 'Hamburgão', descricao: 'Hambúrguer da cantina', preco: 7.5, categoria: 'Lanches', emoji: '🍔', estoque: 20 },
  { id: 'item-2', nome: 'Salgados variados', descricao: 'Escolha o seu salgado favorito', preco: 6.5, categoria: 'Salgados', emoji: '🥟', estoque: 15 },
  { id: 'item-3', nome: 'Água com gás', descricao: 'Garrafa pequena', preco: 2.5, categoria: 'Bebidas', emoji: '💧', estoque: 30 },
  { id: 'item-4', nome: 'Água sem gás', descricao: 'Garrafa pequena', preco: 2.5, categoria: 'Bebidas', emoji: '💧', estoque: 30 },
  { id: 'item-5', nome: 'Barinha de cereais', descricao: 'Crocante e prática', preco: 2.5, categoria: 'Sobremesas', emoji: '🍫', estoque: 25 },
  { id: 'item-6', nome: 'Bolinho', descricao: 'Feito na cantina', preco: 3.5, categoria: 'Sobremesas', emoji: '🧁', estoque: 20 },
  { id: 'item-7', nome: 'Todynho', descricao: 'Bebida de chocolate', preco: 1.5, categoria: 'Bebidas', emoji: '🥤', estoque: 40 },
  { id: 'item-8', nome: 'Torrone', descricao: 'Doce de amendoim', preco: 1.5, categoria: 'Sobremesas', emoji: '🍬', estoque: 20 },
  { id: 'item-9', nome: 'Iogurte', descricao: 'Copo individual', preco: 5.5, categoria: 'Sobremesas', emoji: '🥛', estoque: 15 },
  { id: 'item-10', nome: 'Suco pequeno', descricao: 'Caixinha individual', preco: 4, categoria: 'Bebidas', emoji: '🧃', estoque: 30 },
  { id: 'item-11', nome: 'Leite fermentado', descricao: 'Garrafinha individual', preco: 5, categoria: 'Bebidas', emoji: '🥛', estoque: 20 }
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
  resumoPessoas: $('#resumo-pessoas'),
  listaPessoas: $('#lista-pessoas'),
  formItem: $('#form-item'),
  itemNome: $('#item-nome'),
  itemDescricao: $('#item-descricao'),
  itemPreco: $('#item-preco'),
  itemEstoque: $('#item-estoque'),
  itemCategoria: $('#item-categoria'),
  itemEmoji: $('#item-emoji'),
  btnSalvarItem: $('#btn-salvar-item'),
  btnCancelarEdicao: $('#btn-cancelar-edicao'),
  listaCustom: $('#lista-custom'),
  formAuth: $('#form-auth'),
  authUsuario: $('#auth-usuario'),
  authSenha: $('#auth-senha'),
  authConfirmar: $('#auth-confirmar'),
  campoConfirmar: $('#campo-confirmar'),
  btnEntrar: $('#btn-entrar'),
  authLogado: $('#auth-logado'),
  nomeLogado: $('#nome-logado'),
  btnSair: $('#btn-sair'),
  adminConteudo: $('#admin-conteudo'),
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

// ---------- Cardápio: alterações, exclusões e estoque ----------

function montarCardapio() {
  const itens = [...CARDAPIO_PADRAO, ...cardapioCustom]
    .filter((item) => !cardapioExcluidos.includes(item.id));

  return itens.map((item) => {
    const editado = cardapioEditados[item.id] || {};
    const final = { ...item, ...editado };
    if (Object.prototype.hasOwnProperty.call(cardapioEstoque, item.id)) {
      final.estoque = cardapioEstoque[item.id];
    }
    return { ...final, estoque: Number(final.estoque) || 0 };
  });
}

function salvarCardapio() {
  salvar(CHAVES.cardapioCustom, cardapioCustom);
  salvar(CHAVES.cardapioEditados, cardapioEditados);
  salvar(CHAVES.cardapioExcluidos, cardapioExcluidos);
  salvar(CHAVES.cardapioEstoque, cardapioEstoque);
}

function recarregarCardapio() {
  cardapio = montarCardapio();
}

function darBaixaNoEstoque(itens) {
  itens.forEach(({ item, quantidade }) => {
    const atual = Number(cardapioEstoque[item.id] ?? item.estoque) || 0;
    cardapioEstoque[item.id] = Math.max(0, atual - quantidade);
  });
  salvar(CHAVES.cardapioEstoque, cardapioEstoque);
  recarregarCardapio();
}

// ---------- Login do responsável ----------

// Hash simples para não guardar a senha em texto puro.
// Atenção: isto não é segurança de verdade — tudo fica neste navegador.
function hashSenha(senha) {
  let hash = 5381;
  for (let i = 0; i < senha.length; i += 1) {
    hash = ((hash << 5) + hash + senha.charCodeAt(i)) | 0;
  }
  return String(hash);
}

function renderizarAdmin() {
  const logado = Boolean(sessao);
  el.formAuth.hidden = logado;
  el.authLogado.hidden = !logado;
  el.adminConteudo.hidden = !logado;
  if (logado) el.nomeLogado.textContent = sessao;
}

function limparCamposAuth() {
  el.authUsuario.value = '';
  el.authSenha.value = '';
  el.authConfirmar.value = '';
}

function criarConta(evento) {
  evento.preventDefault();

  const usuario = el.authUsuario.value.trim();
  const senha = el.authSenha.value;
  const confirmar = el.authConfirmar.value;

  if (!usuario || senha.length < 4) {
    mostrarMensagem('Use um usuário e uma senha com pelo menos 4 caracteres.');
    return;
  }
  if (senha !== confirmar) {
    mostrarMensagem('As senhas não são iguais.');
    return;
  }
  if (usuarios.some((conta) => conta.usuario.toLowerCase() === usuario.toLowerCase())) {
    mostrarMensagem('Esse usuário já existe. Clique em Entrar.');
    return;
  }

  usuarios.push({ usuario, senha: hashSenha(senha) });
  sessao = usuario;
  salvar(CHAVES.usuarios, usuarios);
  salvar(CHAVES.sessao, sessao);
  limparCamposAuth();
  renderizarTudo();
  mostrarMensagem('Conta criada! Você já está logado.');
}

function entrar() {
  const usuario = el.authUsuario.value.trim();
  const senha = el.authSenha.value;
  const conta = usuarios.find((item) =>
    item.usuario.toLowerCase() === usuario.toLowerCase() && item.senha === hashSenha(senha));

  if (!conta) {
    mostrarMensagem('Usuário ou senha incorretos.');
    return;
  }

  sessao = conta.usuario;
  salvar(CHAVES.sessao, sessao);
  limparCamposAuth();
  renderizarTudo();
  mostrarMensagem(`Bem-vindo, ${sessao}!`);
}

function sair() {
  sessao = null;
  salvar(CHAVES.sessao, sessao);
  renderizarTudo();
  mostrarMensagem('Você saiu da conta.');
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
let cardapioEditados = ler(CHAVES.cardapioEditados, {});
let cardapioExcluidos = ler(CHAVES.cardapioExcluidos, []);
let cardapioEstoque = ler(CHAVES.cardapioEstoque, {});
let usuarios = ler(CHAVES.usuarios, []);
let sessao = ler(CHAVES.sessao, null);
let editandoId = null;
let carrinho = ler(CHAVES.carrinho, {}); // objeto: { "id-do-item": quantidade }
let pedidos = ler(CHAVES.pedidos, []);
let cliente = ler(CHAVES.cliente, { nome: '', turma: '' });
let tema = ler(CHAVES.tema, 'claro');
let filtroAtual = 'Todos';
let cardapio = montarCardapio();

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

  el.grade.innerHTML = itens.map((item) => {
    const estoque = Number(item.estoque) || 0;
    const esgotado = estoque === 0;
    return `
    <article class="item-card">
      <div class="item-emoji">${escapar(item.emoji)}</div>
      <div class="item-info">
        <span class="item-categoria">${escapar(item.categoria)}</span>
        <h3>${escapar(item.nome)}</h3>
        <p>${escapar(item.descricao)}</p>
      </div>
      <div class="item-bottom">
        <div>
          <strong class="preco">${dinheiro(item.preco)}</strong>
          <span class="item-estoque ${esgotado ? 'esgotado' : ''}">${esgotado ? 'Esgotado' : `Estoque: ${estoque}`}</span>
        </div>
        <button type="button" class="botao-primario botao-pequeno"
                data-acao="adicionar" data-id="${escapar(item.id)}" ${esgotado ? 'disabled' : ''}>${esgotado ? 'Esgotado' : 'Adicionar +'}</button>
      </div>
    </article>`;
  }).join('');
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
        <small>${dinheiro(item.preco)} cada • estoque: ${Number(item.estoque) || 0}</small>
      </div>
      <div class="controles">
        <button type="button" data-acao="diminuir" data-id="${escapar(item.id)}" aria-label="Diminuir quantidade">−</button>
        <span class="quantidade">${quantidade}</span>
        <button type="button" data-acao="aumentar" data-id="${escapar(item.id)}" aria-label="Aumentar quantidade" ${quantidade >= (Number(item.estoque) || 0) ? 'disabled' : ''}>+</button>
        <button type="button" class="remover" data-acao="remover" data-id="${escapar(item.id)}" aria-label="Remover item">✕</button>
      </div>
    </div>
  `).join('');
}

function alterarQuantidade(id, delta) {
  const item = cardapio.find((produto) => produto.id === id);
  const novaQuantidade = (carrinho[id] || 0) + delta;

  if (item && novaQuantidade > (Number(item.estoque) || 0)) {
    mostrarMensagem(`Só há ${item.estoque} unidades de ${item.nome} no estoque.`);
    return;
  }

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

// Agrupa os pedidos por pessoa (nome + turma) para mostrar quem já pediu neste navegador.
function renderizarPessoas() {
  const pessoasMap = new Map();

  pedidos.forEach((pedido) => {
    const nome = String(pedido.nome || '').trim();
    const turma = String(pedido.turma || '').trim();
    const chave = `${nome.toLowerCase()}|${turma.toLowerCase()}`;

    if (!pessoasMap.has(chave)) {
      pessoasMap.set(chave, { nome, turma, pedidos: 0, total: 0, ultimo: pedido.data });
    }

    const pessoa = pessoasMap.get(chave);
    pessoa.pedidos += 1;
    pessoa.total += Number(pedido.total) || 0;
  });

  const pessoas = [...pessoasMap.values()].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'));

  if (pessoas.length === 0) {
    el.resumoPessoas.textContent = 'Nenhuma pessoa ainda.';
    el.listaPessoas.innerHTML = '<p class="vazio">As pessoas aparecerão aqui quando fizerem um pedido.</p>';
    return;
  }

  el.resumoPessoas.textContent = `${pessoas.length} ${pessoas.length === 1 ? 'pessoa já pediu' : 'pessoas já pediram'} neste navegador.`;

  el.listaPessoas.innerHTML = pessoas.map((pessoa) => `
    <article class="pessoa-card">
      <h3>${escapar(pessoa.nome)}</h3>
      <span class="pessoa-turma">Turma ${escapar(pessoa.turma)}</span>
      <div class="pessoa-linha"><span>Pedidos:</span><strong>${pessoa.pedidos}</strong></div>
      <div class="pessoa-linha"><span>Total gasto:</span><strong>${dinheiro(pessoa.total)}</strong></div>
      <div class="pessoa-linha"><span>Último pedido:</span><strong>${escapar(pessoa.ultimo)}</strong></div>
    </article>
  `).join('');
}

function finalizarPedido(evento) {
  evento.preventDefault();

  const itens = itensDoCarrinho();
  if (itens.length === 0) return;

  for (const { item, quantidade } of itens) {
    if (quantidade > (Number(item.estoque) || 0)) {
      mostrarMensagem(`Sem estoque suficiente de ${item.nome}.`);
      return;
    }
  }

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
  darBaixaNoEstoque(itens);

  renderizarTudo();
  fecharCarrinho();
  mostrarMensagem(`Pedido #${pedido.numero} enviado com sucesso!`);
  $('#pedidos').scrollIntoView({ behavior: 'smooth' });
}

// ---------- Gerenciamento de produtos (CRUD) ----------

function resetarFormItem() {
  editandoId = null;
  el.formItem.reset();
  el.itemEstoque.value = 10;
  el.btnSalvarItem.textContent = 'Adicionar item';
  el.btnCancelarEdicao.hidden = true;
}

function renderizarListaAdmin() {
  if (!sessao) return;

  el.listaCustom.className = 'lista-admin';

  if (cardapio.length === 0) {
    el.listaCustom.innerHTML = '<p class="vazio">Nenhum produto cadastrado.</p>';
    return;
  }

  el.listaCustom.innerHTML = cardapio.map((item) => {
    const estoque = Number(item.estoque) || 0;
    return `
      <div class="produto-admin">
        <div>
          <strong>${escapar(item.emoji)} ${escapar(item.nome)}</strong>
          <small>${escapar(item.categoria)} • ${dinheiro(item.preco)}</small>
        </div>
        <div class="produto-admin-acoes">
          <span class="estoque ${estoque === 0 ? 'estoque-zero' : ''}">Estoque: ${estoque}</span>
          <button type="button" class="botao-secundario" data-acao="editar-item" data-id="${escapar(item.id)}">Editar</button>
          <button type="button" class="botao-texto" data-acao="excluir-item" data-id="${escapar(item.id)}">Excluir</button>
        </div>
      </div>`;
  }).join('');
}

function salvarItemAdmin(evento) {
  evento.preventDefault();

  const nome = el.itemNome.value.trim();
  const preco = Number(el.itemPreco.value);
  const estoque = Number(el.itemEstoque.value);

  if (!nome || !Number.isFinite(preco) || preco <= 0) {
    mostrarMensagem('Informe um nome e um preço válidos.');
    return;
  }
  if (!Number.isInteger(estoque) || estoque < 0) {
    mostrarMensagem('Informe um estoque válido (número inteiro, pode ser 0).');
    return;
  }

  const dados = {
    nome,
    descricao: el.itemDescricao.value.trim() || 'Item do cardápio',
    preco,
    estoque,
    categoria: el.itemCategoria.value,
    emoji: el.itemEmoji.value.trim() || '🍽️'
  };

  if (editandoId) {
    cardapioEditados[editandoId] = { ...(cardapioEditados[editandoId] || {}), ...dados };
    cardapioEstoque[editandoId] = estoque;
    mostrarMensagem('Produto atualizado!');
  } else {
    const id = 'custom-' + Date.now();
    cardapioCustom.push({ id, ...dados });
    cardapioEstoque[id] = estoque;
    filtroAtual = 'Todos';
    mostrarMensagem('Produto adicionado ao cardápio!');
  }

  salvarCardapio();
  recarregarCardapio();
  resetarFormItem();
  renderizarTudo();
}

function prepararEdicao(id) {
  const item = cardapio.find((produto) => produto.id === id);
  if (!item) return;

  editandoId = id;
  el.itemNome.value = item.nome;
  el.itemDescricao.value = item.descricao || '';
  el.itemPreco.value = item.preco;
  el.itemEstoque.value = Number(item.estoque) || 0;
  el.itemCategoria.value = item.categoria;
  el.itemEmoji.value = item.emoji || '🍽️';
  el.btnSalvarItem.textContent = 'Salvar alterações';
  el.btnCancelarEdicao.hidden = false;
  el.formItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
  el.itemNome.focus();
}

function excluirItem(id) {
  const item = cardapio.find((produto) => produto.id === id);
  if (!item) return;
  if (!confirm(`Excluir "${item.nome}" do cardápio?`)) return;

  cardapioCustom = cardapioCustom.filter((produto) => produto.id !== id);
  if (!cardapioExcluidos.includes(id)) cardapioExcluidos.push(id);
  delete cardapioEditados[id];
  delete cardapioEstoque[id];
  delete carrinho[id];

  if (editandoId === id) resetarFormItem();

  salvarCardapio();
  salvar(CHAVES.carrinho, carrinho);
  recarregarCardapio();
  renderizarTudo();
  mostrarMensagem(`${item.nome} foi excluído.`);
}

// ---------- Renderização geral ----------

function renderizarTudo() {
  renderizarFiltros();
  renderizarCardapio();
  renderizarCarrinho();
  renderizarPedidos();
  renderizarPessoas();
  renderizarAdmin();
  renderizarListaAdmin();
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
    const item = cardapio.find((produto) => produto.id === id);
    if (!item) return;
    const quantidade = (carrinho[id] || 0) + 1;
    if (quantidade > (Number(item.estoque) || 0)) {
      mostrarMensagem(`Só há ${item.estoque} unidades de ${item.nome} no estoque.`);
      return;
    }
    carrinho[id] = quantidade;
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

  if (acao === 'editar-item') prepararEdicao(id);
  if (acao === 'excluir-item') excluirItem(id);
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
el.formItem.addEventListener('submit', salvarItemAdmin);
el.formAuth.addEventListener('submit', criarConta);
el.btnEntrar.addEventListener('click', entrar);
el.btnSair.addEventListener('click', sair);
el.btnCancelarEdicao.addEventListener('click', resetarFormItem);

// Lembra nome e turma enquanto a pessoa digita.
[el.nome, el.turma].forEach((campo) => campo.addEventListener('input', () => {
  cliente = { nome: el.nome.value, turma: el.turma.value };
  salvar(CHAVES.cliente, cliente);
}));

el.btnLimpar.addEventListener('click', () => {
  if (!confirm('Apagar produtos criados, alterações, estoque, contas, carrinho e todos os pedidos salvos?')) return;

  [...Object.values(CHAVES), ...CHAVES_ANTIGAS].forEach((chave) => localStorage.removeItem(chave));
  cardapioCustom = [];
  cardapioEditados = {};
  cardapioExcluidos = [];
  cardapioEstoque = {};
  usuarios = [];
  sessao = null;
  carrinho = {};
  pedidos = [];
  cliente = { nome: '', turma: '' };
  tema = 'claro';
  filtroAtual = 'Todos';
  el.nome.value = '';
  el.turma.value = '';
  limparCamposAuth();
  resetarFormItem();
  recarregarCardapio();
  aplicarTema();
  renderizarTudo();
  mostrarMensagem('Dados apagados. Cardápio original restaurado.');
});

// ---------- Início ----------
el.nome.value = cliente.nome || '';
el.turma.value = cliente.turma || '';
aplicarTema();
renderizarTudo();
