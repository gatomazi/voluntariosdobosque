#!/bin/sh
# Publica o site em https://voluntariosdobosque.pages.dev
# Uso: ./publicar.sh   (precisa de `npx wrangler login` uma vez nesta máquina)
set -e
cd "$(dirname "$0")"
DIST="$(mktemp -d)"
cp index.html styles.css app.js contatos.js icon.svg manifest.webmanifest "$DIST"/
npx --yes wrangler@4.152.0 pages deploy "$DIST" --project-name voluntariosdobosque --branch main --commit-dirty=true
rm -rf "$DIST"
