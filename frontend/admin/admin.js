document.addEventListener('DOMContentLoaded', function () {

  /* ============================================================
     ELEMENTOS DA TELA DE LOGIN
     ============================================================ */
  var SENHA_ADMIN = 'divinesweets2026'; /* trocar aqui quando quiser mudar a senha */
  var SESSAO_KEY = 'divineSweets_admin_logado';

  var telaLogin = document.getElementById('tela-login');
  var telaAdmin = document.getElementById('tela-admin');
  var formLogin = document.getElementById('form-login');
  var campoSenha = document.getElementById('campo-senha');
  var loginErro = document.getElementById('login-erro');
  var btnSair = document.getElementById('btn-sair');

  /* ============================================================
     ELEMENTOS DAS ABAS (Doces / Pedidos)
     ============================================================ */
  var abaDoces = document.getElementById('aba-doces');
  var abaPedidos = document.getElementById('aba-pedidos');
  var secaoDoces = document.getElementById('secao-doces');
  var secaoPedidos = document.getElementById('secao-pedidos');

  /* ============================================================
     ELEMENTOS DO CRUD DE DOCES
     ============================================================ */
  var grade = document.getElementById('admin-grade');
  var estadoVazio = document.getElementById('estado-vazio');
  var modalForm = document.getElementById('modal-form');
  var formDoce = document.getElementById('form-doce');
  var tituloModal = document.getElementById('titulo-modal');
  var campoId = document.getElementById('campo-id');
  var campoNome = document.getElementById('campo-nome-doce');
  var campoImagem = document.getElementById('campo-imagem-doce');
  var dicaImagem = document.getElementById('dica-imagem');
  var previewImagem = document.getElementById('preview-imagem');
  var btnFecharModal = document.getElementById('btn-fechar-modal');
  var btnCancelarModal = document.getElementById('btn-cancelar-modal');
  var modalConfirmar = document.getElementById('modal-confirmar');
  var nomeDoceConfirmar = document.getElementById('nome-doce-confirmar');
  var btnCancelarRemocao = document.getElementById('btn-cancelar-remocao');
  var btnConfirmarRemocao = document.getElementById('btn-confirmar-remocao');
  var idParaRemover = null;
  var toast = document.getElementById('toast');
  var toastTimeout = null;
  var urlImagemAtual = null;

  /* ============================================================
     ELEMENTOS DA ABA DE PEDIDOS
     ============================================================ */
  var pedidosLista = document.getElementById('pedidos-lista');
  var pedidosVazio = document.getElementById('pedidos-vazio');

  /* ============================================================
     FUNÇÕES DE LOGIN
     ============================================================ */
  function estaLogado() {
    return sessionStorage.getItem(SESSAO_KEY) === 'sim';
  }

  function mostrarAdmin() {
    telaLogin.style.display = 'none';
    telaAdmin.style.display = 'block';
    mostrarAbaDoces();
  }

  function mostrarLogin() {
    telaAdmin.style.display = 'none';
    telaLogin.style.display = 'flex';
    if (campoSenha) {
      campoSenha.value = '';
      campoSenha.focus();
    }
  }

  if (formLogin) {
    formLogin.addEventListener('submit', function (e) {
      e.preventDefault();
      if (campoSenha.value === SENHA_ADMIN) {
        sessionStorage.setItem(SESSAO_KEY, 'sim');
        loginErro.style.display = 'none';
        mostrarAdmin();
      } else {
        loginErro.style.display = 'block';
      }
    });
  }

  if (btnSair) {
    btnSair.addEventListener('click', function () {
      sessionStorage.removeItem(SESSAO_KEY);
      window.location.reload();
    });
  }

  /* ============================================================
     ABAS (Doces / Pedidos)
     ============================================================ */
  function mostrarAbaDoces() {
    abaDoces.classList.add('ativa');
    abaPedidos.classList.remove('ativa');
    secaoDoces.style.display = '';
    secaoPedidos.style.display = 'none';
    renderizarListaAdmin();
  }

  function mostrarAbaPedidos() {
    abaPedidos.classList.add('ativa');
    abaDoces.classList.remove('ativa');
    secaoPedidos.style.display = '';
    secaoDoces.style.display = 'none';
    renderizarListaPedidos();
  }

  if (abaDoces) abaDoces.addEventListener('click', mostrarAbaDoces);
  if (abaPedidos) abaPedidos.addEventListener('click', mostrarAbaPedidos);

  /* ============================================================
     FUNÇÕES DO CRUD DE DOCES
     ============================================================ */
  function mostrarToast(texto, ehErro) {
    toast.textContent = texto;
    toast.classList.toggle('toast-erro', !!ehErro);
    toast.classList.add('mostrar');
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(function () {
      toast.classList.remove('mostrar');
    }, 3200);
  }

  function escaparHTML(texto) {
    var div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
  }

  async function renderizarListaAdmin() {
    grade.innerHTML = '<p style="grid-column: 1 / -1; text-align:center; color:#8a4a52;">Carregando...</p>';
    var lista = await getDoces();
    grade.innerHTML = '';
    estadoVazio.style.display = lista.length === 0 ? 'block' : 'none';

    lista.forEach(function (doce) {
      var card = document.createElement('div');
      card.className = 'admin-card';

      var imagemWrap = document.createElement('div');
      imagemWrap.className = 'imagem-wrap';
      var img = document.createElement('img');
      img.src = doce.imagem;
      img.alt = doce.nome;
      img.onerror = function () {
        imagemWrap.classList.add('sem-imagem');
        imagemWrap.innerHTML = 'Imagem não encontrada<br>' + escaparHTML(doce.imagem || '');
      };
      imagemWrap.appendChild(img);

      var corpo = document.createElement('div');
      corpo.className = 'corpo';
      var titulo = document.createElement('h2');
      titulo.textContent = doce.nome;
      if (doce.padrao) {
        var tagPadrao = document.createElement('span');
        tagPadrao.className = 'tag-padrao';
        tagPadrao.textContent = 'Padrão';
        titulo.appendChild(document.createTextNode(' '));
        titulo.appendChild(tagPadrao);
      }

      var linhaAcoes = document.createElement('div');
      linhaAcoes.className = 'linha-acoes';
      var btnEditar = document.createElement('button');
      btnEditar.type = 'button';
      btnEditar.className = 'btn-texto';
      btnEditar.textContent = 'Editar';
      btnEditar.addEventListener('click', function () { abrirModalEdicao(doce); });

      var btnRemover = document.createElement('button');
      btnRemover.type = 'button';
      btnRemover.className = 'btn-texto';
      btnRemover.textContent = 'Remover';
      btnRemover.addEventListener('click', function () { abrirConfirmacaoRemocao(doce); });

      linhaAcoes.appendChild(btnEditar);
      linhaAcoes.appendChild(btnRemover);
      corpo.appendChild(titulo);
      corpo.appendChild(linhaAcoes);
      card.appendChild(imagemWrap);
      card.appendChild(corpo);
      grade.appendChild(card);
    });

    var cardAdicionar = document.createElement('div');
    cardAdicionar.className = 'admin-card adicionar';
    cardAdicionar.innerHTML =
      '<button type="button" id="btn-abrir-novo">' +
        '<span class="simbolo-mais">+</span>' +
        '<span>Adicionar doce</span>' +
      '</button>';
    grade.appendChild(cardAdicionar);
    document.getElementById('btn-abrir-novo').addEventListener('click', abrirModalNovo);
  }

  function abrirModalNovo() {
    tituloModal.textContent = 'Adicionar doce';
    campoId.value = '';
    campoNome.value = '';
    campoImagem.value = '';
    campoImagem.setAttribute('accept', 'image/*');
    /* Em modo criação, a foto é obrigatória */
    campoImagem.required = true;
    dicaImagem.textContent = 'Escolha uma foto do seu computador.';
    urlImagemAtual = null;
    atualizarPreview();
    abrirModal(modalForm);
    campoNome.focus();
  }

  function abrirModalEdicao(doce) {
    tituloModal.textContent = 'Editar doce';
    campoId.value = doce.id;
    campoNome.value = doce.nome;
    campoImagem.value = '';
    campoImagem.required = false;
    dicaImagem.textContent = 'Deixe em branco para manter a foto atual, ou escolha uma nova.';
    urlImagemAtual = doce.imagem;
    atualizarPreview();
    abrirModal(modalForm);
    campoNome.focus();
  }

  function atualizarPreview() {
    var arquivo = campoImagem.files && campoImagem.files[0];
    if (arquivo) {
      var leitor = new FileReader();
      leitor.onload = function (e) {
        previewImagem.innerHTML = '';
        var img = document.createElement('img');
        img.src = e.target.result;
        img.alt = 'Pré-visualização';
        previewImagem.appendChild(img);
      };
      leitor.readAsDataURL(arquivo);
      return;
    }
    if (urlImagemAtual) {
      previewImagem.innerHTML = '';
      var img = document.createElement('img');
      img.src = urlImagemAtual;
      img.alt = 'Pré-visualização';
      previewImagem.appendChild(img);
      return;
    }
    previewImagem.innerHTML = 'A pré-visualização aparece aqui';
  }

  campoImagem.addEventListener('change', atualizarPreview);

  formDoce.addEventListener('submit', async function (e) {
    e.preventDefault();
    var nome = campoNome.value.trim();
    var arquivo = campoImagem.files && campoImagem.files[0];
    var id = campoId.value;

    if (!nome) {
      mostrarToast('Preencha o nome do doce.', true);
      return;
    }
    if (!id && !arquivo) {
      mostrarToast('Escolha uma foto para o novo doce.', true);
      return;
    }

    var dadosFormulario = new FormData();
    dadosFormulario.append('nome', nome);
    if (arquivo) {
      dadosFormulario.append('imagem', arquivo);
    }

    var resultado;
    if (id) {
      resultado = await atualizarDoce(id, dadosFormulario);
      if (resultado) mostrarToast('Doce atualizado com sucesso.');
    } else {
      resultado = await adicionarDoce(dadosFormulario);
      if (resultado) mostrarToast('Doce adicionado com sucesso.');
    }

    if (!resultado) {
      mostrarToast('Não foi possível salvar. Verifique se o servidor Django está rodando.', true);
      return;
    }

    fecharModal(modalForm);
    renderizarListaAdmin();
  });

  btnFecharModal.addEventListener('click', function () { fecharModal(modalForm); });
  btnCancelarModal.addEventListener('click', function () { fecharModal(modalForm); });

  function abrirConfirmacaoRemocao(doce) {
    idParaRemover = doce.id;
    nomeDoceConfirmar.textContent = doce.nome;
    abrirModal(modalConfirmar);
  }

  btnCancelarRemocao.addEventListener('click', function () {
    idParaRemover = null;
    fecharModal(modalConfirmar);
  });

  btnConfirmarRemocao.addEventListener('click', async function () {
    if (idParaRemover) {
      var sucesso = await removerDoce(idParaRemover);
      mostrarToast(sucesso ? 'Doce removido.' : 'Não foi possível remover o doce.', !sucesso);
      idParaRemover = null;
    }
    fecharModal(modalConfirmar);
    renderizarListaAdmin();
  });

  function abrirModal(modal) { modal.classList.add('aberto'); }
  function fecharModal(modal) { modal.classList.remove('aberto'); }

  [modalForm, modalConfirmar].forEach(function (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === modal) fecharModal(modal);
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      fecharModal(modalForm);
      fecharModal(modalConfirmar);
    }
  });

  /* ============================================================
     FUNÇÕES DA ABA DE PEDIDOS
     ============================================================ */
  function formatarData(isoString) {
    var data = new Date(isoString);
    return data.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
  }

  async function renderizarListaPedidos() {
    pedidosLista.innerHTML = '<p style="grid-column: 1 / -1; text-align:center; color:#8a4a52;">Carregando...</p>';
    var lista = await getPedidos();
    pedidosLista.innerHTML = '';
    pedidosVazio.style.display = lista.length === 0 ? 'block' : 'none';

    lista.forEach(function (pedido) {
      var card = document.createElement('div');
      card.className = 'pedido-card' + (pedido.atendido ? ' atendido' : '');

      var cabecalho = document.createElement('div');
      cabecalho.className = 'pedido-cabecalho';
      var nomeEl = document.createElement('h2');
      nomeEl.textContent = pedido.nome;
      var dataEl = document.createElement('span');
      dataEl.className = 'pedido-data';
      dataEl.textContent = formatarData(pedido.criado_em);
      cabecalho.appendChild(nomeEl);
      cabecalho.appendChild(dataEl);

      var contato = document.createElement('p');
      contato.className = 'pedido-contato';
      contato.textContent = pedido.telefone + ' · ' + pedido.email;

      var endereco = document.createElement('p');
      endereco.className = 'pedido-endereco';
      endereco.textContent = pedido.endereco;

      var descricao = document.createElement('p');
      descricao.className = 'pedido-descricao';
      descricao.textContent = pedido.pedido;

      var linhaAcoes = document.createElement('div');
      linhaAcoes.className = 'linha-acoes';

      var btnAtendido = document.createElement('button');
      btnAtendido.type = 'button';
      btnAtendido.className = 'btn-texto';
      btnAtendido.textContent = pedido.atendido ? 'Marcar como pendente' : 'Marcar como atendido';
      btnAtendido.addEventListener('click', async function () {
        var atualizado = await marcarPedidoAtendido(pedido.id, !pedido.atendido);
        if (atualizado) {
          renderizarListaPedidos();
        } else {
          mostrarToast('Não foi possível atualizar o pedido.', true);
        }
      });

      var btnRemover = document.createElement('button');
      btnRemover.type = 'button';
      btnRemover.className = 'btn-texto';
      btnRemover.textContent = 'Remover';
      btnRemover.addEventListener('click', async function () {
        if (confirm('Remover o pedido de ' + pedido.nome + '?')) {
          var sucesso = await removerPedido(pedido.id);
          mostrarToast(sucesso ? 'Pedido removido.' : 'Não foi possível remover o pedido.', !sucesso);
          renderizarListaPedidos();
        }
      });

      linhaAcoes.appendChild(btnAtendido);
      linhaAcoes.appendChild(btnRemover);

      card.appendChild(cabecalho);
      card.appendChild(contato);
      card.appendChild(endereco);
      card.appendChild(descricao);
      card.appendChild(linhaAcoes);
      pedidosLista.appendChild(card);
    });
  }

  /* ============================================================
     PONTO DE ENTRADA
     ============================================================ */
  if (estaLogado()) {
    mostrarAdmin();
  } else {
    mostrarLogin();
  }

});