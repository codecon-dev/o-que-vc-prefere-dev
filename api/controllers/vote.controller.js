import { getPool } from '../repositories/pool.repository.js';
import { createVote, hasVoted, listVotesByPool } from '../repositories/vote.repository.js';
import { listOptionsByPool } from '../repositories/option.repository.js';

function getClientIp(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
         req.headers['x-real-ip'] ||
         req.socket.remoteAddress ||
         req.connection.remoteAddress;
}

function calculateVoteDistribution(options, votes) {
  return options.map((option) => {
    const votesCount = votes.filter(vote => vote.id_opcao === option.id).length;
    return {
      id: option.id,
      name: option.nome,
      votes: votesCount
    };
  });
}

export function create(req, res) {
  const { id_option } = req.body;
  
  if (!id_option) {
    return res.status(400).json({ 
      error: 'Requisição inválida',
      message: 'ID da opção é obrigatório'
    });
  }

  const pool = getPool(1);
  
  if (!pool) {
    return res.status(404).json({ 
      error: 'Não encontrado',
      message: 'Enquete não encontrada'
    });
  }

  if (pool.expirada) {
    return res.status(403).json({ 
      error: 'Proibido',
      message: 'Esta enquete já expirou'
    });
  }

  const ipAddress = getClientIp(req);
  
  if (hasVoted(pool.id, ipAddress)) {
    return res.status(409).json({ 
      error: 'Voto duplicado',
      message: 'Você já votou nesta enquete'
    });
  }

  try {
    createVote(pool.id, id_option, ipAddress);
    
    const options = listOptionsByPool(pool.id);
    const votes = listVotesByPool(pool.id);
    const distribution = calculateVoteDistribution(options, votes);

    res.status(201).json({ 
      id_pool: pool.id,
      id_option,
      options: distribution,
      countVotes: votes.length
    });
  } catch (error) {
    res.status(500).json({ 
      error: 'Erro interno',
      message: 'Não foi possível registrar seu voto'
    });
  }
}