export default class CenaCarregamento extends Phaser.Scene {
  constructor() {
    super({ key: "carregador" });
  }

  /*
    Carrega a fonte personalizada de forma assíncrona
    para garantir que os textos usem o estilo correto.
  */
  async carregarFonte(nomeFonte, urlFonte) {
    const novaFonte = new FontFace(nomeFonte, `url(${urlFonte})`);
    const fonteCarregada = await novaFonte.load();
    if (fonteCarregada) {
      document.fonts.add(fonteCarregada);
      return;
    }

    throw new Error("Não foi possível carregar a fonte");
  }

  preload() {
    const larguraTela = this.scale.width;
    const alturaTela = this.scale.height;
    const baseUrl = import.meta.env.BASE_URL;

    this.load.setPath(baseUrl);

    /*
      Barra simples de progresso para feedback visual
      durante o carregamento de recursos.
    */
    const barraProgresso = this.add.graphics();

    this.load.on("progress", (valor) => {
      barraProgresso.clear();
      barraProgresso.fillStyle(0xffffff, 1);
      barraProgresso.fillRect(0, alturaTela - 30, larguraTela * valor, 30);
    });

    this.load.on("complete", () => barraProgresso.destroy());

    this.load.image("marcielo", "graphics/marcielo-cropped.png");
    this.load.image("pix", "graphics/pix-cropped.png");
    this.load.image("maquininha", "graphics/maquininha-cropped.png");

    this.load.image("plataformas", "graphics/rua-plataforma.png");
    this.load.image("camadaFundoUm", "graphics/bgFirstLayer.png");
    this.load.image("camadaFundoDois", "graphics/bgSecondLayer.png");

    this.load.audio("pulo", "sounds/Jump.wav");
    this.load.audio("coleta", "sounds/Ring.wav");
    this.load.audio("dano", "sounds/Hurt.wav");
    this.load.audio("cidade", "sounds/city.mp3");
  }

  async create() {
    this.textures.get("marcielo").setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.textures.get("pix").setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.textures.get("maquininha").setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.textures.get("plataformas").setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.textures.get("camadaFundoUm").setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.textures.get("camadaFundoDois").setFilter(Phaser.Textures.FilterMode.NEAREST);

    // Salvaguarda: se a fonte falhar, o jogo segue com fonte padrão para não bloquear execução.
    try {
      await this.carregarFonte("mania", `${import.meta.env.BASE_URL}fonts/mania.ttf`);
    } catch {
      // Mantém fluxo sem interromper a navegação entre cenas.
    }

    this.scene.start("menuScene");
  }
}
