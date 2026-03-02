# Marcielo Runner

Jogo do gênero Endless Runner desenvolvido com Phaser, em que o personagem Marcielo corre continuamente por um cenário urbano futurista, desviando de obstáculos e coletando itens para aumentar a pontuação.

## Sumário

- [Visão geral](#visão-geral)
- [Demonstração](#demonstração)
- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Requisitos](#requisitos)
- [Instalação e execução local](#instalação-e-execução-local)
- [Como jogar](#como-jogar)
- [Scripts disponíveis](#scripts-disponíveis)
- [Deploy no GitLab Pages](#deploy-no-gitlab-pages)
- [Solução de problemas](#solução-de-problemas)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Critérios acadêmicos atendidos](#critérios-acadêmicos-atendidos)

## Visão geral

Este projeto é uma adaptação inspirada no estilo de corrida infinita popularizado em exemplos como Sonic Runner, com personalização de tema, personagem e itens:

- Sonic → Marcielo (personagem principal)
- Ring → Maquininha (coletável)
- Motobug → Pix (obstáculo)

O jogo mantém a arquitetura em cenas, progressão de dificuldade e sistema de pontuação com persistência local.

## Demonstração

Acesse a versão publicada:

https://ponderada-dragao-8fbc42.pages.git.inteli.edu.br/

## Funcionalidades

- Corrida infinita com aumento gradual de dificuldade
- Sistema de spawn com pesos para entidades
- Coleta de itens para pontuação
- Colisão com obstáculos e tela de fim de jogo
- Pontuação atual e melhor pontuação com `localStorage`
- Suporte a teclado, mouse e toque

## Tecnologias

- JavaScript (ES Modules)
- Phaser
- Vite
- GitLab Pages (deploy)

## Requisitos

Antes de começar, você precisa ter instalado:

- Node.js (versão LTS recomendada)
- npm

## Instalação e execução local

1. Instale as dependências:

   ```bash
   npm install
   ```

2. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

3. Abra a URL exibida no terminal (geralmente `http://localhost:5173`).

## Como jogar

- `Espaço`: pular
- `Clique` do mouse: pular
- `Toque` na tela (mobile): pular

Objetivo:

- Colete `Maquininhas` para aumentar a pontuação.
- Evite `Pix`; ao colidir, a partida termina.

## Scripts disponíveis

- `npm run dev`: executa em modo de desenvolvimento
- `npm run build`: gera build de produção em `dist/`
- `npm run preview`: executa preview local da build de produção

## Deploy no GitLab Pages

O deploy é feito via pipeline com o job `pages` definido em `.gitlab-ci.yml`.

Fluxo de publicação:

1. Faça commit das alterações.
2. Envie para a branch `main`.
3. Aguarde o pipeline finalizar com sucesso.
4. Acesse a URL pública do projeto.

## Solução de problemas

### Erro `Failed to load resource: net::ERR_HTTP2_PROTOCOL_ERROR`

Se esse erro aparecer no navegador:

- Faça hard refresh (`Ctrl + F5`) ou teste em aba anônima.
- Confirme que o último pipeline da `main` está verde.
- Verifique se a URL acessada é a URL atual do GitLab Pages.
- Rode um novo pipeline (novo commit) para invalidar artefatos em cache, se necessário.

Observação técnica: o projeto já está configurado com caminhos relativos no build (`base: "./"`) e carregamento de assets com `import.meta.env.BASE_URL`, reduzindo problemas de resolução de recursos no Pages.

## Estrutura do projeto

```text
.
├─ public/
│  ├─ fonts/
│  ├─ graphics/
│  └─ sounds/
├─ src/
│  ├─ entities/
│  ├─ scenes/
│  ├─ constants.js
│  ├─ main.js
│  └─ utils.js
├─ index.html
├─ vite.config.js
└─ .gitlab-ci.yml
```

## Critérios acadêmicos atendidos

### 1) Execução do código

- Fluxo principal validado com build de produção.
- Sorteio ponderado com tratamento de entradas inválidas e fallback seguro.
- Salvaguardas implementadas para interações e estados inválidos.

### 2) Comentários explicativos

- Comentários organizados por blocos funcionais (cenas, física, spawn, HUD e persistência).
- Escrita objetiva para facilitar manutenção.

### 3) Nomeação de variáveis

- Padrão `camelCase` em variáveis e atributos.
- Nomes semânticos alinhados ao domínio do jogo.

### 4) Indentação e organização

- Indentação consistente em 2 espaços.
- Blocos condicionais e loops com legibilidade priorizada.
