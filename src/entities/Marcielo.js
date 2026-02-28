import Phaser from 'phaser';

// Entidade do jogador com física Arcade e ação de pulo.
export default class Marcielo extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, 'marcielo');
        this.setScale(0.28);
        this.setOrigin(0.5, 1);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // Ajustes de corpo físico para colisão mais precisa.
        this.body.setMass(10);
        this.body.setSize(100, 28);
        this.body.setOffset(206, 96);

        this.jumpVelocity = -2100;
    }

    // Aplica impulso vertical para o pulo.
    jump() {
        if ('setVelocityY' in this.body) {
            this.body.setVelocityY(this.jumpVelocity);
        }
    }
}
