# Catálogo do Bosque

Catálogo telefônico dos empreendedores que moram no Bosque da Mata e no BR Felice (Tijucas/SC), feito para usar no celular.

- Site: **https://voluntariosdobosque.pages.dev**
- Painel da admin: **https://voluntariosdobosque.pages.dev/admin** (não tem link no site)

## Onde ficam os contatos

Os contatos ficam no KV do Cloudflare (chave `dados`) e são editados pela admin em `/admin`.
**Editar `contatos.js` não muda mais os contatos do site.** Ele só serve de reserva se a API cair e para a carga inicial.
Grupos, utilidade pública e links dos voluntários continuam em `contatos.js`.

Cada alteração da admin guarda a versão anterior no KV por 90 dias (chaves `backup:<data>`), para dar para desfazer um erro.

## Arquivos

- `index.html`, `styles.css`, `app.js`: o site público.
- `admin.html`, `admin.css`, `admin.js`: o painel.
- `functions/` e `lib/`: a API (Cloudflare Pages Functions).
- `wrangler.jsonc`: configuração do Pages e do KV.

## Comandos

Precisa ter rodado `npx wrangler login` uma vez nesta máquina.

- Publicar depois de mudar código: `./publicar.sh`. Enviar para o GitHub não publica.
- Trocar a senha da admin: grave a nova senha em `.senha-admin` (sem quebra de linha) e rode
  `npx wrangler pages secret put ADMIN_SENHA --project-name voluntariosdobosque < .senha-admin`, depois `./publicar.sh`.
  Quem estava logado precisa entrar de novo.
- Testar localmente: crie `.dev.vars` com `ADMIN_SENHA=<senha de teste>`, rode `scripts/semear.sh --local` e `npx wrangler pages dev`.
- `scripts/semear.sh` recarrega o KV a partir de `contatos.js`. Ele se recusa a rodar se já houver dados; `--force` apaga tudo o que a admin editou.
