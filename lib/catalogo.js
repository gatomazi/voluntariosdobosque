// Funções compartilhadas pelas Functions do catálogo.

const CHAVE_DADOS = "dados";
const COOKIE = "sessao_admin";
const SESSAO_DIAS = 30;
const BACKUP_DIAS = 90;

export function json(dados, status = 200, headers = {}) {
  return new Response(JSON.stringify(dados), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", ...headers },
  });
}

export async function lerDados(env) {
  return env.CATALOGO.get(CHAVE_DADOS, "json");
}

// Guarda a versão anterior por 90 dias antes de gravar, para dar para desfazer um erro.
export async function gravarDados(env, dados, anterior) {
  if (anterior) {
    await env.CATALOGO.put(`backup:${new Date().toISOString()}`, JSON.stringify(anterior), {
      expirationTtl: BACKUP_DIAS * 86400,
    });
  }
  dados.atualizadoEm = hoje();
  await env.CATALOGO.put(CHAVE_DADOS, JSON.stringify(dados));
  return dados;
}

export function hoje() {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo" }).format(new Date());
}

// ---------- sessão ----------
const enc = new TextEncoder();

async function chave(env) {
  return crypto.subtle.importKey("raw", enc.encode("sessao:" + env.ADMIN_SENHA), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
}

function b64url(buf) {
  return btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function assinar(env, texto) {
  return b64url(await crypto.subtle.sign("HMAC", await chave(env), enc.encode(texto)));
}

// Compara dois textos sem vazar, pelo tempo de resposta, quanto deles bate.
export async function iguais(a, b) {
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(String(a))),
    crypto.subtle.digest("SHA-256", enc.encode(String(b))),
  ]);
  return crypto.subtle.timingSafeEqual(ha, hb);
}

export async function cookieSessao(env) {
  const exp = String(Date.now() + SESSAO_DIAS * 86400 * 1000);
  const token = `${exp}.${await assinar(env, exp)}`;
  return `${COOKIE}=${token}; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSAO_DIAS * 86400}`;
}

export const cookieSair = `${COOKIE}=; Path=/api; HttpOnly; Secure; SameSite=Strict; Max-Age=0`;

export async function sessaoValida(request, env) {
  if (!env.ADMIN_SENHA) return false;
  const cookie = request.headers.get("cookie") || "";
  const m = cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE}=([^;]+)`));
  if (!m) return false;
  const [exp, assinatura] = m[1].split(".");
  if (!exp || !assinatura || Number(exp) < Date.now()) return false;
  return iguais(assinatura, await assinar(env, exp));
}

// ---------- validação de contato ----------
const texto = (v, max) => (typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "");

export function limparTelefone(v) {
  let t = String(v || "").replace(/\D/g, "");
  if ((t.length === 12 || t.length === 13) && t.startsWith("55")) t = t.slice(2);
  return t;
}

// Devolve { contato } pronto para gravar, ou { erro } com uma mensagem para a admin.
// Categorias novas entram em dados.categorias (o objeto é alterado).
export function validarContato(entrada, dados) {
  const e = entrada || {};
  const n = texto(e.n, 80);
  if (!n) return { erro: "Falta o nome." };
  const d = texto(e.d, 80);
  const confirmar = e.confirmar === true;

  const brutos = Array.isArray(e.t) ? e.t : [];
  const t = [...new Set(brutos.map(limparTelefone).filter(Boolean))];
  if (!t.length) return { erro: "Falta o telefone." };
  if (t.length > 3) return { erro: "Use no máximo 3 telefones." };
  for (const num of t) {
    const ddd = Number(num.slice(0, 2));
    const okTamanho = confirmar ? num.length >= 9 && num.length <= 11 : num.length === 10 || num.length === 11;
    if (ddd < 11 || !okTamanho) {
      return { erro: `O telefone ${num} não parece completo. Use DDD + número, como (48) 99999-8888.` };
    }
  }

  const gruposValidos = new Set((dados.grupos || []).map((g) => g.id));
  const existentes = new Map(Object.keys(dados.categorias).map((cat) => [cat.toLowerCase(), cat]));
  for (const nova of Array.isArray(e.novas) ? e.novas : []) {
    const nome = texto(nova && nova.nome, 50);
    if (!nome) continue;
    if (existentes.has(nome.toLowerCase())) continue;
    if (!gruposValidos.has(nova.grupo)) return { erro: `Escolha o tipo da categoria nova “${nome}”.` };
    dados.categorias[nome] = nova.grupo;
    existentes.set(nome.toLowerCase(), nome);
  }

  const c = [...new Set((Array.isArray(e.c) ? e.c : []).map((x) => existentes.get(texto(x, 50).toLowerCase())).filter(Boolean))];
  if (!c.length) return { erro: "Escolha pelo menos uma categoria." };
  if (c.length > 6) return { erro: "Use no máximo 6 categorias." };

  const contato = { n, c, t };
  if (d) contato.d = d;
  if (confirmar) contato.confirmar = true;
  return { contato };
}

export function novoId() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 10);
}

export async function lerCorpo(request) {
  try { return await request.json(); } catch (e) { return null; }
}
