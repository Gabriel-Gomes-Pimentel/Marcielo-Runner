import Phaser from 'phaser';

// Obstáculo que penaliza a pontuação ao colidir com o jogador.
export default class Pix extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, pos) {
        super(scene, pos.x, pos.y, 'pix');
        this.setOrigin(0.5, 1);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // Tamanho visual reduzido para leitura na plataforma.
        this.setDisplaySize(90, 90);

        // Não sofre gravidade para manter alinhamento na pista.
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        this.body.setVelocityY(0);
        this.body.setSize(70, 70, true);
    }
}
