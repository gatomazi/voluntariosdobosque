import { json, lerDados, gravarDados, validarContato, novoId, lerCorpo } from "../../../../lib/catalogo.js";

export async function onRequestPost({ request, env }) {
  const anterior = await lerDados(env);
  if (!anterior) return json({ erro: "Catálogo ainda sem dados." }, 503);
  const dados = structuredClone(anterior);
  const { contato, erro } = validarContato(await lerCorpo(request), dados);
  if (erro) return json({ erro }, 400);
  contato.id = novoId();
  dados.contatos.push(contato);
  return json({ dados: await gravarDados(env, dados, anterior), id: contato.id }, 201);
}
