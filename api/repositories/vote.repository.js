import db from '../database.js';

export function createVote(poolId, optionId, ipAddress) {
  const votedAt = new Date().toISOString();
  return db
    .prepare('INSERT INTO Votos (id_enquete, id_opcao, ip_address, voted_at) VALUES (?, ?, ?, ?)')
    .run(poolId, optionId, ipAddress, votedAt);
}

export function hasVoted(poolId, ipAddress) {
  const result = db
    .prepare('SELECT 1 FROM Votos WHERE id_enquete = ? AND ip_address = ? LIMIT 1')
    .get(poolId, ipAddress);
  
  return Boolean(result);
}

export function listVotesByPool(poolId) {
  return db
    .prepare('SELECT * FROM Votos WHERE id_enquete = ?')
    .all(poolId);
}
