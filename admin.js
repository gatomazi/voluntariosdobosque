(function () {
  "use strict";

  const $ = (s) => document.querySelector(s);
  const el = {
    entrar: $("#entrar"), formEntrar: $("#form-entrar"), senha: $("#senha"), erroEntrar: $("#erro-entrar"), btnEntrar: $("#btn-entrar"),
    painel: $("#painel"), carregando: $("#carregando"), sair: $("#sair"), q: $("#q"), novo: $("#novo"), contagem: $("#contagem"), lista: $("#lista"),
    editor: $("#editor"), form: $("#form-contato"), titulo: $("#editor-titulo"),
    nome: $("#f-nome"), detalhe: $("#f-detalhe"), fones: $("#f-fones"), maisFone: $("#f-mais-fone"),
    escolhidas: $("#f-escolhidas"), buscaCat: $("#f-busca-cat"), opcoes: $("#f-opcoes"),
    nova: $("#f-nova"), novaNome: $("#f-nova-nome"), novaGrupo: $("#f-nova-grupo"), criar: $("#f-criar"),
    confirmar: $("#f-confirmar"), erro: $("#f-erro"), salvar: $("#f-salvar"), excluir: $("#f-excluir"),
    aviso: $("#aviso"),
  };

  const IC = {
    x: '<svg viewBox="0 0 24 24"><path d="M7 7l10 10M17 7 7 17"/></svg>',
    mais: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
  };

  const norm = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const coll = new Intl.Collator("pt-BR", { sensitivity: "base" });

  function formatar(t) {
    const ddd = t.slice(0, 2), r = t.slice(2);
    if (r.length === 9) return `(${ddd}) ${r.slice(0, 5)}-${r.slice(5)}`;
    if (r.length === 8) return `(${ddd}) ${r.slice(0, 4)}-${r.slice(4)}`;
    return t.length > 2 ? `(${ddd}) ${r}` : t;
  }
  function digitos(v) {
    let t = String(v || "").replace(/\D/g, "");
    if ((t.length === 12 || t.length === 13) && t.startsWith("55")) t = t.slice(2);
    return t;
  }

  function avisar(texto) {
    el.aviso.textContent = texto;
    el.aviso.hidden = false;
    clearTimeout(avisar.t);
    avisar.t = setTimeout(() => (el.aviso.hidden = true), 2400);
  }

  // ---------- API ----------
  class SemSessao extends Error {}

  async function api(metodo, url, corpo) {
    const r = await fetch(url, {
      method: metodo,
      credentials: "same-origin",
      cache: "no-store",
      headers: corpo ? { "content-type": "application/json" } : {},
      body: corpo ? JSON.stringify(corpo) : undefined,
    });
    let dados = null;
    try { dados = await r.json(); } catch (e) {}
    if (r.status === 401 && url.startsWith("/api/admin")) throw new SemSessao();
    if (!r.ok) throw new Error((dados && dados.erro) || "Não deu certo. Confira a internet e tente de novo.");
    return dados;
  }

  // ---------- estado ----------
  let dados = null;
  let editando = null;          // id do contato aberto, ou null para novo
  let escolhidas = [];          // nomes de categorias
  let novas = [];               // [{ nome, grupo }] criadas neste formulário

  function mostrar(qual) {
    el.carregando.hidden = true;
    el.entrar.hidden = qual !== "entrar";
    el.painel.hidden = qual !== "painel";
    el.sair.hidden = qual !== "painel";
    if (qual === "entrar") setTimeout(() => el.senha.focus(), 50);
  }

  function semSessao() {
    if (el.editor.open) el.editor.close();
    mostrar("entrar");
    el.erroEntrar.textContent = "Sua sessão terminou. Entre de novo.";
    el.erroEntrar.hidden = false;
  }

  async function abrirPainel() {
    dados = await api("GET", "/api/contatos");
    renderLista();
    mostrar("painel");
  }

  // ---------- lista ----------
  function renderLista() {
    const termos = norm(el.q.value).split(/\s+/).filter(Boolean);
    const itens = dados.contatos
      .filter((c) => {
        const alvo = norm([c.n, c.d || "", c.c.join(" "), c.t.join(" ")].join(" "));
        return termos.every((t) => alvo.includes(t));
      })
      .sort((a, b) => coll.compare(a.n, b.n));
    el.contagem.textContent = termos.length
      ? `${itens.length} de ${dados.contatos.length} contatos`
      : `${dados.contatos.length} contatos · atualizado em ${dados.atualizadoEm || "—"}`;
    el.lista.innerHTML = itens.length
      ? itens.map((c) => `<li class="pessoa">
          <button class="quem" type="button" data-id="${esc(c.id)}">
            <span class="nome">${esc(c.n)}${c.d ? ` <span class="sub">· ${esc(c.d)}</span>` : ""}</span>
            <span class="sub"><span class="num">${c.t.map(formatar).join(" · ")}</span></span>
            <span class="cats-linha">${esc(c.c.join(", "))}</span>
            ${c.confirmar ? `<span class="confirmar">Número a confirmar</span>` : ""}
          </button>
        </li>`).join("")
      : `<li class="pessoa"><span class="sub">Nenhum contato com essa busca.</span></li>`;
  }

  // ---------- editor ----------
  function linhaFone(valor) {
    const div = document.createElement("div");
    div.className = "fone-linha";
    div.innerHTML = `<input type="tel" inputmode="tel" autocomplete="off" placeholder="(48) 99999-8888" aria-label="Telefone">
      <button class="ic" type="button" data-tirar-fone aria-label="Tirar este número">${IC.x}</button>`;
    div.querySelector("input").value = valor ? formatar(valor) : "";
    return div;
  }

  function atualizarFones() {
    const linhas = el.fones.querySelectorAll(".fone-linha");
    linhas.forEach((l) => (l.querySelector("[data-tirar-fone]").hidden = linhas.length === 1));
    el.maisFone.hidden = linhas.length >= 3;
  }

  function todasCategorias() {
    return [...Object.keys(dados.categorias), ...novas.map((n) => n.nome)];
  }

  function renderCategorias() {
    el.escolhidas.innerHTML = escolhidas
      .map((cat) => `<button class="cat-chip" type="button" data-tirar-cat="${esc(cat)}" aria-label="Tirar ${esc(cat)}">${esc(cat)}${IC.x}</button>`)
      .join("");
    const termo = norm(el.buscaCat.value.trim());
    const contagem = {};
    dados.contatos.forEach((c) => c.c.forEach((cat) => (contagem[cat] = (contagem[cat] || 0) + 1)));
    const livres = todasCategorias()
      .filter((cat) => !escolhidas.includes(cat) && (!termo || norm(cat).includes(termo)))
      .sort(coll.compare);
    let html = livres
      .map((cat) => `<button class="cat-chip" type="button" data-cat="${esc(cat)}">${IC.mais}${esc(cat)} <small>${contagem[cat] || 0}</small></button>`)
      .join("");
    const existeIgual = todasCategorias().some((cat) => norm(cat) === termo);
    if (termo && !existeIgual) {
      html += `<button class="cat-chip criar" type="button" data-criar>${IC.mais}Criar “${esc(el.buscaCat.value.trim())}”</button>`;
    }
    if (!termo) html = `<span class="cats-linha">Digite para ver as categorias, como “pint” ou “bolo”.</span>`;
    el.opcoes.innerHTML = html;
  }

  function abrirEditor(c) {
    editando = c ? c.id : null;
    novas = [];
    escolhidas = c ? [...c.c] : [];
    el.titulo.textContent = c ? "Editar contato" : "Novo contato";
    el.nome.value = c ? c.n : "";
    el.detalhe.value = c ? c.d || "" : "";
    el.confirmar.checked = !!(c && c.confirmar);
    el.fones.innerHTML = "";
    (c ? c.t : [""]).forEach((t) => el.fones.appendChild(linhaFone(t)));
    atualizarFones();
    el.buscaCat.value = "";
    el.nova.hidden = true;
    el.erro.hidden = true;
    el.excluir.hidden = !c;
    desarmarExcluir();
    renderCategorias();
    el.editor.showModal();
    el.editor.scrollTop = 0;
  }

  function mostrarErro(msg) {
    el.erro.textContent = msg;
    el.erro.hidden = false;
    el.erro.scrollIntoView({ block: "nearest" });
  }

  function desarmarExcluir() {
    el.excluir.classList.remove("armado");
    el.excluir.textContent = "Excluir contato";
  }

  async function salvar() {
    const t = [...el.fones.querySelectorAll("input")].map((i) => digitos(i.value)).filter(Boolean);
    const corpo = {
      n: el.nome.value,
      d: el.detalhe.value,
      t,
      c: escolhidas,
      novas: novas.filter((n) => escolhidas.includes(n.nome)),
      confirmar: el.confirmar.checked,
    };
    if (!corpo.n.trim()) return mostrarErro("Falta o nome.");
    if (!t.length) return mostrarErro("Falta o telefone.");
    if (!escolhidas.length) return mostrarErro("Escolha pelo menos uma categoria.");
    el.salvar.disabled = true;
    el.salvar.textContent = "Salvando…";
    try {
      const r = editando
        ? await api("PUT", `/api/admin/contatos/${encodeURIComponent(editando)}`, corpo)
        : await api("POST", "/api/admin/contatos", corpo);
      dados = r.dados;
      renderLista();
      el.editor.close();
      avisar(editando ? "Contato atualizado" : "Contato incluído");
    } catch (e) {
      if (e instanceof SemSessao) return semSessao();
      mostrarErro(e.message);
    } finally {
      el.salvar.disabled = false;
      el.salvar.textContent = "Salvar";
    }
  }

  async function excluir() {
    if (!el.excluir.classList.contains("armado")) {
      el.excluir.classList.add("armado");
      el.excluir.textContent = "Toque de novo para excluir de vez";
      return;
    }
    el.excluir.disabled = true;
    try {
      const nome = el.nome.value;
      const r = await api("DELETE", `/api/admin/contatos/${encodeURIComponent(editando)}`, {});
      dados = r.dados;
      renderLista();
      el.editor.close();
      avisar(`${nome} foi removido`);
    } catch (e) {
      if (e instanceof SemSessao) return semSessao();
      mostrarErro(e.message);
      desarmarExcluir();
    } finally {
      el.excluir.disabled = false;
    }
  }

  // ---------- eventos ----------
  el.formEntrar.addEventListener("submit", async (e) => {
    e.preventDefault();
    el.erroEntrar.hidden = true;
    if (!el.senha.value) {
      el.erroEntrar.textContent = "Digite a senha.";
      el.erroEntrar.hidden = false;
      return;
    }
    el.btnEntrar.disabled = true;
    el.btnEntrar.textContent = "Entrando…";
    try {
      await api("POST", "/api/login", { senha: el.senha.value });
      el.senha.value = "";
      await abrirPainel();
    } catch (err) {
      el.erroEntrar.textContent = err.message;
      el.erroEntrar.hidden = false;
    } finally {
      el.btnEntrar.disabled = false;
      el.btnEntrar.textContent = "Entrar";
    }
  });

  el.sair.addEventListener("click", async () => {
    try { await api("POST", "/api/logout", {}); } catch (e) {}
    dados = null;
    el.lista.innerHTML = "";
    el.erroEntrar.hidden = true;
    mostrar("entrar");
  });

  el.q.addEventListener("input", renderLista);
  el.novo.addEventListener("click", () => abrirEditor(null));
  el.lista.addEventListener("click", (e) => {
    const b = e.target.closest("[data-id]");
    if (b) abrirEditor(dados.contatos.find((c) => c.id === b.dataset.id));
  });

  el.maisFone.addEventListener("click", () => {
    const linha = linhaFone("");
    el.fones.appendChild(linha);
    atualizarFones();
    linha.querySelector("input").focus();
  });
  el.fones.addEventListener("click", (e) => {
    const b = e.target.closest("[data-tirar-fone]");
    if (b) { b.closest(".fone-linha").remove(); atualizarFones(); }
  });
  el.fones.addEventListener("focusout", (e) => {
    if (e.target.matches("input")) {
      const t = digitos(e.target.value);
      if (t.length >= 10) e.target.value = formatar(t);
    }
  });

  el.buscaCat.addEventListener("input", () => { el.nova.hidden = true; renderCategorias(); });
  el.buscaCat.addEventListener("keydown", (e) => { if (e.key === "Enter") e.preventDefault(); });
  el.escolhidas.addEventListener("click", (e) => {
    const b = e.target.closest("[data-tirar-cat]");
    if (b) { escolhidas = escolhidas.filter((x) => x !== b.dataset.tirarCat); renderCategorias(); }
  });
  el.opcoes.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.hasAttribute("data-criar")) {
      el.novaNome.textContent = `“${el.buscaCat.value.trim()}”`;
      el.novaGrupo.innerHTML = `<option value="">Escolha o tipo…</option>` +
        dados.grupos.map((g) => `<option value="${esc(g.id)}">${esc(g.nome)}</option>`).join("");
      el.nova.hidden = false;
      el.novaGrupo.focus();
      return;
    }
    escolhidas.push(b.dataset.cat);
    el.buscaCat.value = "";
    renderCategorias();
  });
  el.criar.addEventListener("click", () => {
    const nome = el.buscaCat.value.trim().replace(/\s+/g, " ");
    if (!el.novaGrupo.value) { el.novaGrupo.focus(); return; }
    novas.push({ nome, grupo: el.novaGrupo.value });
    escolhidas.push(nome);
    el.buscaCat.value = "";
    el.nova.hidden = true;
    renderCategorias();
  });

  el.form.addEventListener("submit", (e) => { e.preventDefault(); salvar(); });
  el.excluir.addEventListener("click", excluir);
  el.editor.addEventListener("click", (e) => {
    if (e.target === el.editor || e.target.closest("[data-fechar]")) el.editor.close();
  });

  // ---------- início ----------
  (async () => {
    try {
      await api("GET", "/api/admin/sessao");
      await abrirPainel();
    } catch (e) {
      if (e instanceof SemSessao) mostrar("entrar");
      else { mostrar("entrar"); el.erroEntrar.textContent = e.message; el.erroEntrar.hidden = false; }
    }
  })();
})();
