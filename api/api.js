import express from 'express';
import cors from 'cors';
import Database from 'better-sqlite3';

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database('dev.db');

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

    FOREIGN KEY (id_enquete) REFERENCES Enquetes(id)
    FOREIGN KEY (id_opcao) REFERENCES Opcoes(id)
  )
`);

app.post('/createPool', (req, res) => {
  let amanha = new Date();

  amanha.setDate(amanha.getDate() + 1);

  const nome_enquete = 'TESTE 1'
  const data_fim = String(amanha)
  const expirada = 0

  const newPool = db.prepare('INSERT INTO Enquetes (nome_enquete, data_fim, expirada) VALUES (?, ?, ?)');
  const info = newPool.run(nome_enquete, data_fim, expirada);

  res.json({ 
    id: info.lastInsertRowid, 
    name: nome_enquete, 
    expired_date: data_fim, 
    expired: expirada
  });
})

app.post('/createOption', (req, res) => {
  let id_enquete = 1
  let nome = "opcao 2"

  const stmt = db.prepare('INSERT INTO Opcoes (id_enquete, nome) VALUES (?, ?)');
  const info = stmt.run(id_enquete, nome);

  res.json({ id: info.lastInsertRowid, id_enquete, nome });
})

app.post('/vote', (req, res) => {
  const { id_option} = req.body

  const pool = db.prepare(`SELECT * FROM Enquetes WHERE expirada <> 1 LIMIT 1`).all();
  const id_pool = pool[0].id
  console.log(id_pool)
  const dbPrepare = db.prepare('INSERT INTO Votos (id_enquete, id_opcao) VALUES (?, ?)');
  const info = dbPrepare.run(id_pool, id_option);

  let options = db.prepare(`SELECT * FROM Opcoes WHERE id_enquete = 1`);

  const votes = db.prepare(`SELECT * FROM Votos WHERE id_enquete = 1`).all();

  options = options.all().map((o) => {
    return votes.reduce((acc, voto) => {
      acc[voto.id_opcao] = ((acc[voto.id_opcao] || 0) + 1);
      return acc;
    }, {})
  })

  res.json({ id_pool, id_option, options, countVotes : votes.length})
})

app.get('/pools', (req, res) => {
  const currentPool = db.prepare(`SELECT * FROM Enquetes WHERE expirada <> 1 LIMIT 1`);

  let options = db.prepare(`SELECT * FROM Opcoes WHERE id_enquete = 1`);

  const votes = db.prepare(`SELECT * FROM Votos WHERE id_enquete = 1`);

  options = options.all().map((o) => {
    return {
      id: o.id,
      name: o.nome,
      votes: votes.all().reduce((acc, voto) => {
      acc[voto.id_opcao] = (acc[voto.id_opcao] || 0) + 1;
      return acc;
    }, {})
    };
  })

  const computedEnquete = {
    id: currentPool.all()[0].id,
    name: currentPool.all()[0].nome_enquete,
    expired_date: currentPool.all()[0].data_fim,
    options,
    countVotes: votes.length
  }

  res.json(computedEnquete);
});

app.post('/updatePool', (req, res) => {
  const updatePool = db.prepare('UPDATE Enquetes SET expirada = ? WHERE id = 1');
  updatePool.run(1)
  res.json({ updatePool });
})

app.listen(3000, () => console.log('Server running on 3000'));