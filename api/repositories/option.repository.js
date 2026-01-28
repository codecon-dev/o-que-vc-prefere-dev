import db from '../database.js';

export function createOption(poolId, name) {
  return db
    .prepare('INSERT INTO Opcoes (id_enquete, nome) VALUES (?, ?)')
    .run(poolId, name);
}

export function listOptionsByPool(poolId) {
  return db
    .prepare('SELECT * FROM Opcoes WHERE id_enquete = ?')
    .all(poolId);
}