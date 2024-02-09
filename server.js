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
  const { titre, emprunteur, duree } = req.body;
  const livreIndex = livres.findIndex(livre => livre.titre === titre);

  if (livreIndex !== -1 && livres[livreIndex].disponible) {
      const dureeEnSecondes = parseInt(duree);

      const dateRetour = new Date();
      dateRetour.setSeconds(dateRetour.getSeconds() + dureeEnSecondes);

      livres[livreIndex].disponible = false;
      livres[livreIndex].emprunteur = emprunteur;
      livres[livreIndex].dateRetour = dateRetour;

      fs.writeFileSync('./livres.json', JSON.stringify(livres, null, 2));

      res.json({ success: true, message: 'Livre emprunté avec succès.' });
  } else {
      res.json({ success: false, message: 'Le livre n\'est pas disponible.' });
  }
});

app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur le port ${port}`);
});