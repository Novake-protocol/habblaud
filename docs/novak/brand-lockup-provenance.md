# Proveniência do lockup do Grupo NovaK

## Decisão

A landing passa a usar o lockup completo do Grupo NovaK: o símbolo laranja antes de **GRUPO NOVAK**, com o **K** também em laranja (`#FF6826`). Ele substitui o sprite `.brand-mark`, que recortava a marca do `hero-grupo-novak.webp`. Esse recorte trazia o fundo marfim da ilustração e, no tema escuro, só recebia `filter: brightness(1.2)`.

A mesma decisão de marca vale para os outros pontos de acesso, que ficam em PRs próprios:

| Superfície | Marca |
| --- | --- |
| Landing `novakgroup.global` (cabeçalho, rodapé, `/agents/`) | Lockup completo (este documento) |
| Login do NovaK Life | Símbolo laranja acima de NOVAK (L3) |
| Popup de acesso do Protocol (`/life-login`) | Somente o símbolo laranja |

O rótulo `Group` ao lado da marca no cabeçalho foi removido, porque o lockup já traz o nome.

## Arquivos

| Arquivo | Dimensões | Bytes | SHA-256 |
| --- | --- | --- | --- |
| `public/assets/grupo-novak-lockup-preto.png` | 709 × 120 | 17 655 | `a339b294b076756ee6be1f83c9a8439149ae23f1a5589b784814de20a99eb191` |
| `public/assets/grupo-novak-lockup-branco.png` | 709 × 120 | 15 985 | `f59799424710dc190b5d2e07f1981e43dfd9feea90a64eb6eb836144eefcaeb0` |

Os dois são PNGs RGBA com transparência real e estão no `docs/assets-manifest.json`. A versão preta é usada no tema claro e a branca no escuro.

O componente `components/BrandLogo.tsx` renderiza um único `span role="img"` com `aria-label`, como fazia o `.brand-mark`. O `background-image` de `.brand-logo` em `app/globals.css` troca conforme `:root[data-theme='dark']`. Não há JavaScript nem salto de layout, e o DOM não fica com uma `<img>` escondida: o `expectLocalImagesLoaded` de `tests/landing.spec.ts` rola cada `<img>` até a vista, e uma imagem com `display: none` faz o teste esgotar o tempo.

## Origem

| Fonte | SHA-256 |
| --- | --- |
| `GrupoNovake-Tipografia-Preto-v2.png` (pacote oficial `LogosGrupoNovak`, 173 485 B) | `9995ef88f08e7f6f850ad1fb9a345a842dbdc2447147a7d07b0de90d4f730f6b` |
| `GrupoNovake-Tipografia-Branco-v2.png` (mesmo pacote, 162 964 B) | `ecfe521d898abc4481ccf584de5238854b9664a81050b97a462c708433b405e6` |
| `apps/dapp/public/assets/logos/novak-symbol-gold.png` (símbolo oficial no repositório, 2 416 B) | `ab6d8a29de111111755c70455a391c8eabf2307529132b9ac45f6bf7d5d11a33` |

Montagem:

1. As tipografias oficiais foram recortadas na área com tinta e reduzidas proporcionalmente para 120 px de altura.
2. No arquivo oficial, o K final é violeta. A cor foi amostrada, e somente os pixels nesse tom foram recoloridos para `#FF6826`. O alfa e o antisserrilhado foram preservados; nenhuma forma foi redesenhada.
3. O símbolo oficial foi preenchido com `#FF6826`, com o alfa preservado. Ele foi posicionado à esquerda do texto, centralizado verticalmente, com 70% da altura do bloco e respiro de 22% dessa altura.
4. O laranja segue o símbolo laranja aprovado pela direção de marca em 06/10/2026.

Os scripts de montagem e as pranchas de decisão ficam fora da distribuição, nas evidências locais da tarefa. Para refazer o lockup, use os mesmos arquivos de origem e confira os hashes acima.

## Tamanhos em uso

| Local | Altura CSS | Densidade do PNG |
| --- | --- | --- |
| Cabeçalho, até 639 px | 28 px (`h-7`) | 4,3× |
| Cabeçalho, a partir de 640 px | 34 px (`sm:h-[34px]`) | 3,5× |
| Rodapé | 24 px (`h-6`) | 5× |
| `/agents/` | 40 px / 44 px (`h-10 sm:h-11`) | 3× / 2,7× |
