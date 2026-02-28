import Phaser from "phaser";
import CenaCarregamento from "./scenes/Loader";
import MenuScene from "./scenes/MenuScene";
import CenaJogo from "./scenes/Game";
import CenaFimDeJogo from "./scenes/GameOver";

/*
  Configuração principal do jogo:
  - Define resolução base e escala responsiva
  - Registra a sequência de cenas
  - Habilita física Arcade com gravidade global
*/
const configuracao = {
  width: 1920,
  height: 1080,
  backgroundColor: "#000000",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  parent: "game",
  scene: [CenaCarregamento, MenuScene, CenaJogo, CenaFimDeJogo],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 4000 },
      debug: false,
    },
  },
};

new Phaser.Game(configuracao);
