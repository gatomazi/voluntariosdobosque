import { json, lerDados } from "../../lib/catalogo.js";

// Lista pública usada pelo site.
export async function onRequestGet({ env }) {
  const dados = await lerDados(env);
  if (!dados) return json({ erro: "Catálogo ainda sem dados." }, 503);
  return json(dados);
}
