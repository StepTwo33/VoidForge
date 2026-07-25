// Archwing frames and Necramech data
// Converted from lib/data/archwing_data.dart

export interface Archwing {
  id: string;
  name: string;
  health: number;
  shield: number;
  armor: number;
  energy: number;
  speed: number;
  description: string;
}

export interface Necramech {
  id: string;
  name: string;
  health: number;
  shield: number;
  armor: number;
  energy: number;
  description: string;
}

export const archwings: Archwing[] = [
  { id: "odonata", name: "Odonata", health: 300, shield: 300, armor: 100, energy: 150, speed: 1.0, description: "Balanced starter Archwing" },
  { id: "odonata_prime", name: "Odonata Prime", health: 400, shield: 400, armor: 150, energy: 200, speed: 1.1, description: "Prime balanced Archwing" },
  { id: "elytron", name: "Elytron", health: 765, shield: 745, armor: 145, energy: 125, speed: 0.9, description: "Heavy bomber Archwing" },
  { id: "itzal", name: "Itzal", health: 200, shield: 220, armor: 50, energy: 200, speed: 1.2, description: "Stealth and support Archwing" },
  { id: "amesha", name: "Amesha", health: 650, shield: 220, armor: 195, energy: 200, speed: 1.1, description: "Support Archwing with healing and buffs" },
];

export const necramechs: Necramech[] = [
  { id: "voidrig", name: "Voidrig", health: 3000, shield: 0, armor: 350, energy: 150, description: "Heavy artillery Necramech. Exalted weapon: Arquebex." },
  { id: "bonewidow", name: "Bonewidow", health: 3500, shield: 0, armor: 450, energy: 100, description: "Melee-focused Necramech with shield and sword." },
];
