(function() {

	var form = document.getElementById('form-contato');

	if (!form) {
		return;
	}

	var config = window.BPE_CONTATO || {};
	var sucesso = document.getElementById('contato-sucesso');
	var erro = document.getElementById('contato-erro');

	function mostrar(el) {
		if (!el) {
			return;
		}
		el.hidden = false;
		el.scrollIntoView({ behavior: 'smooth', block: 'center' });
	}

	function esconder(el) {
		if (el) {
			el.hidden = true;
		}
	}

	function valores() {
		return {
			nome: (document.getElementById('contato-nome') || {}).value.trim(),
			email: (document.getElementById('contato-email') || {}).value.trim(),
			assunto: (document.getElementById('contato-assunto') || {}).value.trim(),
			mensagem: (document.getElementById('contato-mensagem') || {}).value.trim()
		};
	}

	function abrirGmailWeb() {
		var v = valores(),
			destino = config.emailDestino || 'bibpadreeuclides@gmail.com',
			assunto = v.assunto || config.assuntoPadrao || 'Contato pelo site',
			corpo = 'Nome: ' + v.nome + '\nE-mail para resposta: ' + v.email + '\n\n' + v.mensagem,
			url = 'https://mail.google.com/mail/?view=cm&fs=1&to='
				+ encodeURIComponent(destino)
				+ '&su=' + encodeURIComponent(assunto)
				+ '&body=' + encodeURIComponent(corpo);

		window.location.href = url;
	}

	form.addEventListener('submit', function(event) {

		event.preventDefault();

		esconder(sucesso);
		esconder(erro);

		var honey = document.getElementById('contato-honey');
		if (honey && honey.value.trim()) {
			return;
		}

		var v = valores();

		if (!v.nome || !v.email || !v.mensagem) {
			window.alert('Por favor, preencha nome, e-mail e mensagem.');
			return;
		}

		var key = (config.web3formsAccessKey || '').trim();
		var submitBtn = form.querySelector('[type="submit"]');

		if (!key) {
			abrirGmailWeb();
			return;
		}

		var data = new FormData();
		data.append('access_key', key);
		data.append('subject', v.assunto || config.assuntoPadrao);
		data.append('from_name', v.nome);
		data.append('name', v.nome);
		data.append('email', v.email);
		data.append('message', v.mensagem);
		data.append('assunto', v.assunto);

		if (submitBtn) {
			submitBtn.disabled = true;
			submitBtn.value = 'Enviando…';
		}

		fetch('https://api.web3forms.com/submit', {
			method: 'POST',
			body: data
		})
			.then(function(res) { return res.json(); })
			.then(function(json) {
				if (submitBtn) {
					submitBtn.disabled = false;
					submitBtn.value = 'Enviar mensagem';
				}
				if (json.success) {
					form.reset();
					mostrar(sucesso);
				} else {
					if (erro) {
						erro.textContent = json.message || 'Não foi possível enviar. Abrindo o Gmail…';
					}
					mostrar(erro);
					window.setTimeout(abrirGmailWeb, 1200);
				}
			})
			.catch(function() {
				if (submitBtn) {
					submitBtn.disabled = false;
					submitBtn.value = 'Enviar mensagem';
				}
				abrirGmailWeb();
			});

	});

})();
