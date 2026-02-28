/*
  Seleciona um gerador com base em pesos.
  Quanto maior o peso, maior a probabilidade de ser escolhido.
*/
export function selecionarGerador(geradores, pesosGeradores) {
  // Salvaguarda para entradas inválidas: evita retorno indefinido e chamada de função inexistente.
  if (!Array.isArray(geradores) || geradores.length === 0) return () => {};

  // Quando os pesos não chegam válidos, o fluxo usa distribuição uniforme por padrão.
  if (!Array.isArray(pesosGeradores) || pesosGeradores.length !== geradores.length) {
    return geradores[Math.floor(Math.random() * geradores.length)] ?? (() => {});
  }

  // Sanitiza pesos para evitar NaN, negativos ou valores não numéricos afetarem o sorteio.
  const pesosNormalizados = pesosGeradores.map((peso) => {
    const pesoNumerico = Number(peso);
    return Number.isFinite(pesoNumerico) && pesoNumerico > 0 ? pesoNumerico : 0;
  });

  const somaTotalPesos = pesosNormalizados.reduce((acumulador, peso) => acumulador + peso, 0);

  // Se todos os pesos forem inválidos/zero, retorna um gerador aleatório válido.
  if (somaTotalPesos <= 0) {
    return geradores[Math.floor(Math.random() * geradores.length)] ?? (() => {});
  }

  const valorAleatorio = Math.random();
  const alvo = valorAleatorio * somaTotalPesos;

  let somaPesos = 0;
  for (let indice = 0; indice < geradores.length; indice++) {
    somaPesos += pesosNormalizados[indice];
    if (alvo < somaPesos) return geradores[indice] ?? (() => {});
  }

  // Fallback final para lidar com ruído de ponto flutuante no limite superior.
  return geradores[geradores.length - 1] ?? (() => {});
}
