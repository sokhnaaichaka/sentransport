import './Statistique.css';

function Statistique({ chiffre, libelle }) {
  return (
    <div className="statistique">
      <span className="statistique-chiffre">{chiffre}</span>
      <span className="statistique-libelle">{libelle}</span>
    </div>
  );
}

export default Statistique;