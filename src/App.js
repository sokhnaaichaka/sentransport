import './App.css';
import Header from './Header';
import Footer from './Foooter';
import Statistique from './Statistique';

function App() {
  
  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <p>Bienvenue ! Cette application vous aide a trouver votre ligne de bus a Dakar.</p>
        <div>
          <Statistique chiffre="10" libelle="lignes" />
          <Statistique chiffre="150" libelle="arrêts" />
          <Statistique chiffre="45" libelle="bus" />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;