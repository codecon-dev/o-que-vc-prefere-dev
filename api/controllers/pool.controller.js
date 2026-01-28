import {
  createPool,
  getPool,
  expirePool
} from '../repositories/pool.repository.js';
import { listOptionsByPool } from '../repositories/option.repository.js';
import { listVotesByPool } from '../repositories/vote.repository.js';

export function create(req, res) {
  let amanha = new Date();
  amanha.setDate(amanha.getDate() + 1);

  const nome_enquete = 'TESTE 1';
  const data_fim = String(amanha);
  const expirada = 0;

  const resultado = createPool(nome_enquete, data_fim, expirada);

  res.json({ 
    id: resultado.lastInsertRowid, 
    name: nome_enquete, 
    expired_date: data_fim, 
    expired: expirada
  });
}

export function update(req, res) {
  const updatedPool = expirePool(1);
  res.json({ updatedPool });
}

export function list(req, res) {
  const currentPool = getPool(1);

  let options = listOptionsByPool(currentPool.id);
  let votes = listVotesByPool(currentPool.id);

  options = options.map((o) => {
    return {
      id: o.id,
      name: o.nome,
      votes: votes.reduce((acc, voto) => {
      acc[voto.id_opcao] = (acc[voto.id_opcao] || 0) + 1;
      return acc;
    }, {})
    };
  });

  const computedEnquete = {
    id: currentPool.id,
    name: currentPool.nome_enquete,
    expired_date: currentPool.data_fim,
    options,
    countVotes: votes.length
  };

  res.json(computedEnquete);
}