import { json, lerDados, gravarDados, validarContato, lerCorpo } from "../../../../lib/catalogo.js";

export async function onRequestPut({ request, env, params }) {
  const anterior = await lerDados(env);
  if (!anterior) return json({ erro: "Catálogo ainda sem dados." }, 503);
  const dados = structuredClone(anterior);
  const i = dados.contatos.findIndex((c) => c.id === params.id);
  if (i < 0) return json({ erro: "Esse contato não existe mais. Recarregue a página." }, 404);
  const { contato, erro } = validarContato(await lerCorpo(request), dados);
  if (erro) return json({ erro }, 400);
  contato.id = params.id;
  dados.contatos[i] = contato;
  return json({ dados: await gravarDados(env, dados, anterior) });
}

export async function onRequestDelete({ env, params }) {
  const anterior = await lerDados(env);
  if (!anterior) return json({ erro: "Catálogo ainda sem dados." }, 503);
  const dados = structuredClone(anterior);
  const i = dados.contatos.findIndex((c) => c.id === params.id);
  if (i < 0) return json({ erro: "Esse contato já tinha sido removido." }, 404);
  dados.contatos.splice(i, 1);
  return json({ dados: await gravarDados(env, dados, anterior) });
}
