const API_BASE_URL = 'http://localhost:8000/api/doces/';
const PEDIDOS_API_URL = 'http://localhost:8000/api/pedidos/';

function resolverCaminhoImagem(caminho) {
  return caminho;
}

/* ============================================================
   DOCES
   ============================================================ */

async function getDoces() {
  try {
    const resposta = await fetch(API_BASE_URL);
    if (!resposta.ok) throw new Error('Falha ao buscar doces (status ' + resposta.status + ')');
    return await resposta.json();
  } catch (erro) {
    console.error('Erro ao buscar doces na API:', erro);
    return [];
  }
}

async function adicionarDoce(dadosFormulario) {
  try {
    const resposta = await fetch(API_BASE_URL, {
      method: 'POST',
      body: dadosFormulario
    });
    if (!resposta.ok) throw new Error('Falha ao adicionar doce (status ' + resposta.status + ')');
    return await resposta.json();
  } catch (erro) {
    console.error('Erro ao adicionar doce:', erro);
    return null;
  }
}

async function atualizarDoce(id, dadosFormulario) {
  try {
    const resposta = await fetch(API_BASE_URL + id + '/', {
      method: 'PATCH',
      body: dadosFormulario
    });
    if (!resposta.ok) throw new Error('Falha ao atualizar doce (status ' + resposta.status + ')');
    return await resposta.json();
  } catch (erro) {
    console.error('Erro ao atualizar doce:', erro);
    return null;
  }
}

async function removerDoce(id) {
  try {
    const resposta = await fetch(API_BASE_URL + id + '/', { method: 'DELETE' });
    if (!resposta.ok) throw new Error('Falha ao remover doce (status ' + resposta.status + ')');
    return true;
  } catch (erro) {
    console.error('Erro ao remover doce:', erro);
    return false;
  }
}

function criarCardDoce(nome, imagemSrc) {
  const card = document.createElement('div');
  card.className = 'card';

  const img = document.createElement('img');
  img.src = imagemSrc;
  img.alt = nome;

  const titulo = document.createElement('h6');
  titulo.textContent = nome;

  card.appendChild(img);
  card.appendChild(titulo);
  return card;
}

async function renderizarDocesNoSite() {
  const grade = document.querySelector('#doces .grade');
  if (!grade) return;

  grade.innerHTML = '<p style="color:#721d24; grid-column: 1 / -1; text-align:center;">Carregando doces...</p>';

  const lista = await getDoces();
  grade.innerHTML = '';

  if (lista.length === 0) {
    grade.innerHTML = '<p style="color:#721d24; grid-column: 1 / -1; text-align:center;">Nenhum doce cadastrado ainda.</p>';
    return;
  }

  lista.forEach(function (doce) {
    grade.appendChild(criarCardDoce(doce.nome, resolverCaminhoImagem(doce.imagem)));
  });
}

/* ============================================================
   PEDIDOS
   ============================================================ */

async function enviarPedido(dados) {
  try {
    const resposta = await fetch(PEDIDOS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    });
    if (!resposta.ok) throw new Error('Falha ao enviar pedido (status ' + resposta.status + ')');
    return await resposta.json();
  } catch (erro) {
    console.error('Erro ao enviar pedido:', erro);
    return null;
  }
}

async function getPedidos() {
  try {
    const resposta = await fetch(PEDIDOS_API_URL);
    if (!resposta.ok) throw new Error('Falha ao buscar pedidos (status ' + resposta.status + ')');
    return await resposta.json();
  } catch (erro) {
    console.error('Erro ao buscar pedidos na API:', erro);
    return [];
  }
}

async function marcarPedidoAtendido(id, atendido) {
  try {
    const resposta = await fetch(PEDIDOS_API_URL + id + '/', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ atendido: atendido })
    });
    if (!resposta.ok) throw new Error('Falha ao atualizar pedido (status ' + resposta.status + ')');
    return await resposta.json();
  } catch (erro) {
    console.error('Erro ao atualizar pedido:', erro);
    return null;
  }
}

async function removerPedido(id) {
  try {
    const resposta = await fetch(PEDIDOS_API_URL + id + '/', { method: 'DELETE' });
    if (!resposta.ok) throw new Error('Falha ao remover pedido (status ' + resposta.status + ')');
    return true;
  } catch (erro) {
    console.error('Erro ao remover pedido:', erro);
    return false;
  }
}