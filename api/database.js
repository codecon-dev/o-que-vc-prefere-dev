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

const tableInfo = db.prepare("PRAGMA table_info(Votos)").all();
const hasIpAddress = tableInfo.some(col => col.name === 'ip_address');

if (!hasIpAddress) {
  db.exec(`ALTER TABLE Votos ADD COLUMN ip_address TEXT`);
  db.exec(`ALTER TABLE Votos ADD COLUMN voted_at TEXT`);
  db.exec(`CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_vote_per_ip ON Votos(id_enquete, ip_address)`);
}

export default db;