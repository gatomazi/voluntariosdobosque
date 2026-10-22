# Catálogo do Bosque

Catálogo telefônico dos empreendedores que moram no Bosque da Mata e no BR Felice (Tijucas/SC), feito para usar no celular.

No ar em **https://voluntariosdobosque.pages.dev** (Cloudflare Pages).

- `contatos.js`: a lista. Para incluir, corrigir ou remover alguém, mexa só aqui.
- `index.html`, `styles.css`, `app.js`: a página. Não usa build nem servidor; abrir o `index.html` já funciona.

Para conferir a lista depois de editar: os telefones vão só com dígitos e DDD (`"48999998888"`).
Cada categoria usada em `c` precisa existir em `CATEGORIAS`.

Para publicar depois de mudar algo: `./publicar.sh` (precisa ter rodado `npx wrangler login` uma vez nesta máquina).
