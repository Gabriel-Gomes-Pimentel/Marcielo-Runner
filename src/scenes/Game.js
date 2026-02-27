import Phaser from 'phaser';

export default class Game extends Phaser.Scene {
    constructor() {
        super({ 'key': 'game' });
    }

    create() {
        const centerPos = {
            x: this.scale.width / 2,
            y: this.scale.height / 2,
        };

        this.score = 0;
        this.speed = 0.1;

        this.background = this.add.tileSprite(0, -100, 0, 0, "chemical-bg");
        this.background.setScale(2);
        this.background.setOrigin(0);

        this.platforms = this.add.tileSprite(0, -950, 0, 0, "platforms");
        this.platforms.setScale(4);
        this.platforms.setOrigin(0);

        const groundGroup = this.physics.add.staticGroup();
        this.ground = groundGroup.create(960, 920);
        this.ground.setSize(1920, 160);
        this.ground.setVisible(false);
    }

    update() {
        this.background.tilePositionX += 0.05 * this.game.loop.delta;
        this.platforms.tilePositionX += this.speed * this.game.loop.delta;
    }
}

