import Phaser from 'phaser';
import Loader from './scenes/Loader';
import MenuScene from './scenes/MenuScene';
import Game from './scenes/Game';

// Configuração principal do jogo (tela, física, cenas e contêiner HTML).
const config = {
    width: 1920,
    height: 1080,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    parent: 'app',
    scene: [Loader, MenuScene, Game],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 4000 },
            debug: false
        },
    },
};

// Inicializa o jogo com a configuração definida acima.
new Phaser.Game(config);