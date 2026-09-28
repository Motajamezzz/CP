# Site — Comissão de Praxe de Enfermagem · Coimbra 2026/2027

Site estático (HTML, CSS e JavaScript, sem instalações). Para o ver, basta abrir o `index.html` no browser.

```
index.html            página única com todas as secções
css/styles.css        aspeto e animações
js/main.js            menu, animações, galeria e perfis dos Doutores
assets/img/           emblema, fundo, ícones e imagem de partilha
assets/doutores/      fotografias dos 26 Doutores
documentos/           Código de Praxe em PDF
```

## Fotografias dos Doutores

As 26 fotografias já estão no site: a imagem completa, com o círculo do logo da Comissão, reduzida para 800 × 1000 px.
Para trocar uma fotografia, guarda o novo ficheiro em `assets/doutores/` com o nome exato abaixo (minúsculas, `.jpg`):

| Doutor(a) | Ficheiro | Doutor(a) | Ficheiro |
|---|---|---|---|
| Doutora April | `april.jpg` | Doutora Mallow | `mallow.jpg` |
| Doutora Becky | `becky.jpg` | Doutora Milina | `milina.jpg` |
| Doutor Bond | `bond.jpg` | Doutora Nara | `nara.jpg` |
| Doutora Fibie | `fibie.jpg` | Doutora Periwinklle | `periwinklle.jpg` |
| Doutora Glimmer | `glimmer.jpg` | Doutor Shakespeare | `shakespeare.jpg` |
| Doutora Glory | `glory.jpg` | Doutora Shell | `shell.jpg` |
| Doutora Indie | `indie.jpg` | Doutor Sniper | `sniper.jpg` |
| Doutora Lince | `lince.jpg` | Doutor Soft | `soft.jpg` |
| Doutora Lumi | `lumi.jpg` | Doutor Specter | `specter.jpg` |
| Doutora Lunaris | `lunaris.jpg` | Doutor Tsubasa | `tsubasa.jpg` |
| Doutora Lyra | `lyra.jpg` | Doutor Yu-Gi-Oh | `yu-gi-oh.jpg` |
| Doutor Marshall | `marshall.jpg` | Doutora Zoomy | `zoomy.jpg` |
| Doutora Mazzie | `mazzie.jpg` | Doutora Zorya | `zorya.jpg` |

- Formato: vertical 4:5 (800 × 1000 px), JPG com menos de 300 KB.
- Na galeria as fotos aparecem a preto e branco.
- Se uma fotografia faltar, aparece a inicial do nome no lugar dela.

## Código de Praxe

O PDF já está no site em `documentos/codigo-de-praxe.pdf` (Código da Praxe da Universidade de Coimbra 2022, versão digital do articulado) e abre no botão “Consultar Código de Praxe”.
Para o atualizar, substitui o ficheiro mantendo o mesmo nome. Se preferires um link externo (Google Drive, Dropbox…), abre o `index.html`, procura `CÓDIGO DE PRAXE ▸` e troca o `href` do botão pelo link.
Se o ficheiro alguma vez faltar no site publicado, o botão mostra o aviso “O Código de Praxe ainda não está disponível online.” em vez de uma página de erro.

## Imagem de fundo

`assets/img/hero-bosque.jpg` é a floresta do cartaz, sem o emblema. Para usar uma fotografia de Coimbra, substitui esse ficheiro mantendo o mesmo nome (idealmente com 1600 px de largura ou mais).

## Publicação

O site está no GitHub Pages, grátis e com HTTPS (o certificado é renovado automaticamente pelo GitHub):

- Endereço: https://motajamezzz.github.io/CP/
- Repositório: https://github.com/Motajamezzz/CP

Para atualizar: no repositório, **Add file → Upload files**, arrasta os ficheiros alterados (com os mesmos nomes e pastas) e carrega em **Commit changes**. O site atualiza sozinho em 1–2 minutos.
Se o endereço mudar, atualiza também `og:url` e `og:image` no `index.html`.
