import Phaser from 'phaser';

// Coletável que concede ponto ao jogador.
export default class Maquininha extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, pos) {
        super(scene, pos.x, pos.y, 'maquininha');
        this.setOrigin(0.5, 1);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // Tamanho visual reduzido para leitura na plataforma.
        this.setDisplaySize(70, 120);

        // Não sofre gravidade para manter alinhamento na pista.
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        this.body.setVelocityY(0);
        this.body.setSize(55, 100, true);
    }
}
