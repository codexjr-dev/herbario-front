import Header from "./components/Header";
import Footer from "./components/Footer";
import Busca from "./components/Busca";


export default function Home() {
  return (
    <>
      <Header/ >
      
        <img 
        src="/images/fundoMato.png"
        height={500}
        />

      <main className="main-home">
        <h2>Herbário Virtual</h2>
        <Busca/ >
      </main>
      <Footer/ >
    </>
  );
}