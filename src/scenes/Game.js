import Phaser from 'phaser';
import Marcielo from '../entities/Marcielo';
import Pix from '../entities/Pix';
import Maquininha from '../entities/Maquininha';

// Referência utilizada: https://www.youtube.com/watch?v=7GlxzAcs40c

const SCORE_LABEL = 'SCORE : ';
const PIX_SPEED = 6;
const MAQUININHA_SPEED = 4;
const OBJECT_DEPTH = 9;
const SPAWNER_WEIGHTS = [0.6, 0.4];

// Escolhe uma função de surgimento com base em probabilidade ponderada.
function selectSpawner(spawners, spawnerWeights) {
    const randomValue = Math.random();
    let cumulativeWeight = 0;

    for (let index = 0; index < spawners.length; index++) {
        cumulativeWeight += spawnerWeights[index];
        if (randomValue <= cumulativeWeight) {
            return spawners[index];
        }
    }

    return spawners[spawners.length - 1];
}

// Cena principal: cria cenário, personagem, surgimento e regras de pontuação.
export default class Game extends Phaser.Scene {
    constructor() {
        super({ 'key': 'game' });

        this.spawnTimer = null;
        this.jumpHandler = null;
    }

    // Atualiza o texto de pontuação no HUD.
    updateScoreText() {
        this.scoreText.setText(`${SCORE_LABEL}${this.score}`);
    }

    // Cria um Pix fora da tela para entrar da direita para a esquerda.
    spawnPix() {
        const spawnX = this.scale.width + 30;
        const spawnY = this.groundSurfaceY;
        const pix = new Pix(this, new Phaser.Math.Vector2(spawnX, spawnY));
        pix.setDepth(OBJECT_DEPTH);
        this.pixGroup.add(pix);
    }

    // Cria uma Maquininha fora da tela para entrar da direita para a esquerda.
    spawnMaquininha() {
        const spawnX = this.scale.width + 30;
        const spawnY = this.groundSurfaceY;
        const maquininha = new Maquininha(this, new Phaser.Math.Vector2(spawnX, spawnY));
        maquininha.setDepth(OBJECT_DEPTH);
        this.maquininhas.add(maquininha);
    }

    // Agenda o próximo spawn com intervalo aleatório.
    scheduleNextSpawn() {
        const spawners = [
            () => this.spawnPix(),
            () => this.spawnMaquininha(),
        ];

        const chosenSpawner = selectSpawner(spawners, SPAWNER_WEIGHTS);
        chosenSpawner();

        this.spawnTimer = this.time.delayedCall(Phaser.Math.Between(500, 1500), () => {
            this.scheduleNextSpawn();
        });
    }

    // Remove objetos que saíram da tela para evitar acúmulo.
    cleanupOffscreenObjects() {
        for (const pix of this.pixGroup.getChildren()) {
            if (pix.x < -200) {
                pix.destroy();
            }
        }

        for (const maquininha of this.maquininhas.getChildren()) {
            if (maquininha.x < -200) {
                maquininha.destroy();
            }
        }
    }

    // Monta todos os objetos do jogo e registra eventos de entrada e colisão.
    create() {
        const centerPos = {
            x: this.scale.width / 2,
            y: this.scale.height / 2,
        };

        const maniaTextConfig = {
            fontFamily: "mania",
            resolution: 8,
        };

        // Estado inicial de pontuação e velocidade do cenário.
        this.score = 0;
        this.speed = 0.1;

        // Elementos visuais de fundo e plataforma.
        this.background = this.add.tileSprite(0, -100, 0, 0, "chemical-bg");
        this.background.setScale(2);
        this.background.setOrigin(0);
        this.background.setAlpha(0.8);

        this.platforms = this.add.tileSprite(0, -950, 0, 0, "platforms");
        this.platforms.setScale(4);
        this.platforms.setOrigin(0);


        // HUD de pontuação e instrução inicial.
        this.scoreText = this.add.text(20, 20, '', {
            fontFamily: "mania",
            resolution: 8,
            fontSize: 64,
        });
        this.updateScoreText();

        this.howToPlayText = this.add
            .text(centerPos.x, centerPos.y, "Pressione Espaço/Clique/Toque para pular!\nFuja do Pix", {
                ...maniaTextConfig,
                fontSize: 64,
            })
            .setOrigin(0.5);

        // Chão físico invisível para a colisão do personagem.
        this.ground = this.add.rectangle(960, 700, 1920, 120, 0x000000, 0);
        this.physics.add.existing(this.ground, true);

        // Y de superfície onde os obstáculos e coletáveis devem pousar visualmente.
        this.groundSurfaceY = 640;

        // Criação do personagem e acoplamento ao chão.
        this.marcielo = new Marcielo(this, 200, 640);
        this.marcielo.setDepth(10);
        this.physics.add.collider(this.marcielo, this.ground);

        // Entrada de pulo por teclado e toque/click.
        this.jumpHandler = () => {
            if (this.howToPlayText) this.howToPlayText.destroy();
            this.marcielo.jump();
        };
        this.input.keyboard.on("keydown-SPACE", this.jumpHandler);
        this.input.on("pointerdown", this.jumpHandler);

        // Grupos dos objetos que surgem durante a partida.
        this.pixGroup = this.add.group();
        this.maquininhas = this.add.group();

        // Colisão com Pix: perde ponto.
        this.physics.add.collider(this.marcielo, this.pixGroup, (_, pix) => {
            this.sound.play("hurt", { volume: 0.5 });
            this.score = Math.max(0, this.score - 1);
            this.updateScoreText();
            pix.destroy();
        });

        // Coleta de Maquininha: ganha ponto.
        this.physics.add.overlap(this.marcielo, this.maquininhas, (_, maquininha) => {
            this.sound.play("coin", { volume: 0.5 });
            maquininha.destroy();
            this.score += 1;
            this.updateScoreText();
        });

        // Spawns iniciais para feedback visual imediato.
        const initialY = this.groundSurfaceY;

        const pixInicial = new Pix(this, new Phaser.Math.Vector2(this.scale.width - 200, initialY));
        pixInicial.setDepth(OBJECT_DEPTH);
        this.pixGroup.add(pixInicial);

        const maquininhaInicial = new Maquininha(this, new Phaser.Math.Vector2(this.scale.width - 450, initialY));
        maquininhaInicial.setDepth(OBJECT_DEPTH);
        this.maquininhas.add(maquininhaInicial);

        this.scheduleNextSpawn();

        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            if (this.spawnTimer) {
                this.spawnTimer.remove(false);
            }
            if (this.jumpHandler) {
                this.input.keyboard.off("keydown-SPACE", this.jumpHandler);
                this.input.off("pointerdown", this.jumpHandler);
            }
        });
    }

    // Atualiza parallax e deslocamento dos objetos em movimento.
    update() {
        const deltaScale = this.game.loop.delta / 16.666;

        this.background.tilePositionX += 0.05 * this.game.loop.delta;
        this.platforms.tilePositionX += this.speed * this.game.loop.delta;

        for (const pix of this.pixGroup.getChildren()) {
            pix.x -= PIX_SPEED * this.speed * deltaScale;
        }

        for (const maquininha of this.maquininhas.getChildren()) {
            maquininha.x -= MAQUININHA_SPEED * this.speed * deltaScale;
        }

        this.cleanupOffscreenObjects();
    }
}


