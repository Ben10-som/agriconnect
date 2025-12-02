// Les 14 régions du Sénégal
export const REGIONS_SENEGAL = [
  { id: 'dakar', nom: 'Dakar', departements: ['Dakar', 'Guédiawaye', 'Pikine', 'Rufisque'] },
  { id: 'thies', nom: 'Thiès', departements: ['Thiès', 'M\'bour', 'Tivaouane'] },
  { id: 'diourbel', nom: 'Diourbel', departements: ['Diourbel', 'Bambey', 'Mbacké'] },
  { id: 'fatick', nom: 'Fatick', departements: ['Fatick', 'Foundiougne', 'Gossas'] },
  { id: 'kaolack', nom: 'Kaolack', departements: ['Kaolack', 'Guinguinéo', 'Nioro du Rip'] },
  { id: 'kolda', nom: 'Kolda', departements: ['Kolda', 'Médina Yoro Foulah', 'Vélingara'] },
  { id: 'louga', nom: 'Louga', departements: ['Louga', 'Kébémer', 'Linguère'] },
  { id: 'matam', nom: 'Matam', departements: ['Matam', 'Kanel', 'Ranérou'] },
  { id: 'saint-louis', nom: 'Saint-Louis', departements: ['Saint-Louis', 'Dagana', 'Podor'] },
  { id: 'sedhiou', nom: 'Sédhiou', departements: ['Sédhiou', 'Bounkiling', 'Goudomp'] },
  { id: 'tambacounda', nom: 'Tambacounda', departements: ['Tambacounda', 'Bakel', 'Koumpentoum'] },
  { id: 'ziguinchor', nom: 'Ziguinchor', departements: ['Ziguinchor', 'Bignona', 'Oussouye'] },
  { id: 'kedougou', nom: 'Kédougou', departements: ['Kédougou', 'Salémata', 'Saraya'] },
  { id: 'kaffrine', nom: 'Kaffrine', departements: ['Kaffrine', 'Birkilane', 'Malem Hodar'] }
];

export const getRegionById = (id) => {
  return REGIONS_SENEGAL.find(r => r.id === id);
};

export const getRegionByName = (nom) => {
  return REGIONS_SENEGAL.find(r => r.nom.toLowerCase() === nom.toLowerCase());
};

