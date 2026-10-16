# CLAUDE.md — CHARLENE/16 · Site-presente de aniversário

> Site de presente para **Charlene**, gerente comercial do **Grupo Vitalmed** (Salvador-BA), aniversariante de **16/10**.
> Vai ser publicado no **Vercel** e enviado para ela pelo **WhatsApp**, então quase com certeza será aberto **no celular**.
> Objetivo: ela abrir o link e pensar *"não acredito que fizeram isso pra mim"*. Precisa emocionar, ser engraçado e ser tecnicamente impecável.

---

## 1. Conceito criativo: "EDIÇÃO LIMITADA · CHARLENE/16"

O design system VOID/03 foi feito para lançamentos de produtos de moda. Usamos **só a estética** dele (tipografia, grid, carimbos, motion), e o site trata a Charlene como **uma edição única, a mais aguardada do ano**.

> ⚠️ **Regra do Lucas: nada de vocabulário de loja de roupa** (P/M/GG, tamanho, look, coleção, etiqueta, "lavar/passar", drop, estoque, sacola).
> A Vitalmed é uma empresa de **urgência e emergência**: o humor vem do **pronto-atendimento**: triagem/classificação de risco,
> sinais vitais, monitor cardíaco (ECG), ficha clínica, prescrição, laudo, plantão, prognóstico.

- O numeral gigante `03` do design system vira **`16`** (o dia do aniversário). Se soubermos a idade, alternar entre `16` e a idade.
- `VOID/03` vira **`CHARLENE/16`**. A sigla do trilho lateral vira **`C/16`**.
- O painel lateral do hero vira um **painel de atendimento**: "Prioridade: máxima", classificação de risco do abraço, monitor cardíaco com ECG animado.
- O botão principal é **"Soprar as velas →"**.
- A ficha técnica vira a **ficha clínica da Charlene** (com humor), com uma **prescrição** no rodapé.
- Tom: **editorial + carinhoso + bem-humorado**, com sotaque baiano na medida certa (sem caricatura).

Frase-manifesto do hero (sugestão):
> **"Edição única. Feita em Salvador. Sem reposição."**

---

## 2. Arquivos do projeto

```
Charlene - presente/
├── CLAUDE.md                         ← este arquivo
├── 1789673728619.jpg                 ← foto oficial da Charlene (400x400, fundo cinza claro)
├── informacoesLinkedin.md            ← ⚠️ VAZIO: preencher com cargo, tempo de casa, conquistas
├── void-03-modular-62-design-system.zip
└── _design-system/void-03-modular-62-design-system/   ← zip já extraído (SOMENTE REFERÊNCIA)
    ├── design-system.html            ← catálogo de componentes (abrir no navegador)
    └── assets/overview/
        ├── index.html                ← página-exemplo completa
        └── assets/void-03-modular-62.aura.build/
            ├── void.css              ← ★ FONTE DA VERDADE dos tokens e componentes
            └── fonts.css             ← @font-face de Inter Tight + DM Mono
```

**Regras sobre o design system:**
- Antes de criar qualquer componente, **ler `void.css`** e reaproveitar a estrutura das classes correspondentes (`.launch`, `.stamp`, `.conveyor`, `.index-table`, `.accord`, `.spec-sheet`, `.finale`, `.footer`...).
- **NÃO usar as imagens de modelos/roupas** do design system (`void-hero.png`, `void-crouch*.png` etc.): são de outra marca e não fazem sentido aqui. Usar só tokens, layout e motion.
- `_design-system/` **não vai para o deploy**. Colocar no `.gitignore` e no `.vercelignore`.

---

## 3. Stack

| Camada | Escolha | Por quê |
|---|---|---|
| Build | **Vite** (vanilla JS, sem framework) | Deploy zero-config no Vercel, bundle leve |
| 3D | **Three.js** (+ `GLTFLoader` se usar modelo) | Bolo 3D e Farol da Barra |
| Scroll/Motion | **GSAP + ScrollTrigger** e **Lenis** (smooth scroll) | Replicar o motion do VOID/03 |
| Confete | **canvas-confetti** | Barato e bonito |
| Fontes | Inter Tight (400/700/800/900) + DM Mono (400/500), **self-hosted** em `/public/fonts` | Sem flash de fonte, funciona offline |

Estrutura alvo:

```
site/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   ├── fonts/
│   ├── img/charlene-cutout.png      ← foto com fundo removido
│   ├── img/charlene.jpg
│   ├── og.jpg                       ← 1200x630 para o preview do WhatsApp
│   ├── audio/parabens.mp3           ← opcional (instrumental, sem direitos)
│   └── favicon.svg                  ← "C/16" em tinta sobre papel
└── src/
    ├── main.js                      ← boot, Lenis, GSAP, roteia as seções
    ├── styles/tokens.css            ← variáveis copiadas do void.css
    ├── styles/base.css              ← reset, .noise, .progress, .side-rail, .topbar
    ├── styles/sections/*.css        ← um arquivo por seção
    ├── sections/*.js                ← um módulo por seção
    ├── three/cake.js                ← cena do bolo
    ├── three/farol.js               ← cena do Farol da Barra
    ├── data/content.js              ← TODOS os textos, números e recados (fácil de editar)
    └── fx/                          ← confetti, mic, easter eggs, cursor
```

> **Regra de ouro:** todo texto editável fica em `src/data/content.js`. O usuário vai querer ajustar frases de última hora sem caçar no HTML.

Comandos:
```bash
npm create vite@latest site -- --template vanilla
cd site && npm i three gsap lenis canvas-confetti
npm run dev      # local
npm run build    # gera /dist
```

---

## 4. Tokens (copiados do VOID/03, não inventar outros)

```css
:root {
  --ink:   #101010;   /* texto, bordas, fundo das seções escuras */
  --paper: #f3efe5;   /* fundo principal */
  --red:   #f33a2f;   /* cor-herói: painel do hero, barra de progresso, CTA */
  --blue:  #123fdd;   /* hover do CTA, destaques secundários */
  --acid:  #d9ff00;   /* carimbos, seleção, item ativo, "surpresa" */
  --muted: #d7d2c6;
  --ease:  cubic-bezier(.16, 1, .3, 1);
  --rail:  86px;      /* em mobile: 0 (trilho vira barra no topo) */
}
```

Tipografia:
- **Display**: Inter Tight 800–900, `letter-spacing: -.07em a -.09em`, `line-height: .72–.86`. Uma linha do título vai **vazada** (`color: transparent; -webkit-text-stroke: 1.5px var(--ink)`).
- **Labels/meta**: DM Mono 500, 9–11px, `uppercase`, `letter-spacing: .06–.18em`.
- **Corpo**: Inter Tight 400, 16px / 1.45.

Elementos fixos que dão a cara do VOID/03 e **devem existir**:
- `.noise`: granulado SVG por cima de tudo (opacity .08, multiply)
- `.progress`: barra vermelha de 4px no topo que acompanha o scroll
- `.side-rail`: trilho esquerdo com `C/16`, nome vertical "CHARLENE · VITALMED · SALVADOR" e um círculo contador (seção atual `01/08`)
- `.topbar`: barra de vidro com links para as seções + botão "🎂 Soprar velas"
- `.stamp`: carimbos de papel/ácido espalhados ("FEITO EM SSA", "LIBRA ♎", "ED. 2026")
- Bordas de **1px var(--ink)** separando tudo. **Sem cantos arredondados** (exceto o círculo do contador).

---

## 5. Roteiro das seções (ordem de scroll)

### 00 · INTRO / "Portão de embarque" (tela de loading)
- Tela preta com contador DM Mono `000 → 100` carregando os assets 3D.
- No 100: texto `ACESSO AUTORIZADO · CHARLENE` e um botão **"ABRIR PRESENTE"**.
- O clique é **obrigatório**: ele desbloqueia áudio e microfone no iOS (políticas de autoplay). Ao clicar, a tela "rasga" para cima com `clip-path` (usar `.enter-clip`).

### 01 · HERO / LAUNCH (componente `.launch`, grid 31/49/20)
- **Coluna esquerda**: eyebrow `DROP 16.10.2026 · SALVADOR-BA`; H1 gigante `CHAR` / `LENE` (2ª linha vazada); o manifesto; rodapé `.copy-foot` com `GERENTE COMERCIAL` | `GRUPO VITALMED`.
- **Coluna central** (`.launch-visual`, fundo vermelho): numeral `16` gigante em `mix-blend-mode: screen` + **foto recortada da Charlene** com parallax no mouse/giroscópio. Carimbos: `ED. ÚNICA`, `LIBRA ♎` (ácido), `SSA · BA` (vertical).
- **Coluna direita** (`.buy-panel`, o "painel de compra" vira painel de presente):
  - `product-code`: **CHARLENE/16**
  - `price`: `PRIORIDADE: MÁXIMA`
  - Seletor (`.size-row`) → **"Classificação de risco do abraço"** com as cores da triagem de Manchester: 🟢 Verde (pouco urgente: abraço de corredor) · 🟡 Amarelo (urgente: abraço de meta batida) · 🔴 Vermelho (emergência: abraço baiano imediato, com "minha linda").
  - CTA vermelho `.add`: **"SOPRAR AS VELAS →"** (rola até a seção do bolo).
  - **Monitor cardíaco**: linha de ECG animada em SVG, `♥ 16/10`.
  - `.panel-data`: `SINAIS VITAIS: ÓTIMOS` · `PROGNÓSTICO: EXCELENTE` · `PLANTÃO: 24H DE FESTA`.
- Animação de entrada: reaproveitar a sequência `heroBgEnter → heroTitleEnter → heroModelEnter → heroStampsEnter` do void.css.

### 02 · FICHA CLÍNICA (componente `.spec-sheet`)
Prancheta de atendimento, com humor:
| Campo | Valor |
|---|---|
| Paciente | Charlene, edição 2026 |
| Procedência | Salvador, Bahia, Brasil |
| Composição | 60% estratégia · 30% dendê · 10% café |
| Signo | Libra ♎ (equilíbrio até na negociação) |
| Diagnóstico | Excesso crônico de competência |
| Sinais vitais | Estáveis, animados e batendo meta |
| Contraindicação | Ficar sem um bom café |
| Conduta | Comemorar sem moderação |

Rodapé: **℞ Prescrição** com ícones: 1 fatia de bolo · Abraços à vontade · Café 3x ao dia · Elogios contínuos.

> Os números da "composição" são piada, não dados. Pedir ao usuário para validar o tom.

### 03 · O BOLO 3D (★ peça principal: `three/cake.js`)
**A experiência "foda" do site.**
- Bolo low-poly estilizado em Three.js, montado em código (cilindros/geometria, **sem precisar de modelo externo**), com camadas nas cores do design system: base `--paper`, faixa `--red`, cobertura com respingos `--acid`. Em cima, velas formando **"16"** ou a idade.
- Chamas = shader simples ou sprites com flicker + `PointLight` laranja oscilando.
- **Soprar de verdade:** pedir permissão de microfone (`getUserMedia`), medir o RMS com `AnalyserNode` e, se o volume passar de um limiar por ~300 ms, as chamas se inclinam e apagam uma por uma.
  - **Fallback obrigatório:** botão "Soprar (sem microfone)" e também arrastar/clicar nas velas. Se a permissão for negada, seguir sem quebrar nada.
- Ao apagar todas: luz cai → 1 s de escuro → **explosão de confete** (cores: red/blue/acid/paper) → aparece o texto `FAÇA UM PEDIDO.` em Inter Tight 900 → toca "Parabéns" (só se o som estiver ligado).
- Bolo gira devagar e reage ao mouse/giroscópio (`DeviceOrientationEvent`, que no iOS exige permissão pedida no clique do "ABRIR PRESENTE").
- Contador no canto: `VELAS ACESAS: 16/16`.

### 04 · FITINHAS DO BONFIM (★ elemento baiano)
Uma homenagem à fé e à tradição de Salvador: **fitinhas do Senhor do Bonfim** como interface de desejos.
- Uma grade/gradil (linhas `--ink`) com fitinhas coloridas balançando ao vento (física de corda simples em canvas 2D ou `verlet`). Cada fita tem escrito em DM Mono `LEMBRANÇA DO SENHOR DO BONFIM DA BAHIA`.
- Tradição: **3 nós = 3 pedidos**. A Charlene clica e "dá um nó" em 3 fitas; cada nó revela um desejo da equipe para ela ("Que 2027 bata a meta no primeiro trimestre", etc.).
- Cores das fitas: usar as cores tradicionais (verde, amarelo, azul, vermelho, branco, rosa) **dessaturadas para conversar com o paper**, e uma única fita `--acid` como destaque.

### 05 · CHARLENE EM NÚMEROS (componente `.index-table` / `.drop-index`)
Tabela estilo "drop index", com contadores animando ao entrar na tela:
| # | Métrica | Valor |
|---|---|---|
| 01 | Anos de Vitalmed | **13** (desde 2013) |
| 02 | Reuniões que viraram contrato | `[PREENCHER ou "incontáveis"]` |
| 03 | Cafés tomados com cliente | `∞` |
| 04 | Vezes que disse "vamos bater essa meta" | `+999` |
| 05 | Pessoas que ela fez crescer (só Inteligência Comercial) | **9**: Lucas, Joelton, Adriana, Camile, Mariane, Jamile, Adriana, Ana Cláudia, Crislane |
- Hover em cada linha mostra um "preview" (`.index-preview`) com um mini-fato/foto.
- **Nunca inventar dados reais** (tempo de casa, números de vendas). Usar `[PREENCHER]` e listar em `content.js` o que falta.

### 06 · OS LAUDOS (componente `.conveyor`, scroll horizontal fixo)
Scroll vertical vira trilho horizontal (`.conveyor-sticky` + `.track`), com 5 slides. Cada slide é um "laudo":
1. `LAUDO 01 · A ESTRATEGISTA`: o lado comercial, metas, visão
2. `LAUDO 02 · A LÍDER`: como ela puxa o time
3. `LAUDO 03 · A BAIANA`: Salvador, axé, mar, acarajé
4. `LAUDO 04 · A PESSOA`: o lado humano (fato que o time conhece)
5. `LAUDO 05 · 2027`: o que vem por aí
- Medidor `.conveyor-meter` embaixo: `01 / 05`.
- Fotos: se o usuário mandar mais fotos (eventos, time), usar aqui com tratamento **duotone** (ink + red) para unificar. Se não houver, usar tipografia gigante + ilustração SVG.

### 07 · MURAL DE RECADOS (componente `.accord`, acordeão)
- Cada colega do time é uma linha do acordeão: `NOME` · `CARGO` · `+`. Ao abrir, mostra o recado (texto curto, opcionalmente uma foto ou um áudio de 10 s).
- Dados em `src/data/content.js → recados[]`. **O usuário precisa coletar os recados com o time.**
- Ideia extra: um recado escondido "do futuro", `CHARLENE, 16.10.2036`, que ela mesma vai poder abrir... (só um texto bonito sobre ela daqui a 10 anos).

### 08 · FINALE: FAROL DA BARRA (componente `.finale` + `three/farol.js`)
- Cena 3D low-poly do **Farol da Barra ao pôr do sol**: céu em degradê `--red → --blue`, mar com shader de ondas simples, o farol em `--paper` com faixas pretas, e o **feixe de luz girando** (cone com material aditivo).
- O feixe, ao passar pela câmera, ilumina o texto gigante `.final-number`: **`16.10`**.
- Texto: **"Que seu novo ciclo brilhe como o pôr do sol da Barra."**
- CTA final: `MANDAR UM ABRAÇO DE VOLTA →`, link `wa.me/` com mensagem pré-pronta para o grupo/remetente (pedir o número ao usuário; se não houver, remover).
- Rodapé `.footer`: `FEITO COM CARINHO PELA EQUIPE · SALVADOR · 2026`.

---

## 6. Easter eggs (pequenos, mas fazem a pessoa sorrir)
- Digitar **`charlene`** no teclado → o site inteiro entra em "modo ácido" (troca `--red` por `--acid`) + chuva de confete.
- **Konami code** (↑↑↓↓←→←→BA) → as velas do bolo reacendem para ela soprar de novo.
- No mobile, **chacoalhar o celular** (`devicemotion`) → confete.
- Cursor custom no desktop: um círculo `--ink` de 12px que vira `🎂` sobre elementos clicáveis.
- `console.log` estilizado para quem abrir o DevTools: `Parabéns, Charlene! 🎉 (sim, até aqui tem recado)`.
- Título da aba alterna quando ela sai da página: `Ei, volta! 🎂` → ao voltar, `CHARLENE/16`.

---

## 7. Regras de qualidade (não negociáveis)

### Mobile first
- Testar primeiro em **375px** (iPhone) e **360px** (Android). Ela vai abrir no WhatsApp.
- Em `< 850px`: o `.side-rail` some (`--rail: 0`), o `.launch` empilha (foto em cima, texto embaixo), o `.conveyor` vira scroll horizontal com swipe ou empilhamento vertical.
- Gutter lateral de 16px. **Zero scroll horizontal acidental.**
- Alvos de toque ≥ 44px.

### Performance
- Three.js carregado com **import dinâmico**, só quando a seção estiver perto da tela (`IntersectionObserver`).
- `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`; pausar o render loop quando a cena sai da tela ou a aba fica oculta.
- Imagens em **WebP/AVIF**, com `width`/`height` declarados. Foto recortada ≤ 300 KB.
- Meta: Lighthouse mobile **≥ 85** em performance, **100** em acessibilidade.
- Fallback sem WebGL: mostrar ilustração SVG do bolo e do farol.

### Acessibilidade
- `prefers-reduced-motion`: desligar parallax, conveyor vira lista vertical, confete reduzido.
- Contraste AA (vermelho `#f33a2f` sobre papel só para texto ≥ 24px bold; corpo de texto sempre `--ink`).
- Todo botão com texto ou `aria-label`; canvas 3D com `aria-label` descritivo.
- Som **desligado por padrão**, com toggle visível na topbar (`SOM: OFF`).

### Privacidade
- `<meta name="robots" content="noindex, nofollow">`: é um presente, não deve aparecer no Google.
- Não publicar telefone, e-mail ou dados internos da Vitalmed (números de vendas reais, clientes).
- Usar "Grupo Vitalmed" como texto. **Não usar o logo oficial**, a não ser que o usuário forneça o arquivo e confirme que pode.

---

## 8. Assets: preparação

1. **Foto da Charlene** (`1789673728619.jpg`, 400x400):
   - Remover o fundo (remove.bg, Photoroom, ou `rembg` em Python) → `public/img/charlene-cutout.png`.
   - A resolução é baixa (400px): na coluna do hero, exibir com no máximo ~420px de altura, ou aplicar o tratamento **duotone/halftone** do VOID/03 para que a pixelização vire estética.
   - Pedir ao usuário uma foto maior, se existir.
2. **og.jpg (1200x630)**: preview do link no WhatsApp. Fundo vermelho, `16` gigante em paper, foto recortada, texto `CHARLENE/16 · EDIÇÃO ÚNICA`. Gerar com uma página HTML auxiliar e screenshot.
3. **Meta tags**:
   ```html
   <title>CHARLENE/16 · Edição Única</title>
   <meta property="og:title" content="CHARLENE/16 · Edição Única">
   <meta property="og:description" content="Um lançamento exclusivo. Tiragem: 1. Abra seu presente 🎂">
   <meta property="og:image" content="https://SEU-DOMINIO.vercel.app/og.jpg">  <!-- URL ABSOLUTA -->
   <meta name="theme-color" content="#f33a2f">
   ```
4. **Áudio** (opcional): "Parabéns pra você" instrumental de domínio público / livre de direitos. Nunca autoplay.

---

## 9. Conteúdo pendente (pedir ao usuário antes de finalizar)

- [ ] `informacoesLinkedin.md` está **vazio**: colar cargo, tempo de Vitalmed, formação e conquistas
- [ ] Idade (para as velas). Se for segredo, usar "16" (o dia) e não mencionar idade
- [x] Assinatura: **Lucas Amorim · Inteligência Comercial**
- [x] Tempo de Vitalmed: **13 anos** (desde 2013)
- [x] Time de Inteligência Comercial: Lucas Amorim, Joelton, Adriana, Camile, Mariane, Jamile, Adriana, Ana Cláudia, Crislane (confirmar se são duas Adrianas)
- [x] Mural virou **"07 · Quem assina"**: só os nomes do time (decisão do Lucas, sem mensagens individuais) + o recado do futuro
- [x] Laudo 02: "levanta a voz, sempre com carinho" · Laudo 04 virou **A PROFISSIONAL** (Lucas conhece a Charlene só profissionalmente: excelente, muito inteligente, grato por ter sido contratado; não inventar fatos pessoais)
- [ ] 3 desejos para as fitinhas do Bonfim
- [ ] Fatos/histórias internas engraçadas para a seção "A PESSOA"
- [ ] Fotos extras (eventos, time, confraternizações)
- [ ] Número de WhatsApp para o "abraço de volta" (ou remover o CTA)
- [ ] Validar o tom das piadas da ficha clínica

**Enquanto não houver conteúdo, usar placeholders visíveis `[PREENCHER]`, nunca inventar fatos sobre a Charlene ou a Vitalmed.**

---

## 10. Deploy no Vercel

1. `npm run build` local sem erros.
2. Subir a pasta `site/` num repositório GitHub (privado) → **Import Project** no Vercel. Ele detecta Vite sozinho (build: `npm run build`, output: `dist`).
   - Alternativa sem GitHub: `npm i -g vercel` → `cd site && vercel --prod`.
3. Nome do projeto sugerido: `charlene-16` → `charlene-16.vercel.app`.
4. Depois do primeiro deploy, **atualizar a URL absoluta do `og:image`** e fazer redeploy.
5. Testar o preview colando o link em uma conversa do WhatsApp **com você mesmo** antes de mandar para ela.
6. `vercel.json` (cache de assets):
   ```json
   { "headers": [{ "source": "/(.*)\\.(png|webp|avif|woff2|glb|mp3)", "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }] }] }
   ```

### Checklist antes de enviar
- [ ] Abre rápido no 4G (testar com throttling "Fast 4G")
- [ ] Soprar as velas funciona com microfone **e** sem microfone
- [ ] iPhone Safari: permissões de mic/giroscópio pedidas no clique, sem tela branca
- [ ] Nenhum `[PREENCHER]` sobrando (`grep -r "PREENCHER" src/`)
- [ ] Preview do WhatsApp mostra a imagem
- [ ] Sem erros no console
- [ ] Ortografia revisada (é um presente, erro de português dói)

---

## 11. Como trabalhar neste projeto (instruções para o Claude)

- Construir **seção por seção**, na ordem do roteiro, rodando `npm run dev` e conferindo em 375px e 1440px a cada etapa.
- Começar por: tokens + chrome fixo (noise, progress, rail, topbar) → Hero → Bolo 3D. Essas três etapas são o "MVP do presente". Se o tempo apertar, **é isso que tem que estar perfeito**.
- Depois: Ficha técnica → Recados → Finale → Números → Conveyor → Fitinhas → Easter eggs.
- Comentários e textos de UI em **português do Brasil**.
- Não adicionar dependências além das listadas sem motivo forte.
- Hoje é o aniversário. **Prioridade é entregar funcionando hoje**; polimento vem depois.
