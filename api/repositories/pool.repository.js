import db from '../database.js';

export function createPool(nome, dataFim) {
  return db
    .prepare('INSERT INTO Enquetes (nome_enquete, data_fim, expirada) VALUES (?, ?, 0)')
    .run(nome, dataFim);
}

export function getPool(id) {
  return db
    .prepare("SELECT * FROM Enquetes WHERE id = ?")
    .get(id);
}

export function expirePool(id) {
  return db
    .prepare("UPDATE Enquetes SET expirada = 1 WHERE id = ?")
    .run(id);
}