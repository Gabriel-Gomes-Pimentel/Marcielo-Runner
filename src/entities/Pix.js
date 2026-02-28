import Phaser from 'phaser';

// Obstáculo que penaliza a pontuação ao colidir com o jogador.
export default class Pix extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, pos) {
        super(scene, pos.x, pos.y, 'pix');
        this.setOrigin(0.5, 1);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // Usa um frame com a área útil do PNG para remover margens transparentes.
        const texture = this.scene.textures.get('pix');
        if (texture && !texture.has('pix-main')) {
            texture.add('pix-main', 0, 860, 378, 200, 200);
        }
        this.setFrame('pix-main');

        // Tamanho visual final em cena.
        this.setDisplaySize(120, 120);

        // Não sofre gravidade para manter alinhamento na pista.
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        this.body.setVelocityY(0);
        this.body.setSize(90, 90, true);
    }
}
