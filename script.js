// Fonction pour récupérer les données JSON depuis l'URL
async function fetchData() {
  try {
    const response = await fetch('https://drive.google.com/uc?id=1vKcItKq-uTLgoVDrL_gZzruzuSL0e_mF');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données JSON:', error);
  }
}

// Fonction pour mettre à jour les données JSON avec un nouveau mot et sa note
async function updateData(word, score) {
  try {
    const data = await fetchData();
    data[word] = score;
    const response = await fetch('https://drive.google.com/uc?id=1vKcItKq-uTLgoVDrL_gZzruzuSL0e_mF', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (response.ok) {
      console.log('Données mises à jour avec succès.');
    } else {
      console.error('Erreur lors de la mise à jour des données.');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour des données JSON:', error);
  }
}

// Fonction pour calculer la note totale
function calculateTotalScore(words, data) {
  let totalScore = 0;
  words.forEach(word => {
    totalScore += data[word] || 0;
  });
  return totalScore;
}

// Fonction pour afficher le résultat
function displayResult(totalScore) {
  let backgroundImage;
  let text;
  if (totalScore < 0) {
    backgroundImage = 'https://st3.depositphotos.com/13194276/35739/i/450/depositphotos_357397270-stock-photo-moon-deep-space.jpg';
    text = 'Lunaire';
  } else if (totalScore > 0) {
    backgroundImage = 'https://st3.depositphotos.com/13194276/35739/i/450/depositphotos_357397270-stock-photo-moon-deep-space.jpg';
    text = 'Solaire';
  } else {
    backgroundImage = 'https://st3.depositphotos.com/9091648/17303/i/450/depositphotos_173032238-stock-illustration-nebula-the-site-of-star.jpg';
    text = 'Cosmique';
  }

  // Appliquer les changements d'image avec fondu
  document.body.style.transition = 'background-image 1s ease-in-out';
  document.body.style.backgroundImage = `url(${backgroundImage})`;

  // Afficher le texte avec fondu
  setTimeout(() => {
    document.getElementById('resultText').innerText = text;
    document.getElementById('resultText').style.transition = 'opacity 1s ease-in-out';
    document.getElementById('resultText').style.opacity = 1;
  }, 1000);

  // Disparition progressive après 10 secondes
  setTimeout(() => {
    document.body.style.transition = 'background-image 1s ease-in-out';
    document.body.style.backgroundImage = 'none';
    document.getElementById('resultText').style.transition = 'opacity 1s ease-in-out';
    document.getElementById('resultText').style.opacity = 0;
  }, 10000);
}

// Événement lors du clic sur le bouton "Go"
document.getElementById("submitButton").addEventListener("click", async function() {
  const inputText = document.getElementById("inputText").value;
  const words = inputText.split(' ');

  const data = await fetchData();

  words.forEach(word => {
    if (!data.hasOwnProperty(word)) {
      data[word] = Math.floor(Math.random() * 3) - 1;
      updateData(word, data[word]);
    }
  });

  const totalScore = calculateTotalScore(words, data);
  displayResult(totalScore);
});
