import { createOption } from "../repositories/option.repository.js";

export function create(req, res) {
  let id_enquete = 1
  let nome = "opcao 2"

  const info = createOption(id_enquete, nome);

  res.json({ id: info.lastInsertRowid, id_enquete, nome });
}