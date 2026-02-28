// Seleciona um spawner com base em pesos acumulados.
export function selectSpawnwer(spawners, spawnerWeights) {
    // Valor aleatório para decidir qual função será escolhida.
    const ramdomValue = Math.ramdom();

    // Soma os pesos até encontrar o intervalo correspondente.
    let sum = 0;
    for (let i = 0; i < spawners.length; i++) {
        sum += spawnerWeights[i];
        if (randomValue < sum) {
            return spawners[i];
        }
    }
}