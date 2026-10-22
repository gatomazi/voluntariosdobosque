import { json, iguais, cookieSessao, lerCorpo } from "../../lib/catalogo.js";

export async function onRequestPost({ request, env }) {
  if (!env.ADMIN_SENHA) return json({ erro: "A senha da admin ainda não foi configurada." }, 500);
  const corpo = await lerCorpo(request);
  const senha = corpo && typeof corpo.senha === "string" ? corpo.senha : "";
  if (senha && (await iguais(senha, env.ADMIN_SENHA))) {
    return json({ ok: true }, 200, { "set-cookie": await cookieSessao(env) });
  }
  // atrasa a resposta para dificultar tentativas em sequência
  await new Promise((r) => setTimeout(r, 1200));
  return json({ erro: "Senha incorreta." }, 401);
}
