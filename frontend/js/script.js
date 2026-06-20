document.addEventListener('DOMContentLoaded', function () {

  if (typeof renderizarDocesNoSite === 'function') {
    renderizarDocesNoSite();
  }

  var secoes = document.querySelectorAll('section');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visivel');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    secoes.forEach(function (s) { observer.observe(s); });
  } else {
    /* Fallback para navegadores sem suporte */
    secoes.forEach(function (s) { s.classList.add('visivel'); });
  }

  /* ============================================================
   Formulário de pedido
   ============================================================ */

  var form = document.getElementById('form-pedido'); 

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      var msgSucesso = document.getElementById('msg-sucesso'); 
      var msgErro    = document.getElementById('msg-erro'); 

      var dados = {
        nome:     document.getElementById('campo-nome').value.trim(),
        telefone: document.getElementById('campo-telefone').value.trim(),
        email:    document.getElementById('campo-email').value.trim(),
        endereco: document.getElementById('campo-endereco').value.trim(),
        pedido:   document.getElementById('campo-pedido').value.trim()
      };

      if (!dados.nome || !dados.email || !dados.pedido) {
        msgErro.textContent      = '✗ Verifique os campos obrigatórios e tente novamente.';
        msgErro.style.display    = 'block';
        msgSucesso.style.display = 'none';
        return;
      }

      var resultado = await enviarPedido(dados);

      if (!resultado) {
        msgErro.textContent      = '✗ Não foi possível enviar seu pedido. Verifique se o servidor Django está rodando e tente novamente.';
        msgErro.style.display    = 'block';
        msgSucesso.style.display = 'none';
        return;
      }

      msgSucesso.style.display = 'block';
      msgErro.style.display    = 'none';
      form.reset();

      setTimeout(function () {
        msgSucesso.style.display = 'none';
      }, 6000);
    });
  }

});