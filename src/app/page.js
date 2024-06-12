'use client';

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import useStore from '../stores/store'; // Import the Zustand store

const ITEMS_PER_PAGE = 20;

const SearchAndCaughtPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pokemonData, setPokemonData] = useState([]);
  const [showSearchPage, setShowSearchPage] = useState(true);

  // Access the Zustand store for managing caught Pokemon
  const { caughtPokemon, catchPokemon } = useStore();

  const fetchPokemons = async (page) => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${ITEMS_PER_PAGE}&offset=${(page - 1) * ITEMS_PER_PAGE}`);
      const data = await response.json();
      setTotalPages(Math.ceil(data.count / ITEMS_PER_PAGE));

      const pokemonDetails = await Promise.all(
        data.results.map(async (pokemon) => {
          const pokemonResponse = await fetch(pokemon.url);
          return await pokemonResponse.json();
        })
      );
      setPokemonData(pokemonDetails);
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${searchTerm.toLowerCase()}`);
      if (!response.ok) {
        throw new Error('Pokemon not found!');
      }
      const data = await response.json();
      setPokemonData([data]);
      setTotalPages(1);
    } catch (error) {
      console.error('Error fetching Pokemon data:', error);
    }
  };

  const handleCatchPokemon = (pokemon) => {
    if (!caughtPokemon.find(p => p.id === pokemon.id)) { // Check if the Pokemon is not already caught
      catchPokemon(pokemon); // Add the caught Pokemon to the Zustand store
    }
    setPokemonData(prevPokemonData => prevPokemonData.filter(p => p.id !== pokemon.id)); // Filter out the caught Pokemon from the search results
  };

  useEffect(() => {
    fetchPokemons(page);
  }, [page]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="flex w-full max-w-md items-center space-x-2">
        <Input
          type="text"
          placeholder="Enter a Pokemon"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button type="button" onClick={handleSearch}>Search</Button>
        <Button type="button" onClick={() => setShowSearchPage(!showSearchPage)}>
          {showSearchPage ? 'View Caught Pokemon' : 'View Search Results'}
        </Button>
      </div>
      <div className="mt-4">
        <Button onClick={() => window.location.href = '/'} className="absolute top-0 right-0">Back</Button>
      </div>
      {showSearchPage ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {pokemonData.map((pokemon) => (
            <Card key={pokemon.id} className="w-full max-w-sm">
              <CardHeader>
                <img src={pokemon.sprites.front_default} alt={pokemon.name} />
              </CardHeader>
              <CardContent>
                <CardTitle>{pokemon.name}</CardTitle>
                <CardDescription>Type: {pokemon.types.map(type => type.type.name).join(', ')}</CardDescription>
                <CardDescription>Abilities: {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button onClick={() => handleCatchPokemon(pokemon)}>Catch</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {caughtPokemon.map((pokemon) => (
            <Card key={pokemon.id} className="w-full max-w-sm">
              <CardHeader>
                <img src={pokemon.sprites.front_default} alt={pokemon.name} />
              </CardHeader>
              <CardContent>
                <CardTitle>{pokemon.name}</CardTitle>
                <CardDescription>Type: {pokemon.types.map(type => type.type.name).join(', ')}</CardDescription>
                <CardDescription>Abilities: {pokemon.abilities.map(ability => ability.ability.name).join(', ')}</CardDescription>
              </CardContent>
              <CardFooter>
                <Button disabled>Caught</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <div className="flex justify-center mt-4">
        <Button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</Button>
        <Button onClick={() => setPage(page + 1)} disabled={page === totalPages}>Next</Button>
      </div>
    </div>
  );
}

export default SearchAndCaughtPage;

