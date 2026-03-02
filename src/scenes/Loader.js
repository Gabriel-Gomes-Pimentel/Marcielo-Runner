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
    const baseUrl = import.meta.env.BASE_URL === "./" ? "" : import.meta.env.BASE_URL;
    const assetUrl = (caminho) => `${baseUrl}${caminho}`;

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

    this.load.image("marcielo", assetUrl("graphics/marcielo-cropped.png"));
    this.load.image("pix", assetUrl("graphics/pix-cropped.png"));
    this.load.image("maquininha", assetUrl("graphics/maquininha-cropped.png"));

    this.load.image("plataformas", assetUrl("graphics/rua-plataforma.png"));
    this.load.image("camadaFundoUm", assetUrl("graphics/bgFirstLayer.png"));

    this.load.audio("pulo", assetUrl("sounds/Jump.wav"));
    this.load.audio("coleta", assetUrl("sounds/Ring.wav"));
    this.load.audio("dano", assetUrl("sounds/Hurt.wav"));
    this.load.audio("cidade", assetUrl("sounds/city.mp3"));
  }

  async create() {
    this.textures.get("marcielo").setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.textures.get("pix").setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.textures.get("maquininha").setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.textures.get("plataformas").setFilter(Phaser.Textures.FilterMode.NEAREST);
    this.textures.get("camadaFundoUm").setFilter(Phaser.Textures.FilterMode.NEAREST);

    // Salvaguarda: se a fonte falhar, o jogo segue com fonte padrão para não bloquear execução.
    try {
      await this.carregarFonte("mania", `${baseUrl}fonts/mania.ttf`);
    } catch {
      // Mantém fluxo sem interromper a navegação entre cenas.
    }

    this.scene.start("menuScene");
  }
}
