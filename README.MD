# Marcielo Runner (Phaser 3)

Endless Runner em Phaser 3 adaptado da base do Sonic Runner.

## Jogue Agora

https://ponderada-dragao-8fbc42.pages.git.inteli.edu.br/

## Informações do Jogo

1. **Título do Jogo:** Marcielo Runner

2. **Contexto:** Marcielo está em uma corrida infinita por uma cidade futurista. Enquanto o cenário se move em alta velocidade, o jogador precisa desviar dos obstáculos `Pix` e coletar `Maquininhas` para aumentar a pontuação e sobreviver o maior tempo possível.

3. **Controles:**
	- `Space`: pular
	- `Clique` com o mouse: pular
	- `Toque` na tela (mobile): pular

## Inspiração

Este projeto foi inspirado no vídeo:
https://www.youtube.com/watch?v=7GlxzAcs40c

Substituições principais:
- Sonic -> Marcielo (sprite estático, sem animações)
- Ring -> Maquininha (coletável)
- Motobug -> Pix (obstáculo)

Arquitetura mantida:
- Loader Scene
- Game Scene
- GameOver Scene
- Spawn com pesos
- Progressão de velocidade e dificuldade
- TileSprite para sensação de corrida
- Score com registry/localStorage

## Prerequisites

You should have Node and NPM installed on your machine.

## How to Run

1. `npm install`
2. `npm run dev`

## How to Play

- Pressione `Space`, clique ou toque para pular.
- Colete `Maquininha` para ganhar pontos.
- Evite `Pix`; ao colidir, a partida termina.

## To Build

1. `npm run build`
2. `npm run preview` to check that the build works.

## Deploy (GitLab Pages)

1. Faça commit e push na branch `main`.
2. Aguarde o job `pages` terminar no CI/CD.
3. Abra a URL publicada do projeto.

### Se aparecer `Failed to load resource: net::ERR_HTTP2_PROTOCOL_ERROR`

- Faça hard refresh (`Ctrl + F5`) ou abra em aba anônima.
- Verifique se o último pipeline de `main` está verde.
- Confirme que a URL aberta é a URL de Pages atual (não uma antiga em cache).
- Se necessário, rode um novo pipeline (novo commit) para invalidar artefatos antigos.

Este projeto já está configurado para usar caminhos relativos no build (`base: "./"`) e carregamento de assets com `import.meta.env.BASE_URL`, o que evita quebra de arquivos estáticos no Pages.

## Critérios da Avaliação (atendidos no código)

### 1) Execução do código
- **Parâmetros default sem erro:** fluxo principal validado via `npm run build`.
- **Variação de parâmetros sem erro:** o sorteio ponderado em `src/utils.js` trata pesos inválidos, diferentes tamanhos de lista e fallback seguro.
- **Salvaguardas para erros propositais:**
	- clique/toque fora da área útil é ignorado em `src/scenes/Game.js`;
	- `delta` inválido no loop é normalizado em `src/scenes/Game.js`;
	- `localStorage` corrompido é tratado com `try/catch` em `src/scenes/GameOver.js`;
	- falha no carregamento de fonte não interrompe o jogo em `src/scenes/Loader.js`.

### 2) Comentários explicativos
- O código possui comentários por blocos funcionais (cena, física, spawn, colisão, HUD e persistência).
- Os comentários foram mantidos concisos e focados em intenção/regras de negócio para evitar poluição visual.

### 3) Nomeação de variáveis
- Padrão `camelCase` adotado em variáveis e atributos (`posicaoCentral`, `melhorPontuacao`, `grupoMaquininhas`).
- Nomes semânticos para variáveis de domínio e estado (`estaEmFimDeJogo`, `pesosGeradores`, `textoPontuacao`).
- Variáveis locais e curtas usadas apenas em escopo pequeno quando apropriado (`indice`, `peso`).
- Componentes visuais possuem nomes coerentes com o tipo/função (`imagemTitulo`, `fundoNuvens`, `camadaFundoUm`).

### 4) Indentação
- Arquivos JavaScript mantêm indentação consistente em 2 espaços e blocos alinhados.
- Estruturas condicionais e loops estão organizadas para leitura sequencial do fluxo.
