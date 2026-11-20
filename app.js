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
  contas: 'cantina.contas',
  historicoLogin: 'cantina.historico.login',
  sessao: 'cantina.sessao',
  carrinho: 'cantina.carrinho',
  pedidos: 'cantina.pedidos',
  cliente: 'cantina.cliente',
  tema: 'cantina.tema'
};

// Chaves usadas por versões antigas do app (apagadas ao limpar os dados).
const CHAVES_ANTIGAS = ['cantina.cardapio', 'cantina.cardapio.v2', 'cantina.usuarios'];

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

// Turmas disponíveis nos formulários (do 6º ano ao 1º ano).
const TURMAS = [
  '6º A', '6º B', '6º C',
  '7º A', '7º B', '7º C',
  '8º A', '8º B', '8º C',
  '9º A', '9º B', '9º C',
  '1º ADM', '1º DSB'
];

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
  navConta: $('#nav-conta'),
  btnSairTopo: $('#btn-sair-topo'),
  authAbas: $('#auth-abas'),
  abaLogin: $('#aba-login'),
  abaCriar: $('#aba-criar'),
  formLogin: $('#form-login'),
  formCriar: $('#form-criar'),
  loginEmail: $('#login-email'),
  loginSenha: $('#login-senha'),
  codigoLogin: $('#codigo-login'),
  loginCodigo: $('#login-codigo'),
  linkCodigoGmail: $('#link-codigo-gmail'),
  btnConfirmarCodigo: $('#btn-confirmar-codigo'),
  btnCancelarCodigo: $('#btn-cancelar-codigo'),
  criarNome: $('#criar-nome'),
  criarTurma: $('#criar-turma'),
  criarEmail: $('#criar-email'),
  criarNascimento: $('#criar-nascimento'),
  criarMaior: $('#criar-maior'),
  criarSenha: $('#criar-senha'),
  campoTurma: $('#campo-turma'),
  camposAdmin: $('#campos-admin'),
  campoSenhaCriar: $('#campo-senha-criar'),
  senhaGerada: $('#senha-gerada'),
  linkGmail: $('#link-gmail'),
  authLogado: $('#auth-logado'),
  historicoLogin: $('#historico-login'),
  listaHistorico: $('#lista-historico'),
  btnLimparHistorico: $('#btn-limpar-historico'),
  nomeLogado: $('#nome-logado'),
  tipoLogado: $('#tipo-logado'),
  btnSair: $('#btn-sair'),
  secaoAdmin: $('#admin'),
  adminConteudo: $('#admin-conteudo'),
  btnLimpar: $('#btn-limpar'),
  toast: $('#toast')
};

// Preenche os dois seletores de turma com a mesma lista.
// Valores antigos que não estejam na lista continuam aparecendo, para não perder dados.
function preencherTurmas() {
  const salvos = [cliente.turma, ...contas.map((conta) => conta.turma)]
    .filter(Boolean)
    .map(String);
  const opcoes = [...new Set([...TURMAS, ...salvos])];

  [el.turma, el.criarTurma].forEach((select) => {
    if (!select) return;
    const atual = select.value;
    select.innerHTML = '<option value="">Escolha a turma</option>'
      + opcoes.map((turma) => `<option value="${escapar(turma)}">${escapar(turma)}</option>`).join('');
    if (atual) select.value = atual;
  });
}

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

// Hash simples para não guardar a senha em texto puro no navegador.
// Atenção: isto não é segurança de verdade — serve só para o projeto local.
function hashSenha(senha) {
  let hash = 5381;
  for (let i = 0; i < senha.length; i += 1) {
    hash = ((hash << 5) + hash + senha.charCodeAt(i)) | 0;
  }
  return String(hash);
}

function emailValido(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function tipoSelecionado(nomeDoGrupo) {
  const marcado = document.querySelector(`input[name="${nomeDoGrupo}"]:checked`);
  return marcado ? marcado.value : 'cliente';
}

// Calcula a idade completa a partir da data de nascimento (aaaa-mm-dd).
function idadeEmAnos(dataNascimento) {
  const nascimento = new Date(`${dataNascimento}T00:00:00`);
  if (!dataNascimento || Number.isNaN(nascimento.getTime())) return -1;
  const hoje = new Date();
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const diferencaMeses = hoje.getMonth() - nascimento.getMonth();
  if (diferencaMeses < 0 || (diferencaMeses === 0 && hoje.getDate() < nascimento.getDate())) {
    idade -= 1;
  }
  return idade;
}

// Gera uma senha ou um código de acesso com somente números (6 dígitos).
function gerarSenha() {
  const valores = new Uint32Array(6);
  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(valores);
  } else {
    for (let i = 0; i < valores.length; i += 1) valores[i] = Math.floor(Math.random() * 10);
  }
  return Array.from(valores, (valor) => String(valor % 10)).join('');
}

// Monta o link do Gmail com o e-mail já preenchido para a pessoa enviar para si mesma.
function linkGmail(email, nome, senha) {
  const assunto = 'Sua senha de administrador - Cantina do Kennedy';
  const corpo = `Olá, ${nome}!\n\nSua senha de administrador da Cantina do Kennedy é:\n\n${senha}\n\nGuarde esta senha para entrar no site.\n`;
  return 'https://mail.google.com/mail/?view=cm&fs=1'
    + `&to=${encodeURIComponent(email)}`
    + `&su=${encodeURIComponent(assunto)}`
    + `&body=${encodeURIComponent(corpo)}`;
}

// Monta o e-mail do Gmail com o código usado na segunda etapa do login.
function linkGmailCodigo(email, nome, codigo) {
  const assunto = 'Código para entrar - Cantina do Kennedy';
  const corpo = `Olá, ${nome}!\n\nSeu código para entrar na Cantina do Kennedy é:\n\n${codigo}\n\nDigite este código no site depois da senha.\n`;
  return 'https://mail.google.com/mail/?view=cm&fs=1'
    + `&to=${encodeURIComponent(email)}`
    + `&su=${encodeURIComponent(assunto)}`
    + `&body=${encodeURIComponent(corpo)}`;
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

// ---------- Contas: cliente e administrador ----------

function alternarModo(modo) {
  const criando = modo === 'criar';
  modoAuth = modo;
  el.formLogin.hidden = criando;
  el.formCriar.hidden = !criando;
  el.abaLogin.classList.toggle('ativa', !criando);
  el.abaCriar.classList.toggle('ativa', criando);
  el.abaLogin.setAttribute('aria-selected', String(!criando));
  el.abaCriar.setAttribute('aria-selected', String(criando));
  if (criando) el.senhaGerada.hidden = true;
  el.codigoLogin.hidden = true;
  el.loginCodigo.value = '';
  codigoPendente = null;
}

function atualizarCamposCriacao() {
  const admin = tipoSelecionado('tipo-criar') === 'admin';
  el.camposAdmin.hidden = !admin;
  el.campoTurma.hidden = admin;
  el.campoSenhaCriar.hidden = admin;
  el.criarNascimento.required = admin;
  el.criarTurma.required = !admin;
  el.criarSenha.required = !admin;
}

function renderizarAdmin() {
  const logado = Boolean(sessao);
  const admin = logado && sessao.tipo === 'admin';

  el.authAbas.hidden = logado;
  el.formLogin.hidden = logado || modoAuth !== 'login';
  el.formCriar.hidden = logado || modoAuth !== 'criar';
  el.authLogado.hidden = !logado;
  el.secaoAdmin.hidden = !admin;
  el.adminConteudo.hidden = !admin;

  el.navConta.textContent = logado ? `👤 ${sessao.nome}` : '🔑 Entrar / Criar conta';
  el.btnSairTopo.hidden = !logado;

  if (logado) {
    el.nomeLogado.textContent = sessao.nome;
    el.tipoLogado.textContent = admin ? '(administrador)' : '(cliente)';
  }
}

// Guarda no dispositivo os logins feitos com sucesso (nunca senha ou código).
function registrarLogin(conta) {
  const entrada = {
    nome: conta.nome,
    email: conta.email,
    tipo: conta.tipo,
    data: new Date().toISOString()
  };
  historicoLogin = [entrada, ...historicoLogin].slice(0, 30);
  salvar(CHAVES.historicoLogin, historicoLogin);
}

function renderizarHistorico() {
  el.historicoLogin.hidden = historicoLogin.length === 0;
  el.listaHistorico.innerHTML = historicoLogin.map((entrada) => {
    const data = new Date(entrada.data);
    const quando = Number.isNaN(data.getTime())
      ? ''
      : data.toLocaleString('pt-BR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    const tipo = entrada.tipo === 'admin' ? 'administrador' : 'cliente';
    return '<div class="item-historico">'
      + `<span><strong>${escapar(entrada.nome)}</strong> <small>(${tipo})</small></span>`
      + `<small>${escapar(entrada.email)} • ${escapar(quando)}</small>`
      + '</div>';
  }).join('');
}

function criarConta(evento) {
  evento.preventDefault();

  const tipo = tipoSelecionado('tipo-criar');
  const nome = el.criarNome.value.trim();
  const email = el.criarEmail.value.trim().toLowerCase();

  if (!nome || !emailValido(email)) {
    mostrarMensagem('Informe seu nome e um e-mail válidos.');
    return;
  }
  if (contas.some((conta) => conta.email === email)) {
    mostrarMensagem('Já existe uma conta com esse e-mail. Vá em “Entrar”.');
    return;
  }

  const conta = { tipo, nome, email, turma: '' };
  let senha;

  if (tipo === 'admin') {
    const idade = idadeEmAnos(el.criarNascimento.value);
    if (idade < 0) {
      mostrarMensagem('Informe uma data de nascimento válida.');
      return;
    }
    if (idade < 18) {
      mostrarMensagem('Você precisa ter mais de 18 anos para criar uma conta de administrador.');
      return;
    }
    if (!el.criarMaior.checked) {
      mostrarMensagem('Confirme que você tem mais de 18 anos.');
      return;
    }
    senha = gerarSenha();
    senhaPendente = { email, nome, senha };
    el.senhaGerada.hidden = false;
    window.open(linkGmail(email, nome, senha), '_blank', 'noopener');
  } else {
    senha = el.criarSenha.value;
    if (!/^\d{4,}$/.test(senha)) {
      mostrarMensagem('Crie uma senha usando somente números (pelo menos 4 dígitos).');
      return;
    }
    conta.turma = el.criarTurma.value.trim();
  }

  conta.senha = hashSenha(senha);
  contas.push(conta);
  salvar(CHAVES.contas, contas);

  el.formCriar.reset();
  atualizarCamposCriacao();

  if (tipo === 'cliente') {
    alternarModo('login');
    sessao = { tipo: 'cliente', nome, email };
    salvar(CHAVES.sessao, sessao);
    registrarLogin(conta);
    cliente = { nome, turma: conta.turma };
    salvar(CHAVES.cliente, cliente);
    el.nome.value = nome;
    el.turma.value = conta.turma;
    mostrarMensagem('Conta de cliente criada! Você já está logado.');
  } else {
    el.loginEmail.value = email;
    el.loginSenha.value = '';
    const opcaoAdmin = document.querySelector('input[name="tipo-login"][value="admin"]');
    if (opcaoAdmin) opcaoAdmin.checked = true;
    alternarModo('login');
    el.loginSenha.focus();
    mostrarMensagem('Conta criada! Envie o e-mail pelo Gmail e entre com a senha gerada.');
  }

  renderizarTudo();
}

function entrar(evento) {
  evento.preventDefault();

  const tipo = tipoSelecionado('tipo-login');
  const email = el.loginEmail.value.trim().toLowerCase();
  const senha = el.loginSenha.value;
  const conta = contas.find((item) =>
    item.email === email && item.tipo === tipo && item.senha === hashSenha(senha));

  if (!conta) {
    mostrarMensagem(tipo === 'admin'
      ? 'E-mail ou senha de administrador incorretos.'
      : 'E-mail ou senha incorretos.');
    return;
  }

  // Senha correta: agora vem a etapa extra com o código enviado pelo Gmail.
  const codigo = gerarSenha();
  codigoPendente = { conta, codigo };
  el.formLogin.hidden = true;
  el.codigoLogin.hidden = false;
  el.loginCodigo.value = '';
  window.open(linkGmailCodigo(conta.email, conta.nome, codigo), '_blank', 'noopener');
  mostrarMensagem('Código gerado! Envie o e-mail no Gmail, copie o código e confirme aqui.');
  el.loginCodigo.focus();
}

function confirmarCodigo() {
  if (!codigoPendente) {
    mostrarMensagem('Digite e-mail e senha para receber um código.');
    return;
  }
  if (el.loginCodigo.value.trim() !== codigoPendente.codigo) {
    mostrarMensagem('Código incorreto. Confira o e-mail no Gmail e tente de novo.');
    return;
  }

  const conta = codigoPendente.conta;
  sessao = { tipo: conta.tipo, nome: conta.nome, email: conta.email };
  salvar(CHAVES.sessao, sessao);
  registrarLogin(conta);

  if (conta.tipo === 'cliente') {
    cliente = { nome: conta.nome, turma: conta.turma || '' };
    salvar(CHAVES.cliente, cliente);
    el.nome.value = cliente.nome;
    el.turma.value = cliente.turma;
  }

  el.loginSenha.value = '';
  el.loginCodigo.value = '';
  el.senhaGerada.hidden = true;
  el.codigoLogin.hidden = true;
  senhaPendente = null;
  codigoPendente = null;
  renderizarTudo();
  mostrarMensagem(`Bem-vindo(a), ${conta.nome}!`);
}

function cancelarCodigo() {
  codigoPendente = null;
  el.loginCodigo.value = '';
  el.codigoLogin.hidden = true;
  el.formLogin.hidden = false;
  mostrarMensagem('Login cancelado. Digite e-mail e senha para receber um novo código.');
}

function sair() {
  sessao = null;
  salvar(CHAVES.sessao, sessao);
  alternarModo('login');
  el.loginEmail.value = '';
  el.loginSenha.value = '';
  el.loginCodigo.value = '';
  el.senhaGerada.hidden = true;
  el.codigoLogin.hidden = true;
  senhaPendente = null;
  codigoPendente = null;
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
let contas = ler(CHAVES.contas, []);
let historicoLogin = ler(CHAVES.historicoLogin, []);
let senhaPendente = null; // senha do admin só na memória, enquanto o e-mail não é enviado
let codigoPendente = null; // código do login só na memória, nunca aparece no site
let modoAuth = 'login';
// Só aceita sessões no formato novo (cliente ou administrador).
let sessao = ler(CHAVES.sessao, null);
if (!sessao || !['cliente', 'admin'].includes(sessao.tipo) || !sessao.email) sessao = null;
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

// Pedidos salvos antes dessa versão podem não ter forma de pagamento.
function pagamentoDoPedido(pedido) {
  return String(pedido.pagamento || '').trim() || 'Não informado';
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
        <p class="pagamento-linha">💰 Pagamento: <strong>${escapar(pagamentoDoPedido(pedido))}</strong></p>
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

  const pagamentoEscolhido = el.formPedido.querySelector('input[name="pagamento"]:checked');
  if (!pagamentoEscolhido) {
    mostrarMensagem('Escolha a forma de pagamento: cartão de débito, cartão de crédito ou dinheiro.');
    return;
  }
  const pagamento = pagamentoEscolhido.value;

  cliente = { nome, turma };
  salvar(CHAVES.cliente, cliente);

  const pedido = {
    numero: proximoNumero(),
    nome,
    turma,
    pagamento,
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
  mostrarMensagem(`Pedido #${pedido.numero} enviado! Pagamento: ${pagamento}.`);
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
  if (!sessao || sessao.tipo !== 'admin') return;

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
  renderizarHistorico();
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
el.formLogin.addEventListener('submit', entrar);
el.formCriar.addEventListener('submit', criarConta);
el.abaLogin.addEventListener('click', () => alternarModo('login'));
el.abaCriar.addEventListener('click', () => {
  senhaPendente = null;
  alternarModo('criar');
});
el.btnSair.addEventListener('click', sair);
el.btnSairTopo.addEventListener('click', sair);
el.btnLimparHistorico.addEventListener('click', () => {
  if (!confirm('Apagar o histórico de login salvo neste dispositivo?')) return;
  historicoLogin = [];
  salvar(CHAVES.historicoLogin, historicoLogin);
  renderizarHistorico();
  mostrarMensagem('Histórico de login apagado.');
});
el.btnCancelarEdicao.addEventListener('click', resetarFormItem);
el.btnConfirmarCodigo.addEventListener('click', confirmarCodigo);
el.btnCancelarCodigo.addEventListener('click', cancelarCodigo);

el.linkGmail.addEventListener('click', (evento) => {
  evento.preventDefault();
  if (!senhaPendente) {
    mostrarMensagem('Abra o e-mail que chegou no seu Gmail para ver a senha.');
    return;
  }
  window.open(
    linkGmail(senhaPendente.email, senhaPendente.nome, senhaPendente.senha),
    '_blank',
    'noopener'
  );
});

el.linkCodigoGmail.addEventListener('click', (evento) => {
  evento.preventDefault();
  if (!codigoPendente) {
    mostrarMensagem('Digite e-mail e senha para receber um código.');
    return;
  }
  window.open(
    linkGmailCodigo(codigoPendente.conta.email, codigoPendente.conta.nome, codigoPendente.codigo),
    '_blank',
    'noopener'
  );
});

document.querySelectorAll('input[name="tipo-criar"]').forEach((radio) => {
  radio.addEventListener('change', atualizarCamposCriacao);
});


// Lembra nome e turma enquanto a pessoa digita.
[el.nome, el.turma].forEach((campo) => campo.addEventListener('input', () => {
  cliente = { nome: el.nome.value, turma: el.turma.value };
  salvar(CHAVES.cliente, cliente);
}));

el.btnLimpar.addEventListener('click', () => {
  if (!confirm('Apagar contas, produtos criados, alterações, estoque, carrinho e todos os pedidos salvos?')) return;

  [...Object.values(CHAVES), ...CHAVES_ANTIGAS].forEach((chave) => localStorage.removeItem(chave));
  cardapioCustom = [];
  cardapioEditados = {};
  cardapioExcluidos = [];
  cardapioEstoque = {};
  contas = [];
  historicoLogin = [];
  sessao = null;
  senhaPendente = null;
  codigoPendente = null;
  carrinho = {};
  pedidos = [];
  cliente = { nome: '', turma: '' };
  tema = 'claro';
  filtroAtual = 'Todos';
  el.formPedido.reset();
  el.formLogin.reset();
  el.formCriar.reset();
  el.loginCodigo.value = '';
  el.senhaGerada.hidden = true;
  el.codigoLogin.hidden = true;
  atualizarCamposCriacao();
  alternarModo('login');
  resetarFormItem();
  recarregarCardapio();
  aplicarTema();
  renderizarTudo();
  mostrarMensagem('Dados apagados. Cardápio original restaurado.');
});

// ---------- Início ----------
if (sessao === null) localStorage.removeItem(CHAVES.sessao);
if (!Array.isArray(contas)) contas = [];
if (!Array.isArray(historicoLogin)) historicoLogin = [];
preencherTurmas();
atualizarCamposCriacao();
el.nome.value = cliente.nome || '';
el.turma.value = cliente.turma || '';
aplicarTema();
renderizarTudo();
