export default class Pix extends Phaser.GameObjects.Sprite {
  constructor(cena, posicao) {
    super(cena, posicao.x, posicao.y, "pix");

    this.setScale(0.48);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    /*
      Objeto de risco sem gravidade.
      A hitbox é ajustada para aproximar o contato visual do sprite.
    */
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    const larguraHitbox = this.displayWidth * 0.68;
    const alturaHitbox = this.displayHeight * 0.75;
    this.body.setSize(larguraHitbox, alturaHitbox);
    this.body.setOffset(
      (this.displayWidth - larguraHitbox) / 2,
      this.displayHeight - alturaHitbox
    );
  }
}