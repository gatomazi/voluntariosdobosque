#!/bin/sh
# Carga inicial do KV com os contatos de contatos.js.
# Uso: scripts/semear.sh [--local] [--force]
# Recusa se já houver dados, porque apagaria tudo que a admin editou. --force passa por cima.
set -e
cd "$(dirname "$0")/.."
ONDE="--remote"; FORCA=""
for a in "$@"; do
  case "$a" in --local) ONDE="--local" ;; --force) FORCA=1 ;; esac
done
NS="$(sed -n 's/.*"id": *"\([^"]*\)".*/\1/p' wrangler.jsonc)"
W="npx --yes wrangler@4.152.0"
if [ -z "$FORCA" ]; then
  if ! ATUAL="$($W kv key get dados --namespace-id "$NS" $ONDE 2>/dev/null)"; then
    ATUAL=""
    # "não encontrado" sai com erro; qualquer outro erro (login, rede) interrompe por segurança
    $W kv key list --namespace-id "$NS" $ONDE >/dev/null || { echo "Não consegui ler o KV. Nada foi feito."; exit 1; }
  fi
  case "$ATUAL" in
    ""|"Value not found"*) ;;
    *) echo "Já existem dados no KV ($ONDE). Nada foi feito. Use --force só se quiser apagar as edições da admin."; exit 1 ;;
  esac
fi
node scripts/gerar-seed.mjs
$W kv key put dados --namespace-id "$NS" $ONDE --path dados-seed.json
rm -f dados-seed.json
