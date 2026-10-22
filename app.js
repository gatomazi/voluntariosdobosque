(function () {
  "use strict";

  const CONTATOS = window.CONTATOS || [];
  const CATEGORIAS = window.CATEGORIAS || {};
  const GRUPOS = window.GRUPOS || [];
  const UTILIDADES = window.UTILIDADES || [];
  const VOLUNTARIOS = window.VOLUNTARIOS || null;
  const MSG_ZAP = "Olá! Peguei seu contato no catálogo do Bosque da Mata e BR Felice.";
  const CHAVE_SALVOS = "catalogo-bosque:salvos";

  const $ = (s) => document.querySelector(s);
  const el = {
    q: $("#q"), limpar: $("#limpar"), atalhos: $("#atalhos"), conteudo: $("#conteudo"),
    atualizado: $("#atualizado"), aviso: $("#aviso"),
    folha: $("#folha"), folhaNome: $("#folha-nome"), folhaSub: $("#folha-sub"), folhaCorpo: $("#folha-corpo"),
  };

  const IC = {
    zap: '<svg viewBox="0 0 24 24"><path d="M4 20l1.3-3.9A8 8 0 1 1 8 19.1L4 20z"/><path d="M9.5 9.5c.3 1.6 1.9 3.6 4 4.4l1-1 1.8.8-.4 1.4c-3.5.4-7.4-3.6-7-7l1.4-.4.8 1.8-1 1z"/></svg>',
    fone: '<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
    estrela: '<svg viewBox="0 0 24 24"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2L12 17.3 6.4 20.2l1.1-6.2L3 9.6l6.2-.9z"/></svg>',
    copiar: '<svg viewBox="0 0 24 24"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h9"/></svg>',
    agenda: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0M19 3v6M16 6h6"/></svg>',
    enviar: '<svg viewBox="0 0 24 24"><path d="M12 3v12M7 8l5-5 5 5M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/></svg>',
    insta: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/></svg>',
    cidade: '<svg viewBox="0 0 24 24"><path d="M3 21h18M5 21V9l7-5 7 5v12M9 21v-6h6v6"/></svg>',
    info: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.01"/></svg>',
    seta: '<svg class="seta" viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>',
  };

  // ---------- utilidades ----------
  const norm = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const slug = (s) => "c-" + norm(s).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const coll = new Intl.Collator("pt-BR", { sensitivity: "base" });

  function formatar(t) {
    const ddd = t.slice(0, 2), r = t.slice(2);
    if (r.length === 9) return `(${ddd}) ${r.slice(0, 5)}-${r.slice(5)}`;
    if (r.length === 8) return `(${ddd}) ${r.slice(0, 4)}-${r.slice(4)}`;
    if (r.length === 7) return `(${ddd}) ${r.slice(0, 3)}-${r.slice(3)}`;
    return `(${ddd}) ${r}`;
  }
  const ehCelular = (t) => t.length === 11 && t[2] === "9";
  const ehFixo = (t) => t.length === 10 && /[2-5]/.test(t[2]);
  const discavel = (c, t) => !c.confirmar && (ehCelular(t) || ehFixo(t));
  const linkZap = (t) => `https://wa.me/55${t}?text=${encodeURIComponent(MSG_ZAP)}`;

  function avisar(texto) {
    el.aviso.textContent = texto;
    el.aviso.hidden = false;
    clearTimeout(avisar.t);
    avisar.t = setTimeout(() => (el.aviso.hidden = true), 2200);
  }

  async function copiar(texto, msg) {
    try {
      await navigator.clipboard.writeText(texto);
      avisar(msg || "Copiado");
    } catch (e) {
      avisar("Não deu para copiar. Toque e segure o número.");
    }
  }

  async function compartilhar(dados, textoCopia) {
    if (navigator.share) {
      try { await navigator.share(dados); return; } catch (e) { if (e && e.name === "AbortError") return; }
    }
    copiar(textoCopia, "Copiado. É só colar no WhatsApp.");
  }

  // ---------- dados ----------
  CONTATOS.forEach((c, i) => {
    c.id = i;
    c.chave = c.n + "|" + c.t[0];
    c.busca = norm([c.n, c.d || "", c.c.join(" ")].join(" "));
    c.digitos = c.t.join(" ");
  });

  const porCategoria = {};
  CONTATOS.forEach((c) => c.c.forEach((cat) => (porCategoria[cat] = porCategoria[cat] || []).push(c)));
  Object.values(porCategoria).forEach((lista) => lista.sort((a, b) => coll.compare(a.n, b.n)));
  const grupos = GRUPOS.map((g) => ({
    ...g,
    cats: Object.keys(porCategoria).filter((cat) => CATEGORIAS[cat] === g.id).sort(coll.compare),
  })).filter((g) => g.cats.length);

  UTILIDADES.forEach((u) => { u.busca = norm([u.n, u.d, "utilidade publica prefeitura cidade"].join(" ")); u.digitos = u.t.replace(/\D/g, ""); });

  function htmlUtilidade(u) {
    return `<li class="pessoa util">
      <div class="quem">
        <span class="nome">${esc(u.n)}</span>
        <span class="sub"><span class="num">${esc(u.t)}</span> · ${esc(u.d)}</span>
      </div>
      <a class="ic ic-zap" href="${esc(u.zap)}" target="_blank" rel="noopener" aria-label="WhatsApp do ${esc(u.n)}">${IC.zap}</a>
      ${u.tel ? `<a class="ic ic-fone" href="tel:${u.tel}" aria-label="Ligar para ${esc(u.n)}">${IC.fone}</a>` : ""}
    </li>`;
  }

  function htmlCidade() {
    if (!UTILIDADES.length) return "";
    return `<section class="grupo cidade" id="g-cidade" aria-labelledby="t-cidade">
      <div class="grupo-cab"><h2 id="t-cidade">Utilidade pública</h2></div>
      <ul class="pessoas caixa">${UTILIDADES.map(htmlUtilidade).join("")}</ul>
      <p class="dica">O WhatsApp já abre com uma mensagem pronta. É só completar com seu nome e endereço.</p>
    </section>`;
  }

  // ---------- salvos ----------
  let salvos = new Set();
  try { salvos = new Set(JSON.parse(localStorage.getItem(CHAVE_SALVOS) || "[]")); } catch (e) {}
  function gravarSalvos() {
    try { localStorage.setItem(CHAVE_SALVOS, JSON.stringify([...salvos])); } catch (e) {}
  }

  // ---------- estado ----------
  const estado = { q: "", salvos: false };
  const abertas = new Set();

  function bate(c, termos) {
    return termos.every((t) => (/^\d+$/.test(t) ? t.length >= 3 && c.digitos.includes(t) : c.busca.includes(t)));
  }

  // ---------- render ----------
  function htmlPessoa(c, mostrarCategoria) {
    const t = c.t[0];
    const extras = [];
    if (c.d) extras.push(esc(c.d));
    if (mostrarCategoria) extras.push(esc(c.c.join(", ")));
    if (c.t.length > 1) extras.push(`+${c.t.length - 1} número`);
    const acoes = discavel(c, t)
      ? (ehCelular(t) ? `<a class="ic ic-zap" href="${linkZap(t)}" target="_blank" rel="noopener" aria-label="WhatsApp de ${esc(c.n)}">${IC.zap}</a>` : "") +
        `<a class="ic ic-fone" href="tel:+55${t}" aria-label="Ligar para ${esc(c.n)}">${IC.fone}</a>`
      : "";
    return `<li class="pessoa" data-id="${c.id}">
      <button class="quem" type="button" aria-label="Mais opções de ${esc(c.n)}">
        <span class="nome">${esc(c.n)}${salvos.has(c.chave) ? IC.estrela.replace("<svg", '<svg class="marca" aria-label="salvo"') : ""}</span>
        <span class="sub"><span class="num">${formatar(t)}</span>${extras.length ? " · " + extras.join(" · ") : ""}</span>
        ${c.confirmar ? `<span class="confirmar">Número incompleto. Confirme no grupo.</span>` : ""}
      </button>
      ${acoes}
    </li>`;
  }

  function htmlCategoria(cat) {
    const itens = porCategoria[cat];
    return `<details class="cat" id="${slug(cat)}" data-cat="${esc(cat)}"${abertas.has(cat) ? " open" : ""}>
      <summary><span class="cat-nome">${esc(cat)}</span><span class="cat-n">${itens.length}</span>${IC.seta}</summary>
      <ul class="pessoas">${itens.map((c) => htmlPessoa(c, false)).join("")}</ul>
    </details>`;
  }

  function renderInicio() {
    el.conteudo.innerHTML = htmlCidade() + grupos.map((g) => {
      const n = g.cats.reduce((s, cat) => s + porCategoria[cat].length, 0);
      return `<section class="grupo" id="g-${g.id}" aria-labelledby="t-${g.id}">
        <div class="grupo-cab"><h2 id="t-${g.id}">${esc(g.nome)}</h2><span class="grupo-n">${n} contatos</span></div>
        <div class="caixa">${g.cats.map(htmlCategoria).join("")}</div>
      </section>`;
    }).join("");
  }

  function renderLista(itens, cabecalho, mostrarCategoria) {
    el.conteudo.innerHTML = `<p class="resultado-cab">${cabecalho}</p>
      <ul class="pessoas caixa">${itens.map((c) => htmlPessoa(c, mostrarCategoria)).join("")}</ul>`;
  }

  function render() {
    const termos = norm(estado.q).split(/\s+/).filter(Boolean);
    if (estado.salvos) {
      const itens = CONTATOS.filter((c) => salvos.has(c.chave) && (!termos.length || bate(c, termos))).sort((a, b) => coll.compare(a.n, b.n));
      if (itens.length) renderLista(itens, itens.length === 1 ? "1 contato salvo" : `${itens.length} contatos salvos`, true);
      else el.conteudo.innerHTML = `<div class="vazio"><strong>Nenhum contato salvo${termos.length ? " com essa busca" : ""}</strong>Toque no nome de alguém e escolha “Salvar nos favoritos”.<br><button type="button" data-sair-salvos>Ver todos os contatos</button></div>`;
      return;
    }
    if (termos.length) {
      const itens = CONTATOS.filter((c) => bate(c, termos)).sort((a, b) => coll.compare(a.c[0], b.c[0]) || coll.compare(a.n, b.n));
      const utils = UTILIDADES.filter((u) => bate(u, termos));
      const total = itens.length + utils.length;
      if (total) {
        renderLista(itens, total === 1 ? "1 contato encontrado" : `${total} contatos encontrados`, true);
        if (utils.length) el.conteudo.querySelector(".pessoas").insertAdjacentHTML("afterbegin", utils.map(htmlUtilidade).join(""));
      } else el.conteudo.innerHTML = `<div class="vazio"><strong>Nada encontrado para “${esc(estado.q)}”</strong>Tente outra palavra, como “pintor”, “bolo” ou parte do número.</div>`;
      return;
    }
    renderInicio();
  }

  function renderAtalhos() {
    const salvosBtn = salvos.size || estado.salvos
      ? `<button class="atalho atalho-salvos" type="button" data-salvos aria-pressed="${estado.salvos}">${IC.estrela}Salvos · ${salvos.size}</button>`
      : "";
    const cidadeBtn = UTILIDADES.length ? `<button class="atalho" type="button" data-grupo="cidade">${IC.cidade}Utilidade pública</button>` : "";
    el.atalhos.innerHTML = salvosBtn + cidadeBtn + grupos.map((g) => `<button class="atalho" type="button" data-grupo="${g.id}">${esc(g.nome)}</button>`).join("");
  }

  // ---------- folha de ações ----------
  function vcard(c) {
    const linhas = ["BEGIN:VCARD", "VERSION:3.0", `FN:${c.n}${c.d ? " (" + c.d + ")" : ""}`];
    c.t.forEach((t) => linhas.push(`TEL;TYPE=${ehCelular(t) ? "CELL" : "WORK"}:+55${t}`));
    linhas.push(`NOTE:${c.c.join(", ")} · Catálogo do Bosque da Mata e BR Felice`, "END:VCARD");
    const blob = new Blob([linhas.join("\r\n")], { type: "text/vcard" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = norm(c.n).replace(/[^a-z0-9]+/g, "-") + ".vcf";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  function textoIndicacao(c) {
    return `${c.n}${c.d ? " (" + c.d + ")" : ""} – ${c.c.join(", ")}\n${c.t.map(formatar).join(" / ")}\nCatálogo do bairro: ${location.href.split("#")[0]}`;
  }

  function abrirFolha(c) {
    el.folhaNome.textContent = c.n;
    el.folhaSub.textContent = [c.d, c.c.join(", ")].filter(Boolean).join(" · ");
    const fones = c.t.map((t, i) => {
      const botoes = discavel(c, t)
        ? `<div class="folha-botoes">
            ${ehCelular(t) ? `<a class="btn btn-zap" href="${linkZap(t)}" target="_blank" rel="noopener">${IC.zap}WhatsApp</a>` : ""}
            <a class="btn btn-fone" href="tel:+55${t}">${IC.fone}Ligar</a>
          </div>`
        : `<span class="confirmar">Número incompleto na lista original. Confirme no grupo.</span>`;
      return `<div class="folha-fone"><span class="folha-num">${formatar(t)}</span>${botoes}
        <button class="acao" type="button" data-a="copiar" data-i="${i}">${IC.copiar}Copiar número</button></div>`;
    }).join("");
    const fav = salvos.has(c.chave);
    el.folhaCorpo.innerHTML = fones + `<div class="folha-lista">
      <button class="acao" type="button" data-a="fav" aria-pressed="${fav}">${IC.estrela}${fav ? "Tirar dos salvos" : "Salvar nos favoritos"}</button>
      ${c.confirmar ? "" : `<button class="acao" type="button" data-a="agenda">${IC.agenda}Salvar na agenda do celular</button>`}
      <button class="acao" type="button" data-a="indicar">${IC.enviar}Mandar para alguém</button>
    </div>`;
    el.folhaCorpo.dataset.id = c.id;
    el.folha.showModal();
  }

  // ---------- eventos ----------
  let tBusca;
  el.q.addEventListener("input", () => {
    el.limpar.hidden = !el.q.value;
    clearTimeout(tBusca);
    tBusca = setTimeout(() => { estado.q = el.q.value.trim(); render(); }, 80);
  });
  el.limpar.addEventListener("click", () => {
    el.q.value = ""; estado.q = ""; el.limpar.hidden = true; render(); el.q.focus();
  });

  el.atalhos.addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.hasAttribute("data-salvos")) {
      estado.salvos = !estado.salvos;
      renderAtalhos(); render(); window.scrollTo({ top: 0 });
      return;
    }
    if (estado.q || estado.salvos) {
      estado.q = ""; estado.salvos = false; el.q.value = ""; el.limpar.hidden = true;
      renderAtalhos(); render();
    }
    const alvo = document.getElementById("g-" + b.dataset.grupo);
    if (alvo) alvo.scrollIntoView({ block: "start" });
  });

  el.conteudo.addEventListener("toggle", (e) => {
    const d = e.target;
    if (!d.matches || !d.matches("details.cat")) return;
    if (d.open) abertas.add(d.dataset.cat); else abertas.delete(d.dataset.cat);
  }, true);

  el.conteudo.addEventListener("click", (e) => {
    if (e.target.closest("[data-sair-salvos]")) {
      estado.salvos = false; renderAtalhos(); render(); return;
    }
    const b = e.target.closest("button.quem");
    if (b) abrirFolha(CONTATOS[b.closest(".pessoa").dataset.id]);
  });

  el.folhaCorpo.addEventListener("click", (e) => {
    const b = e.target.closest("[data-a]");
    if (!b || !el.folhaCorpo.dataset.id) return;
    const c = CONTATOS[el.folhaCorpo.dataset.id];
    const a = b.dataset.a;
    if (a === "copiar") copiar(formatar(c.t[b.dataset.i]), "Número copiado");
    if (a === "agenda") vcard(c);
    if (a === "indicar") compartilhar({ title: c.n, text: textoIndicacao(c) }, textoIndicacao(c));
    if (a === "fav") {
      if (salvos.has(c.chave)) { salvos.delete(c.chave); avisar("Tirado dos salvos"); }
      else { salvos.add(c.chave); avisar("Salvo. Aparece em “Salvos”, lá em cima."); }
      gravarSalvos(); renderAtalhos(); render();
    }
    el.folha.close();
  });

  el.folha.addEventListener("click", (e) => {
    if (e.target === el.folha || e.target.closest("[data-fechar]")) el.folha.close();
  });

  $("#compartilhar-site").addEventListener("click", () => {
    const url = location.href.split("#")[0];
    const texto = "Catálogo de contatos dos empreendedores do Bosque da Mata e BR Felice: " + url;
    compartilhar({ title: "Catálogo do bairro", text: texto, url }, texto);
  });

  // ---------- sobre ----------
  $("#topo-links").innerHTML =
    `<button class="topo-link" type="button" data-sobre>${IC.info}Sobre o catálogo</button>` +
    (VOLUNTARIOS ? `<a class="topo-link" href="${esc(VOLUNTARIOS.instagram)}" target="_blank" rel="noopener">${IC.insta}Instagram</a>` : "");

  function abrirSobre() {
    el.folhaNome.textContent = "Sobre o catálogo";
    el.folhaSub.textContent = "Bosque da Mata e BR Felice · Tijucas/SC";
    el.folhaCorpo.innerHTML = `<div class="sobre">
      <p>Contatos exclusivamente de empreendedores residentes no BR Felice e no Bosque da Mata.</p>
      <p><strong>Quer entrar no catálogo ou corrigir seu número?</strong> Mande no grupo do bairro.</p>
      <p class="sobre-data">${CONTATOS.length} contatos · lista de ${esc(window.ATUALIZADO_EM || "")}</p>
    </div>
    ${VOLUNTARIOS ? `<div class="sobre-vol">
      <p class="vol-titulo">Uma iniciativa dos Voluntários do Bosque da Mata</p>
      <a class="vol-link" href="${esc(VOLUNTARIOS.instagram)}" target="_blank" rel="noopener">${IC.insta}<span>Siga ${esc(VOLUNTARIOS.arroba)}</span></a>
      <a class="vol-outros" href="${esc(VOLUNTARIOS.linktree)}" target="_blank" rel="noopener">Voluntários de outros bairros de Tijucas</a>
    </div>` : ""}`;
    delete el.folhaCorpo.dataset.id;
    el.folha.showModal();
  }
  $("#topo-links").addEventListener("click", (e) => { if (e.target.closest("[data-sobre]")) abrirSobre(); });

  // ---------- início ----------
  const totalFones = CONTATOS.reduce((s, c) => s + c.t.length, 0);
  el.atualizado.textContent = `${CONTATOS.length} contatos · ${totalFones} telefones · lista de ${window.ATUALIZADO_EM || ""}`;

  // link direto para uma categoria (#c-eletrica-eletricista) já abre ela
  const hash = decodeURIComponent(location.hash.slice(1));
  Object.keys(porCategoria).forEach((cat) => { if (slug(cat) === hash) abertas.add(cat); });

  // ?q=pintor abre já com a busca feita
  const qInicial = new URLSearchParams(location.search).get("q");
  if (qInicial) { el.q.value = qInicial; estado.q = qInicial.trim(); el.limpar.hidden = false; }

  renderAtalhos();
  render();
  if (hash) {
    const alvo = document.getElementById(hash);
    if (alvo) alvo.scrollIntoView({ block: "start" });
  }
})();
