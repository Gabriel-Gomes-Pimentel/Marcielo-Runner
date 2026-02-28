export default class Maquininha extends Phaser.GameObjects.Sprite {
  constructor(cena, posicao) {
    super(cena, posicao.x, posicao.y, "maquininha");

    this.setScale(0.45);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    /*
      Objeto coletável sem gravidade.
      A hitbox é reduzida para o contato ficar justo com a arte.
    */
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    const larguraHitbox = this.displayWidth * 0.7;
    const alturaHitbox = this.displayHeight * 0.72;
    this.body.setSize(larguraHitbox, alturaHitbox);
    this.body.setOffset(
      (this.displayWidth - larguraHitbox) / 2,
      this.displayHeight - alturaHitbox
    );
  }
}