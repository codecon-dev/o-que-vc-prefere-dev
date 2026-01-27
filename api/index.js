import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';
import fs from 'fs';

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database('dev.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS Enquetes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    json_id INTEGER,
    data_inicio TEXT,
    data_fim TEXT,
    expirada INTEGER DEFAULT 0
  );
  CREATE TABLE IF NOT EXISTS Opcoes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_enquete INTEGER,
    nome TEXT,
    FOREIGN KEY (id_enquete) REFERENCES Enquetes(id)
  );
  CREATE TABLE IF NOT EXISTS Votos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    id_enquete INTEGER,
    id_opcao INTEGER,
    FOREIGN KEY (id_enquete) REFERENCES Enquetes(id),
    FOREIGN KEY (id_opcao) REFERENCES Opcoes(id)
  );
`);

const DURATION = 2;

const getRawPolls = () => JSON.parse(fs.readFileSync('./votacao_opcoes_60.json', 'utf8')).votacao;

const pickPoll = () => {
  const polls = getRawPolls();
  const used = db.prepare('SELECT json_id FROM Enquetes').all().map(r => r.json_id);
  const pool = polls.filter(p => !used.includes(p.id));
  return (pool.length ? pool : polls)[Math.floor(Math.random() * (pool.length || polls.length))];
};

const rotatePoll = () => {
  const data = pickPoll();
  const start = new Date();
  const end = new Date(start.getTime() + DURATION * 3600000);
  const { lastInsertRowid: pollId } = db.prepare('INSERT INTO Enquetes (json_id, data_inicio, data_fim) VALUES (?, ?, ?)').run(data.id, start.toISOString(), end.toISOString());
  db.prepare('INSERT INTO Opcoes (id_enquete, nome) VALUES (?, ?)').run(pollId, data.opcao_a);
  db.prepare('INSERT INTO Opcoes (id_enquete, nome) VALUES (?, ?)').run(pollId, data.opcao_b);
  return pollId;
};

const resolveActive = () => {
  let poll = db.prepare('SELECT * FROM Enquetes WHERE expirada = 0 ORDER BY id DESC LIMIT 1').get();
  if (!poll || new Date() > new Date(poll.data_fim)) {
    if (poll) db.prepare('UPDATE Enquetes SET expirada = 1 WHERE id = ?').run(poll.id);
    return db.prepare('SELECT * FROM Enquetes WHERE id = ?').get(rotatePoll());
  }
  return poll;
};

app.get('/pools', (req, res) => {
  try {
    const poll = resolveActive();
    const opts = db.prepare('SELECT id, nome FROM Opcoes WHERE id_enquete = ?').all(poll.id);
    const votes = db.prepare('SELECT id_opcao, COUNT(*) as c FROM Votos WHERE id_enquete = ? GROUP BY id_opcao').all(poll.id);
    const total = votes.reduce((a, v) => a + v.c, 0);
    res.json({
      id: poll.id,
      end: poll.data_fim,
      total,
      options: opts.map(o => ({ id: o.id, name: o.nome, votes: votes.find(v => v.id_opcao === o.id)?.c || 0 }))
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/vote', (req, res) => {
  const { id_option: optId } = req.body;
  if (!optId) return res.status(400).end();
  try {
    const poll = resolveActive();
    const valid = db.prepare('SELECT id FROM Opcoes WHERE id = ? AND id_enquete = ?').get(optId, poll.id);
    if (!valid) return res.status(400).end();
    db.prepare('INSERT INTO Votos (id_enquete, id_opcao) VALUES (?, ?)').run(poll.id, optId);
    const votes = db.prepare('SELECT id_opcao, COUNT(*) as c FROM Votos WHERE id_enquete = ? GROUP BY id_opcao').all(poll.id);
    res.json({
      poll: poll.id,
      total: votes.reduce((a, v) => a + v.c, 0),
      options: votes.map(v => ({ id: v.id_opcao, votes: v.c }))
    });
  } catch (e) {
    res.status(500).end();
  }
});

app.listen(3000);