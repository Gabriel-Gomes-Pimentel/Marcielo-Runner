import Marcielo from "../entities/Marcielo";
import Pix from "../entities/Pix";
import Maquininha from "../entities/Maquininha";
import { selecionarGerador } from "../utils";
import { configuracaoTextoMania } from "../constants";

/*
  Cena principal da partida (gameplay).

  Objetivo geral:
  - Inicializar todos os elementos visuais e físicos da corrida.
  - Gerenciar estado da sessão (pontuação, velocidade e fim de jogo).
  - Controlar entrada do jogador (teclado, clique e toque).
  - Orquestrar spawn de obstáculos/coletáveis com distribuição probabilística.
  - Atualizar movimento e colisões em tempo real no loop de renderização.

  Integrações externas relevantes:
  - Entidades de domínio: Marcielo, Pix e Maquininha.
  - Utilitário de sorteio ponderado: selecionarGerador.
  - Configuração tipográfica centralizada: configuracaoTextoMania.
  - APIs do Phaser: Scene, Physics, Sound, Time, Geom e Registry.
*/
export default class CenaJogo extends Phaser.Scene {
  /**
   * Construtor padrão da cena.
   *
   * Responsabilidade:
   * - Registrar a chave única da cena no Phaser para permitir transições via scene.start.
   */
  constructor() {
    super({ key: "jogo" });
  }

  /**
   * Hook de inicialização da cena executado uma única vez por entrada na cena.
   *
   * Responsabilidades principais:
   * - Construir camadas visuais (céu, fundos, nuvens e rua).
   * - Inicializar HUD e instruções de uso.
   * - Configurar chão físico invisível para colisão.
   * - Instanciar personagem principal e vínculo de colisão.
   * - Registrar entradas do jogador para pulo.
   * - Configurar grupos e geradores de objetos dinâmicos.
   *
   * @returns {void}
   */
  create() {
    /*
      Controle de estado da partida para evitar
      múltiplos gatilhos de fim de jogo no mesmo frame.
    */
    this.estaEmFimDeJogo = false;

    const cacheAudio = this.cache?.audio;
    const possuiCidade =
      cacheAudio &&
      typeof cacheAudio.exists === "function" &&
      cacheAudio.exists("cidade");

    if (possuiCidade) {
      this.ambienteCidade = this.sound.add("cidade", { volume: 0.2, loop: true });
      this.ambienteCidade.play();
    }

    // Centro da tela utilizado como referência para textos e elementos centralizados.
    const posicaoCentral = { x: this.scale.width / 2, y: this.scale.height / 2 };

    // Estado de progressão da partida: pontuação acumulada e fator global de deslocamento.
    this.pontuacao = 0;
    this.velocidade = 0.16;

    /*
      Fundo do jogo usando as mesmas artes do menu:
      céu como base e nuvens com leve movimento horizontal.
    */
    this.fundoCeu = this.add.image(0, 0, "ceu");
    this.fundoCeu.setOrigin(0);
    this.fundoCeu.setDisplaySize(this.scale.width, this.scale.height);
    this.fundoCeu.setAlpha(0.95);

    // Camada de cidade posicionada ao fundo para aumentar profundidade visual do cenário.
    this.camadaFundoUm = this.add.image(0, this.scale.height, "camadaFundoUm");
    this.camadaFundoUm.setOrigin(0, 1);
    this.camadaFundoUm.setScale(this.scale.width / this.camadaFundoUm.width);
    this.camadaFundoUm.setDepth(1);

    // Nuvens em tileSprite para permitir deslocamento contínuo (efeito de parallax simples).
    this.fundoNuvens = this.add.tileSprite(0, 0, this.scale.width, this.scale.height * 0.32, "nuvens");
    this.fundoNuvens.setOrigin(0);
    this.fundoNuvens.setAlpha(0.75);
    this.fundoNuvens.setScale(1.45);
    this.fundoNuvens.setDepth(2);

    // A rua é desenhada com largura propositalmente maior que a viewport para evitar bordas visíveis.
    const larguraRua = this.scale.width * 1.8;
    this.plataformas = this.add.image((this.scale.width - larguraRua) / 2, this.scale.height, "plataformas");
    this.plataformas.setOrigin(0, 0.95);
    this.plataformas.setDisplaySize(larguraRua, 1000);
    this.plataformas.setDepth(10);

    // HUD de pontuação com tipografia global e contraste escuro para leitura sobre céu claro.
    this.textoPontuacao = this.add.text(20, 20, `PONTOS : ${this.pontuacao}`, {
      ...configuracaoTextoMania,
      fontSize: 64,
      color: "#000000",
    });
    this.textoPontuacao.setDepth(60);

    // Mensagem de onboarding exibida até o primeiro pulo do jogador.
    this.textoComoJogar = this.add
      .text(posicaoCentral.x, posicaoCentral.y, "Aperte Espaço/Clique/Toque para Pular!", {
        ...configuracaoTextoMania,
        fontSize: 64,
      })
      .setOrigin(0.5);
    this.textoComoJogar.setDepth(60);

    /*
      Chão invisível responsável apenas pela colisão física.
      A arte visível do piso é controlada separadamente pelo tileSprite.
    */
    const grupoChao = this.physics.add.staticGroup();
    this.chao = grupoChao.create(960, 950);
    this.chao.setSize(1920, 110);
    this.chao.setVisible(false);

    // Entidade principal controlada pelo usuário.
    this.marcielo = new Marcielo(this, 200, 825);
    this.marcielo.setDepth(20);

    // Regra de negócio de física: personagem deve colidir com o chão para resetar estado de pulo.
    this.physics.add.collider(this.marcielo, this.chao);

    /*
      Rotina de entrada do pulo.
      Regras:
      - Na primeira interação, remove texto de instrução para reduzir ruído visual.
      - Sempre delega para a entidade do jogador validar/executar o pulo.
    */
    const logicaPulo = (pointer) => {
      // Ignora cliques/toques fora da área útil para evitar ações propositadamente inválidas.
      const eventoEhPonteiro =
        pointer &&
        typeof pointer.x === "number" &&
        typeof pointer.y === "number";

      if (eventoEhPonteiro) {
        const cliqueDentroDaTela =
          pointer.x >= 0 &&
          pointer.y >= 0 &&
          pointer.x <= this.scale.width &&
          pointer.y <= this.scale.height;

        if (!cliqueDentroDaTela) return;
      }

      // Evita chamada de pulo quando a entidade ainda não está pronta.
      if (!this.marcielo || !this.marcielo.active) return;

      if (this.textoComoJogar) this.textoComoJogar.destroy();
      this.marcielo.pular();
    };

    // Entrada por teclado (desktop).
    if (this.input.keyboard) {
      this.input.keyboard.enabled = true;
      this.input.keyboard.addCapture("SPACE");
      this.input.keyboard.on("keydown-SPACE", logicaPulo);
    }

    // Garante foco no canvas para melhorar captura de teclado entre navegadores.
    const canvasJogo = this.game && this.game.canvas;
    if (canvasJogo && typeof canvasJogo.setAttribute === "function") {
      canvasJogo.setAttribute("tabindex", "0");
      canvasJogo.focus();
    }

    // Fallback global para casos em que o navegador não mantém foco no canvas.
    this.manipuladorTeclaGlobal = (evento) => {
      const teclaEspaco =
        evento.code === "Space" ||
        evento.key === " " ||
        evento.key === "Spacebar" ||
        evento.key === "Space";

      if (!teclaEspaco) return;
      evento.preventDefault();
      logicaPulo();
    };
    document.addEventListener("keydown", this.manipuladorTeclaGlobal, true);

    // Entrada por ponteiro (mouse e toque), mantendo compatibilidade mobile.
    this.input.on("pointerdown", logicaPulo);

    // Limpeza de listeners para evitar múltiplos binds ao reiniciar a cena.
    this.events.once("shutdown", () => {
      if (this.input && this.input.keyboard) {
        this.input.keyboard.off("keydown-SPACE", logicaPulo);
      }

      this.input.off("pointerdown", logicaPulo);

      if (this.manipuladorTeclaGlobal) {
        document.removeEventListener("keydown", this.manipuladorTeclaGlobal, true);
        this.manipuladorTeclaGlobal = null;
      }
    });

    // Grupos de gerenciamento para iteração, lifecycle e colisões manuais por bounding box.
    this.grupoPix = this.add.group();
    this.grupoMaquininhas = this.add.group();

    /**
     * Cria e registra um obstáculo Pix na borda direita da tela.
     *
     * Regra de spawn:
     * - Surge fora da viewport para entrar em movimento no frame seguinte.
     *
     * @returns {void}
     */
    const gerarPix = () => {
      const pix = new Pix(this, new Phaser.Math.Vector2(1950, 885));
      pix.setDepth(20);
      this.grupoPix.add(pix);
    };

    /**
     * Cria e registra uma maquininha coletável na borda direita da tela.
     *
     * Regra de spawn:
     * - Mantém faixa vertical próxima ao chão para coerência com o fluxo de coleta.
     *
     * @returns {void}
     */
    const gerarMaquininha = () => {
      const maquininha = new Maquininha(this, new Phaser.Math.Vector2(1950, 890));
      maquininha.setDepth(20);
      this.grupoMaquininhas.add(maquininha);
    };

    /*
      Geração contínua de obstáculos e coletáveis com pesos.
      O sorteio respeita probabilidade definida para cada tipo de objeto.
    */

    /**
     * Agenda spawns indefinidamente usando intervalo variável e seleção ponderada.
     *
     * Regra de negócio:
     * - Pix possui maior probabilidade (0.62) por representar ameaça recorrente.
     * - Maquininha possui menor probabilidade (0.38) para balancear ganho de pontos.
     * - Intervalo randômico evita padrão previsível e aumenta desafio.
     *
     * @returns {void}
     */
    const gerarObjetosPeriodicamente = () => {
      const geradores = [gerarPix, gerarMaquininha];
      const pesosGeradores = [0.62, 0.38];

      // Seleciona o gerador com base em probabilidade ponderada (não uniforme).
      const geradorEscolhido = selecionarGerador(geradores, pesosGeradores);

      if (typeof geradorEscolhido === "function") {
        geradorEscolhido();
      }

      // Reagenda recursivamente para manter pipeline contínuo de objetos na cena.
      this.time.delayedCall(Phaser.Math.Between(900, 1500), () => {
        gerarObjetosPeriodicamente();
      });
    };

    /*
      Pequena pausa inicial para o jogador se preparar
      antes de iniciar o fluxo de objetos.
    */
    this.time.delayedCall(1000, () => {
      gerarObjetosPeriodicamente();
    });

  }

  /**
   * Loop de atualização executado a cada frame.
   *
   * Responsabilidades:
   * - Atualizar animação de nuvens.
   * - Processar ciclo de vida (destruição off-screen) dos objetos dinâmicos.
   * - Detectar colisões por interseção retangular.
   * - Aplicar regras de pontuação e transição para fim de jogo.
   * - Movimentar obstáculos/coletáveis com base no delta time.
   *
   * @param {number} _ Tempo acumulado da cena (não utilizado neste fluxo).
   * @param {number} delta Tempo (ms) transcorrido desde o último frame.
   * @returns {void}
   */
  update(_, delta) {
    // Sanitiza o delta para manter estabilidade caso o loop receba valor inválido.
    const deltaSeguro = Number.isFinite(delta) && delta > 0 ? delta : 16.67;

    // Parallax das nuvens escalonado por delta para consistência entre diferentes FPS.
    this.fundoNuvens.tilePositionX += 0.04 * deltaSeguro;

    if (!this.marcielo || !this.grupoPix || !this.grupoMaquininhas) return;

    // Snapshot dos limites do jogador no frame atual para reutilização nas interseções.
    const limitesMarcielo = this.marcielo.getBounds();

    /*
      Loop de processamento dos obstáculos (Pix).
      Fluxo de decisão:
      1) Ignora objetos inativos.
      2) Remove objetos fora da tela para liberar memória.
      3) Em colisão válida, dispara estado de fim de jogo (uma única vez).
      4) Se não colidiu, aplica deslocamento horizontal.
    */
    this.grupoPix.getChildren().forEach((pix) => {
      // Guard clause para evitar trabalho desnecessário com entidades já invalidadas.
      if (!pix.active) return;

      // Condição de descarte quando o objeto ultrapassa a borda esquerda da tela.
      if (pix.x < 0) {
        pix.destroy();
        return;
      }

      // Colisão com Pix encerra a partida e persiste a pontuação atual no registry.
      if (
        !this.estaEmFimDeJogo &&
        Phaser.Geom.Intersects.RectangleToRectangle(
          limitesMarcielo,
          pix.getBounds()
        )
      ) {
        this.estaEmFimDeJogo = true;
        pix.destroy();
        this.sound.play("dano", { volume: 0.5 });
        if (this.ambienteCidade && this.ambienteCidade.isPlaying) {
          this.ambienteCidade.stop();
        }
        this.registry.set("pontuacao", this.pontuacao);
        this.scene.start("fimDeJogo");
        return;
      }

      // Velocidade do obstáculo ajustada por delta para manter previsibilidade temporal.
      pix.x -= 5 * this.velocidade * deltaSeguro;
    });

    /*
      Loop de processamento dos coletáveis (Maquininha).
      Fluxo de decisão:
      1) Ignora objetos inativos.
      2) Remove objetos fora da tela.
      3) Em colisão válida, toca som, soma ponto e atualiza HUD.
      4) Se não coletou, mantém deslocamento contínuo.
    */
    this.grupoMaquininhas.getChildren().forEach((maquininha) => {
      // Guard clause para não processar entidades destruídas/inativas.
      if (!maquininha.active) return;

      // Coletáveis fora da área útil são descartados para evitar acúmulo no heap.
      if (maquininha.x < 0) {
        maquininha.destroy();
        return;
      }

      // Colisão com maquininha incrementa pontuação e reforça feedback audiovisual.
      if (
        !this.estaEmFimDeJogo &&
        Phaser.Geom.Intersects.RectangleToRectangle(
          limitesMarcielo,
          maquininha.getBounds()
        )
      ) {
        this.sound.play("coleta");
        maquininha.destroy();
        this.pontuacao += 1;
        this.textoPontuacao.setText(`PONTOS : ${this.pontuacao}`);
        return;
      }

      // Coletável se move levemente mais lento que Pix para equilíbrio de risco/recompensa.
      maquininha.x -= 4 * this.velocidade * deltaSeguro;
    });
  }
}
