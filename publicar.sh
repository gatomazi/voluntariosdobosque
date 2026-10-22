#!/bin/sh
# Publica o site e as Functions em https://voluntariosdobosque.pages.dev
# Uso: ./publicar.sh   (precisa de `npx wrangler login` uma vez nesta máquina)
# Os contatos não vão aqui: ficam no KV e são editados em /admin.
set -e
cd "$(dirname "$0")"
rm -rf dist && mkdir dist
cp index.html admin.html styles.css admin.css app.js admin.js contatos.js icon.svg manifest.webmanifest dist/
npx --yes wrangler@4.152.0 pages deploy dist --project-name voluntariosdobosque --branch main --commit-dirty=true
