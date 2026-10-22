// Gera dados-seed.json a partir de contatos.js (só para a carga inicial do KV).
import { readFileSync, writeFileSync } from "node:fs";
import vm from "node:vm";

const window = {};
vm.runInNewContext(readFileSync(new URL("../contatos.js", import.meta.url), "utf8"), { window });
const ids = new Set();
const contatos = window.CONTATOS.map((c) => {
  const id = c.t[0]; // mesmo id que o site usa quando cai no contatos.js
  if (ids.has(id)) throw new Error(`id repetido: ${id}`);
  ids.add(id);
  return { id, ...c };
});
const dados = { grupos: window.GRUPOS, categorias: window.CATEGORIAS, contatos, atualizadoEm: window.ATUALIZADO_EM };
writeFileSync(new URL("../dados-seed.json", import.meta.url), JSON.stringify(dados));
console.log(`${contatos.length} contatos, ${Object.keys(dados.categorias).length} categorias`);
