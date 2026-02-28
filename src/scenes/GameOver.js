import { configuracaoTextoMania, classificacoes } from "../constants";

export default class CenaFimDeJogo extends Phaser.Scene {
  constructor() {
    super({ key: "fimDeJogo" });
  }

  /*
    Desenha um texto centralizado de pontuação.
    Utilizado para pontuação atual e melhor pontuação.
  */
  adicionarTextoPontuacao(posicaoX, posicaoY, texto) {
    this.add
      .text(posicaoX, posicaoY, texto, {
        ...configuracaoTextoMania,
        fontSize: 64,
      })
      .setOrigin(0.5);
  }

  /*
    Cria uma caixa visual para exibir a classificação por rank.
  */
  adicionarCaixaPontuacao(posicaoX, posicaoY, textoRank) {
    const caixa = this.add.rectangle(posicaoX, posicaoY, 500, 500, "#000000");
    caixa.setOrigin(0.5);
    caixa.setStrokeStyle(4, 0xffffff);
    const rank = this.add.text(caixa.x, caixa.y, textoRank, {
      ...configuracaoTextoMania,
      fontSize: 128,
    });
    rank.setOrigin(0.5);
  }

  create() {
    // Garante valor numérico válido vindo do registry, mesmo em cenários de inicialização anômala.
    const pontuacaoAtual = Number(this.registry.get("pontuacao"));
    const pontuacao = Number.isFinite(pontuacaoAtual) && pontuacaoAtual >= 0 ? pontuacaoAtual : 0;

    // Leitura resiliente do localStorage para evitar quebra caso o JSON esteja corrompido.
    const dadosMelhorPontuacao = localStorage.getItem("melhor-pontuacao");
    let melhorPontuacao = 0;

    try {
      const melhorPontuacaoSalva = JSON.parse(dadosMelhorPontuacao);
      const valorSalvo = Number(melhorPontuacaoSalva?.valor);
      melhorPontuacao = Number.isFinite(valorSalvo) && valorSalvo >= 0 ? valorSalvo : 0;
    } catch {
      melhorPontuacao = 0;
    }

    if (melhorPontuacao < pontuacao) {
      localStorage.setItem("melhor-pontuacao", JSON.stringify({ valor: pontuacao }));
      melhorPontuacao = pontuacao;
    }

    let rankAtual = "F";
    let melhorRank = "F";

    for (const grau in classificacoes) {
      const valor = classificacoes[grau];
      if (valor < pontuacao) rankAtual = grau;
      if (valor < melhorPontuacao) melhorRank = grau;
    }

    const posicaoCentral = { x: this.scale.width / 2, y: this.scale.height / 2 };
    const textoFimDeJogo = this.add.text(posicaoCentral.x, 100, "FIM DE JOGO!", {
      ...configuracaoTextoMania,
      fontSize: 96,
    });
    textoFimDeJogo.setOrigin(0.5);

    this.adicionarTextoPontuacao(posicaoCentral.x - 500, 250, `PONTOS ATUAIS : ${pontuacao}`);
    this.adicionarTextoPontuacao(posicaoCentral.x + 500, 250, `MELHOR PONTUAÇÃO : ${melhorPontuacao}`);
    this.adicionarCaixaPontuacao(posicaoCentral.x - 500, 600, rankAtual);
    this.adicionarCaixaPontuacao(posicaoCentral.x + 500, 600, melhorRank);

    this.time.delayedCall(1000, () => {
      this.add
        .text(posicaoCentral.x, 950, "Aperte Espaço/Clique/Toque para Jogar Novamente", {
          ...configuracaoTextoMania,
          fontSize: 64,
        })
        .setOrigin(0.5);

      const reiniciarJogo = () => {
        this.scene.start("jogo");
      };

      // O Phaser só dispara pointerdown dentro do canvas, mantendo proteção natural contra cliques externos.
      this.input.keyboard.on("keydown-SPACE", reiniciarJogo);
      this.input.on("pointerdown", reiniciarJogo);
    });
  }
}
