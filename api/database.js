import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'dev.db')

const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS Enquetes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome_enquete TEXT,
    data_fim TEXT,
    expirada INTEGER
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS Opcoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_enquete INTEGER,
    nome TEXT,
    FOREIGN KEY (id_enquete) REFERENCES Enquetes(id)
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS Votos (
    id_enquete INTEGER,
    id_opcao INTEGER,
    FOREIGN KEY (id_enquete) REFERENCES Enquetes(id),
    FOREIGN KEY (id_opcao) REFERENCES Opcoes(id)
  )
`);

export default db;