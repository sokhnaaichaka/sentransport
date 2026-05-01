import './StatReseau.css';

function StatReseau({ lignes }) {
  // Calcul 1 : nombre total de lignes
  const totalLignes = lignes.length;

  // Calcul 2 : somme de tous les arrêts
  const totalArrets = lignes.reduce((somme, ligne) => somme + ligne.arrets, 0);

  // Calcul 3 : ligne avec le plus d'arrêts
  const maxArrets = Math.max(...lignes.map(ligne => ligne.arrets));
  const ligneMax = lignes.find(ligne => ligne.arrets === maxArrets);

  return (
    <div className="stat-reseau">
      <h3 className="stat-titre">Statistiques du réseau</h3>
      <div className="stat-grille">
        <div className="stat-carte">
          <div className="stat-valeur">{totalLignes}</div>
          <div className="stat-label">Lignes</div>
        </div>
        <div className="stat-carte">
          <div className="stat-valeur">{totalArrets}</div>
          <div className="stat-label">Arrêts au total</div>
        </div>
        <div className="stat-carte">
          <div className="stat-valeur">N°{ligneMax.numero}</div>
          <div className="stat-label">Plus longue ({maxArrets} arrêts)</div>
        </div>
      </div>
    </div>
  );
}

export default StatReseau;