import './Recherche.css';

function Recherche({ valeur, onChange, onEffacer }) {
  return (
    <div className="recherche">
      <input
        type="text"
        className="recherche-input"
        placeholder="Rechercher une ligne (depart, arrivee)..."
        value={valeur}
        onChange={e => onChange(e.target.value)}
      />
      {valeur && (
        <button
          type="button"
          className="recherche-effacer"
          onClick={onEffacer}
        >
          Effacer
        </button>
      )}
    </div>
  );
}

export default Recherche;