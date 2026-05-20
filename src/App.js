import { useState, useEffect } from 'react';
import './App.css';
import Header from './Header';
import Recherche from './Recherche';
import LigneBus from './LigneBus';
import DetailLigne from './DetailLigne';
import Footer from './Footer';

function App() {
  const [lignes, setLignes] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [recherche, setRecherche] = useState("");

  // === Exercice 3 : on sépare l'ID inspecté et les détails chargés ===
  const [idEnCours, setIdEnCours] = useState(null);
  const [ligneSelectionnee, setLigneSelectionnee] = useState(null);
  const [detailChargement, setDetailChargement] = useState(false);
  const [detailErreur, setDetailErreur] = useState(null);

  // Fonction extraite (Exercice 1) — chargement de la liste
  function chargerLignes() {
    setChargement(true);
    setErreur(null);
    fetch("http://localhost:5000/lignes")
      .then(response => {
        if (!response.ok) {
          throw new Error("Erreur serveur : " + response.status);
        }
        return response.json();
      })
      .then(data => {
        setLignes(data);
        setChargement(false);
      })
      .catch(error => {
        setErreur(error.message);
        setChargement(false);
      });
  }

  useEffect(() => {
    chargerLignes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const lignesFiltrees = lignes.filter(l =>
    l.depart.toLowerCase().includes(recherche.toLowerCase()) ||
    l.arrivee.toLowerCase().includes(recherche.toLowerCase()) ||
    l.numero.includes(recherche)
  );

  // === Exercice 3 : on charge les détails à la demande depuis Flask ===
  function handleClickLigne(ligne) {
    // Re-clic sur la ligne déjà ouverte → on referme
    if (idEnCours === ligne.id) {
      setIdEnCours(null);
      setLigneSelectionnee(null);
      setDetailErreur(null);
      return;
    }

    // Sinon, on demande les détails à Flask
    setIdEnCours(ligne.id);
    setLigneSelectionnee(null);
    setDetailChargement(true);
    setDetailErreur(null);

    fetch(`http://localhost:5000/lignes/${ligne.id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Erreur serveur : " + response.status);
        }
        return response.json();
      })
      .then(data => {
        setLigneSelectionnee(data);
        setDetailChargement(false);
      })
      .catch(error => {
        setDetailErreur(error.message);
        setDetailChargement(false);
      });
  }

  if (chargement) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <p className="message-chargement">
            Chargement des lignes...
          </p>
        </main>
      </div>
    );
  }

  if (erreur) {
    return (
      <div className="App">
        <Header />
        <main className="contenu">
          <div className="message-erreur">
            <p>Impossible de charger les lignes.</p>
            <p className="erreur-detail">{erreur}</p>
            <p>Vérifiez que le serveur Flask est lancé (python api/app.py).</p>
            <button className="btn-recharger" onClick={chargerLignes}>
               Réessayer
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <Recherche valeur={recherche} onChange={setRecherche} />
        <button className="btn-recharger" onClick={chargerLignes}>
           Recharger les lignes
        </button>
        <p className="resultat-recherche">
          {lignesFiltrees.length} ligne{lignesFiltrees.length > 1 ? 's' : ''}
          {' '}trouvée{lignesFiltrees.length > 1 ? 's' : ''}
        </p>
        {lignesFiltrees.map(ligne => (
          <LigneBus
            key={ligne.id}
            numero={ligne.numero}
            depart={ligne.depart}
            arrivee={ligne.arrivee}
            arrets={ligne.arrets}
            estSelectionnee={idEnCours === ligne.id}
            onClick={() => handleClickLigne(ligne)}
          />
        ))}

        {detailChargement && (
          <p className="message-chargement-detail">
            Chargement des détails...
          </p>
        )}

        {detailErreur && (
          <div className="message-erreur-detail">
            Impossible de charger les détails : {detailErreur}
          </div>
        )}

        {ligneSelectionnee && <DetailLigne ligne={ligneSelectionnee} />}
      </main>
      <Footer />
    </div>
  );
}

export default App;