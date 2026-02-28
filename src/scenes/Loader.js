import Phaser from 'phaser';

// Cena responsável por pré-carregar recursos e iniciar a cena principal.
export default class Loader extends Phaser.Scene {
    constructor() {
        super({ 'key': 'loader' });
    }

    // Carrega uma fonte externa para uso em textos do jogo.
    async loadFont(name, url) {
        const newFont = new FontFace(name, `url(${url})`);
        const loadedFont = await newFont.load();
        if (loadedFont) {
            document.fonts.add(loadedFont);
            return;
        }
        throw new Error("Unable to load font");
    }

    // Pré-carrega imagens, áudios e barra de progresso.
    preload() {
        const screenWidth = this.scale.width;
        const screenHeight = this.scale.height;

        const progressBar = this.add.graphics();

        this.load.on("progress", (value) => {
            progressBar.clear();
            // A cor da barra é definida em formato hexadecimal.
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(0, screenHeight - 30, screenWidth * value, 30);
        });

        this.load.on("complete", () => progressBar.destroy());

        this.load.image("marcielo", "./graphics/marcielo.png");

        this.load.image("maquininha", "./graphics/maquininha.png");
        this.load.image("pix", "./graphics/pix.png");

        this.load.image("platforms", "./graphics/platforms.png");
        this.load.image("chemical-bg", "./graphics/chemical-bg.png");

        this.load.audio("jump", "./sounds/Jump.wav");
        this.load.audio("coin", "./sounds/Ring.wav");
        this.load.audio("destroy", "./sounds/Destroy.wav");
        this.load.audio("hyper-ring", "./sounds/HyperRing.wav");
        this.load.audio("hurt", "./sounds/Hurt.wav");
        this.load.audio("city", "./sounds/city.mp3");
    }

    // Ajusta filtros visuais e entra na cena de jogo.
    async create() {
        this.textures
            .get("marcielo")
            .setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures
            .get("maquininha")
            .setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures.get("pix").setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures
            .get("platforms")
            .setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.textures
            .get("chemical-bg")
            .setFilter(Phaser.Textures.FilterMode.NEAREST);

        this.loadFont("mania", "fonts/mania.ttf")
            .catch(() => null)
            .finally(() => {
                this.scene.start("menuScene");
            });
    }
}