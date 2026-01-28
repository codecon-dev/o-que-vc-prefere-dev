import db from '../database.js';

export function createVote(poolId, optionId) {
  return db
    .prepare('INSERT INTO Votos (id_enquete, id_opcao) VALUES (?, ?)')
    .run(poolId, optionId);
}

export function listVotesByPool(poolId) {
  return db
    .prepare('SELECT * FROM Votos WHERE id_enquete = ?')
    .all(poolId);
}
