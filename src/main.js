import Phaser from 'phaser';
import Loader from './scenes/Loader';
import Game from './scenes/Game';

const config = {
    width: 1920,
    height: 1080,
    backgroundColor: '#4169e1',
    pixelArt: true,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    parent: 'game',
    scene: [Loader, Game],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 4000 },
            debug: true
        },
    },
};

new Phaser.Game(config);