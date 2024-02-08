const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname)));

let livres = require('./livres.json');

app.get('/livres', (req, res) => {
  res.json(livres);
});

app.post('/emprunter', (req, res) => {
  const { titre } = req.body;

  const livreIndex = livres.findIndex(livre => livre.titre === titre);

  if (livreIndex !== -1 && livres[livreIndex].disponible) {
    livres[livreIndex].disponible = false;

    fs.writeFileSync('./livres.json', JSON.stringify(livres, null, 2));

    res.json({ success: true, message: 'Livre emprunté avec succès.' });
  } else {
    res.status(400).json({ success: false, message: 'Livre non disponible.' });
  }
});

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});