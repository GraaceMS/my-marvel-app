// src/app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState, useAppDispatch } from "../app/store/store";
import { fetchCharacters } from "../app/marvelApi";
import { Character } from "../app/types";
import { FaSearch, FaHeart } from "react-icons/fa";
import { toggleFavorite } from "../app/store/slices/favoritesSlice"; 
import Link from "next/link";

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const favorites = useSelector((state: RootState) => state.favorites.items);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const data = await fetchCharacters();
        setCharacters(data);
      } catch (error) {
        console.error("Erro ao carregar personagens:", error);
      }
    };
    loadCharacters();
  }, []);

  const filteredCharacters = characters.filter((character) => {
    const matchesSearch = character.name.toLowerCase().includes(searchQuery.toLowerCase());
    const isFavorite = favorites.includes(character.id);
    return matchesSearch && (!showFavorites || isFavorite);
  });

  const totalPages = Math.ceil(filteredCharacters.length / itemsPerPage);
  const currentCharacters = filteredCharacters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="text-center py-5">
        <h1 className="text-4xl font-bold mb-2">EXPLORE O UNIVERSO E CRIE SUA EQUIPE</h1>
        <p className="text-lg text-gray-600 mb-4">
          Os melhores personagens já feitos em quadrinhos. Fique viciado em uma generosa porção de heróis e vilões!
        </p>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center mb-7">
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 w-full max-w-4xl mb-6">
          <div className="relative w-full max-w-xl">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-500" />
            <input
              type="text"
              placeholder="Procure por heróis"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-300 shadow-sm bg-pink-100 placeholder-pink-500 focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-700"
            />
          </div>
          <button
            onClick={() => setShowFavorites(!showFavorites)}
            className={`flex items-center gap-2 text-lg ${
              showFavorites ? "text-red-500" : "text-gray-500"
            }`}
          >
            <FaHeart className="text-2xl" />
            Somente favoritos
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {currentCharacters.map((character) => (
            <div key={character.id} className="relative">
              <Link href={`/heroes/${character.id}`}>
                <div className="flex flex-col items-center text-center p-4 border rounded-lg shadow-md bg-white w-60 h-72 max-w-sm cursor-pointer">
                  <img
                    src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
                    alt={character.name}
                    width={100}
                    height={100}
                    className="rounded-full mb-4"
                  />
                  <h2 className="font-bold text-lg mb-2">{character.name}</h2>
                  <p className="text-sm text-gray-600 h-16 overflow-hidden">
                    {character.description || "Descrição indisponível."}
                  </p>
                </div>
              </Link>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(toggleFavorite(character.id));
                }}
                className={`absolute top-2 right-2 text-2xl transition-transform duration-200 ${
                  favorites.includes(character.id) ? "text-red-500" : "text-gray-400"
                }`}
                aria-label={favorites.includes(character.id) ? "Remover dos favoritos" : "Adicionar aos favoritos"}
              >
                {favorites.includes(character.id) ? "❤️" : "🤍"}
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${currentPage === 1 ? "bg-gray-300" : "bg-red-500 text-white"}`}
          >
            Anterior
          </button>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`px-3 py-2 rounded ${currentPage === index + 1 ? "bg-red-500 text-white" : "bg-gray-200"}`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${currentPage === totalPages ? "bg-gray-300" : "bg-red-500 text-white"}`}
          >
            Próximo
          </button>
        </div>
      </main>

      <footer className="w-full text-center py-4 bg-black text-white">
        <p>Data provided by Marvel. © 2024 MARVEL | Desenvolvido por Grace Martins</p>
      </footer>
    </div>
  );
}
