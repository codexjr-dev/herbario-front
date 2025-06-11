"use client";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

export default function Busca() {
  const [busca, setBusca] = useState("");
  const [classe, setClasse] = useState("");
  const [familia, setFamilia] = useState("");

  const handleSearch = () => {
    console.log("Buscando por:", busca, classe, familia);
    //chamar uma função ou API
  };

  return (

    <div className="bg-gray-100 p-6 rounded-md max-w-xl mx-auto">
      {/* Campo de busca */}
      <div className="flex items-center space-x-2 mb-4">
        <input
          type="text"
          placeholder="Buscar por"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="flex-1 border-2 border-cyan-900 rounded-lg px-4 py-2 outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-cyan-900 hover:bg-cyan-800 text-white p-3 rounded-full"
        >
          <FaSearch/ >
        </button>
      </div>

    
      <div>
        <p className="mb-2">Selecione</p>
        <div className="flex gap-4">
          <select
            value={classe}
            onChange={(e) => setClasse(e.target.value)}
            className="flex-1 border-2 border-cyan-900 rounded-lg px-4 py-2 text-gray-700"
          >
            <option value="">Classe</option>
            <option value="Classe A">Classe A</option>
            <option value="Classe B">Classe B</option>
          </select>

          <select
            value={familia}
            onChange={(e) => setFamilia(e.target.value)}
            className="flex-1 border-2 border-cyan-900 rounded-lg px-4 py-2 text-gray-700"
          >
            <option value="">Família</option>
            <option value="Família X">Família X</option>
            <option value="Família Y">Família Y</option>
          </select>
        </div>
      </div>
    </div>
  );
}

