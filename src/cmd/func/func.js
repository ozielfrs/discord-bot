module.exports = {
  /**
   *
   * @param {number} n Valor mínimo a ser obtido pela randomização.
   * @param {number} m Valor máximo a ser obtido pela randomização.
   * @return {number} Número aleatório entre o mínimo e máximo.
   */
  random(n, m) {
    n = Math.ceil(n);
    m = Math.floor(m);
    return Math.floor(Math.random() * (m - n)) + n;
  },

  /**
   *
   * @param {number} m Valor máximo a ser obtido pela randomização.
   * @return {number} Número aleatório entre o 0 e número definido.
   */
  random(m) {
    m = Math.floor(m);
    return Math.floor(Math.random() * m);
  },
};
