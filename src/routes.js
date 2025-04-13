const express = require('express');
const routes = express.Router();
const db = require('./db');
const bcrypt = require('bcrypt');
const saltRounds = 10;

routes.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    return res.status(200).json({
      name: user.name,
      email: user.email,
    });

  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});


routes.post('/register', async (req, res) => {
  const { name, email, password, cpf, birthdate } = req.body;

  if (!name || !email || !password || !cpf || !birthdate) {
    return res.status(400).json({ message: 'Preencha todos os campos obrigatórios' });
  }

  try {
    const existing = await db.query('SELECT * FROM users WHERE email = $1', [email]);

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await db.query(
      'INSERT INTO users (name, email, password, cpf, birthdate) VALUES ($1, $2, $3, $4, $5)',
      [name, email, hashedPassword, cpf, birthdate]
    );

    return res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });

  } catch (err) {
    console.error('Erro no cadastro:', err);
    res.status(500).json({ message: 'Erro interno no servidor' });
  }
});

module.exports = routes;
