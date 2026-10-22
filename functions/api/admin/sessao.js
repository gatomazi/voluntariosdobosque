import { json } from "../../../lib/catalogo.js";

// Só responde se o middleware aceitou a sessão.
export async function onRequestGet() {
  return json({ ok: true });
}
