import Phaser from 'phaser';

// Cena inicial: mostra fundo, título e botão para iniciar o jogo.
export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'menuScene' });
    }

    // Carrega os recursos usados exclusivamente no menu.
    preload() {
        this.load.image('nuvens', './graphics/cloud-bg.png');
        this.load.image('ceu', './graphics/sky-bg.png');
        this.load.image('titulo', './graphics/titulo-jogo.webp');
        this.load.image('loja', './graphics/store-bg.webp');
    }

    // Monta elementos visuais e registra interação do botão Jogar.
    create() {
        const w = this.scale.width;
        const h = this.scale.height;

        this.add
            .tileSprite(0, 0, w, h, 'ceu')
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setAlpha(0.95);

        this.spriteNuvens = this.add
            .tileSprite(0, 0, w, h * 0.18, 'nuvens')
            .setOrigin(0, 0)
            .setAlpha(0.65)
            .setScale(1.2);

        const imagemTitulo = this.add.image(w / 2, h * 0.28, 'titulo').setOrigin(0.5);
        const escalaTitulo = (w * 0.46) / imagemTitulo.width;
        imagemTitulo.setScale(escalaTitulo);

        const imagemLoja = this.add.image(w / 2, h, 'loja').setOrigin(0.5, 1);
        const escalaLoja = w / imagemLoja.width;
        imagemLoja.setScale(escalaLoja, escalaLoja);
        imagemLoja.setAlpha(0.9);

        const botaoJogar = this.add.text(w / 2, h * 0.57, 'JOGAR', {
            fontFamily: 'mania',
            fontSize: `${Math.round(h * 0.065)}px`,
            color: '#ffffff',
            backgroundColor: '#001caa',
            padding: { x: 20, y: 12 },
            align: 'center'
        }).setOrigin(0.5);

        botaoJogar.setInteractive({ useHandCursor: true });
        botaoJogar.on('pointerover', () => {
            botaoJogar.setStyle({ backgroundColor: '#6FB7FF', color: '#1B2A4A' });
            botaoJogar.setScale(1.08);
        });
        botaoJogar.on('pointerout', () => {
            botaoJogar.setStyle({ backgroundColor: '#1C6ED5', color: '#ffffff' });
            botaoJogar.setScale(1);
        });

        botaoJogar.on('pointerdown', () => this.scene.start('game'));

        this.tweens.add({
            targets: botaoJogar,
            y: botaoJogar.y - 10,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    // Move a camada superior para dar leve sensação de movimento no menu.
    update() {
        this.spriteNuvens.tilePositionX += 0.5;
    }
}
