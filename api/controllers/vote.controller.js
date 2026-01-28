import { getPool } from '../repositories/pool.repository.js';
import { createVote, listVotesByPool } from '../repositories/vote.repository.js';
import { listOptionsByPool } from '../repositories/option.repository.js';

export function create(req, res) {
  const { id_option } = req.body

  const pool = getPool(1);
  const id_pool = pool.id;

  createVote(pool.id, id_option);

  let options = listOptionsByPool(pool.id);
  let votes = listVotesByPool(pool.id);

  options = options.map((o) => {
    return votes.reduce((acc, voto) => {
      acc[voto.id_opcao] = ((acc[voto.id_opcao] || 0) + 1);
      return acc;
    }, {})
  });

  res.json({ id_pool, id_option, options, countVotes : votes.length});
}