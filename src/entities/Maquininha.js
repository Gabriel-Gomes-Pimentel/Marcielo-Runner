import Phaser from 'phaser';

// Coletável que concede ponto ao jogador.
export default class Maquininha extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, pos) {
        super(scene, pos.x, pos.y, 'maquininha');
        this.setOrigin(0.5, 1);
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);

        // Usa um frame com a área útil do PNG para remover margens transparentes.
        const texture = this.scene.textures.get('maquininha');
        if (texture && !texture.has('maquininha-main')) {
            texture.add('maquininha-main', 0, 822, 448, 232, 184);
        }
        this.setFrame('maquininha-main');

        // Tamanho visual final em cena.
        this.setDisplaySize(140, 110);

        // Não sofre gravidade para manter alinhamento na pista.
        this.body.setAllowGravity(false);
        this.body.setImmovable(true);
        this.body.setVelocityY(0);
        this.body.setSize(110, 85, true);
    }
}
