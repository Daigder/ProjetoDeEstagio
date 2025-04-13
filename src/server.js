const express = require('express');
const routes = require('./routes'); 
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

app.get('/', (req, res) => {
  res.send('Servidor funcionando com sucesso!');
});

app.listen(3033, () => {
  console.log('✅ Servidor rodando na porta 3033');
});
