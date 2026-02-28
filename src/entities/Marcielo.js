export default class Marcielo extends Phaser.GameObjects.Sprite {
  constructor(cena, x, y) {
    super(cena, x, y, "marcielo");

    this.setScale(0.34);
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    /*
      Ajuste de corpo físico para melhorar sensação de contato com o chão
      e alinhar os pés do personagem com a arte da plataforma.
    */
    this.body.setMass(10);
    const larguraHitbox = Math.max(46, this.displayWidth * 0.5);
    const alturaHitbox = Math.max(92, this.displayHeight * 0.78);
    const ajustePeVisual = -8;
    this.body.setSize(larguraHitbox, alturaHitbox);
    this.body.setOffset(
      (this.displayWidth - larguraHitbox) / 2,
      this.displayHeight - alturaHitbox + ajustePeVisual
    );

    this.velocidadePulo = -2100;
    this.somPulo = this.scene.sound.add("pulo", { volume: 0.5 });
  }

  /*
    Executa o pulo do personagem.
    O parâmetro forcarPulo é usado em situações especiais.
  */
  pular(forcarPulo) {
    if (!this.body.blocked.down && !forcarPulo) {
      return;
    }

    if ("setVelocityY" in this.body) {
      if (!this.somPulo.isPlaying) this.somPulo.play();
      this.body.setVelocityY(this.velocidadePulo);
    }
  }
}