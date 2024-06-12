import {create} from 'zustand';

const useStore = create((set) => ({
  caughtPokemon: JSON.parse(localStorage.getItem('caughtPokemon')) || [],
  catchPokemon: (pokemon) => set((state) => {
    const updatedCaughtPokemon = [...state.caughtPokemon, pokemon];
    localStorage.setItem('caughtPokemon', JSON.stringify(updatedCaughtPokemon));
    return { caughtPokemon: updatedCaughtPokemon };
  }),
}));

export default useStore;
