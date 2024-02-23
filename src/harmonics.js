export function createTriangleHarmonics(n) {
  let harmonics = [0];
  for (let i = 2; i < n + 1; i++) {
    harmonics.push([i, 1 / i ** 2]);
  }
  return harmonics;
}

export function createSawtoothHarmonics(n) {
  let harmonics = [0];
  for (let i = 1; i < n + 1; i++) {
    harmonics.push([i, 1 / i]);
  }
  return harmonics;
}

export function createSquareHarmonics(n) {
  let harmonics = [0];
  for (let i = 1; i < n + 1; i++) {
    if (i % 2 === 0) {
      harmonics.push([i, 1 / i]);
    }
  }
  return harmonics;
}

export function createRuggedHarmonics(n) {
  let harmonics = [0];
  for (let i = 1; i < n + 1; i++) {
    if (i % 2 === 1) {
      harmonics.push([i, 1 / i]);
    }
  }
  return harmonics;
}
