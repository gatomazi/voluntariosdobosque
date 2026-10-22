import { json, sessaoValida } from "../../../lib/catalogo.js";

// Tudo em /api/admin exige a sessão da admin.
export async function onRequest({ request, env, next }) {
  if (!(await sessaoValida(request, env))) return json({ erro: "Entre com a senha de novo." }, 401);
  if (request.method !== "GET" && !(request.headers.get("content-type") || "").includes("application/json")) {
    return json({ erro: "Formato inválido." }, 415);
  }
  return next();
}
