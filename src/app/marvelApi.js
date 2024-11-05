// src/marvelApi.js

import axios from 'axios';
import md5 from 'md5';


const PUBLIC_KEY = process.env.NEXT_PUBLIC_MARVEL_API_KEY;
const PRIVATE_KEY = process.env.NEXT_PUBLIC_MARVEL_PRIVATE_KEY;
const BASE_URL = process.env.NEXT_PUBLIC_MARVEL_API_URL;


const getAuthParams = () => {
  const ts = new Date().getTime();
  const hash = md5(ts + PRIVATE_KEY + PUBLIC_KEY);
  return { ts, apikey: PUBLIC_KEY, hash };
};


export const fetchCharacters = async (params = {}) => {
  try {
    const authParams = getAuthParams();
    const response = await axios.get(`${BASE_URL}/characters`, {
      params: { ...params, ...authParams },
    });
    return response.data.data.results;
  } catch (error) {
    console.error("Erro ao buscar personagens:", error);
    throw error;
  }
};


export const fetchCharacterById = async (id) => {
  try {
    const authParams = getAuthParams();
    const response = await axios.get(`${BASE_URL}/characters/${id}`, {
      params: authParams,
    });
    return response.data.data.results[0];
  } catch (error) {
    console.error(`Erro ao buscar personagem com ID ${id}:`, error);
    throw error;
  }
};


export const fetchComicsByCharacterId = async (characterId) => {
  try {
    const authParams = getAuthParams();
    const response = await axios.get(`${BASE_URL}/characters/${characterId}/comics`, {
      params: authParams,
    });
    return response.data.data.results;
  } catch (error) {
    console.error(`Erro ao buscar quadrinhos para o personagem com ID ${characterId}:`, error);
    throw error;
  }
};
