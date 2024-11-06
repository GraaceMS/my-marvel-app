"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchCharacterById, fetchComicsByCharacterId } from "../../../app/marvelApi";
import { Character, Comic } from "../../../app/types";

export default function HeroProfile() {
  const { id } = useParams();
  const [character, setCharacter] = useState<Character | null>(null);
  const [comics, setComics] = useState<Comic[]>([]);

  useEffect(() => {
    const loadCharacterData = async () => {
      try {
        const characterData = await fetchCharacterById(id);
        const comicsData = await fetchComicsByCharacterId(id);
        setCharacter(characterData);
        setComics(comicsData.slice(0, 5));
      } catch (error) {
        console.error("Erro ao carregar dados do personagem:", error);
      }
    };

    loadCharacterData();
  }, [id]);

  if (!character) return <div>Carregando...</div>;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col items-center p-8 flex-grow">
        <h1 className="text-4xl font-bold mb-4">Descubra os quadrinhos deste personagem</h1>
        <div className="w-full max-w-4xl flex flex-col items-center bg-white p-8 rounded-3xl shadow-lg mb-10">
          <img
            src={`${character.thumbnail.path}.${character.thumbnail.extension}`}
            alt={character.name}
            className="w-40 h-40 rounded-full mb-4"
          />
          <h1 className="text-3xl font-bold mb-2">{character.name}</h1>
          <p className="text-gray-600 text-center text-lg">
            {character.description || "Descrição indisponível."}
          </p>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Quadrinhos</h2>
        <div className="flex flex-col gap-6 w-full max-w-3xl">
          {comics.map((comic) => (
            <div key={comic.id} className="flex items-center p-4 border rounded-lg shadow-sm bg-white">
              <img
                src={`${comic.thumbnail.path}.${comic.thumbnail.extension}`}
                alt={comic.title}
                className="w-24 h-24 rounded-lg mr-4"
              />
              <div>
                <h3 className="font-semibold">{comic.title}</h3>
                <p className="text-sm text-gray-600">
                  {comic.description ? comic.description.slice(0, 200) + "..." : "Descrição indisponível."}
                </p>
                <p className="text-sm text-gray-500">
                  Lançamento:{" "}
                  {new Date(comic.dates.find((d) => d.type === "onsaleDate")?.date || "").toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">Páginas: {comic.pageCount || "N/A"}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="bg-black text-white text-center py-4 w-full">
        <p>Data provided by Marvel. © 2024 MARVEL | Desenvolvido por Grace Martins</p>
      </footer>
    </div>
  );
}
