import { Hero } from "./hero.model";

export interface GetHeroesResponse {
  heroes: Hero[];
  totalHeroes: number;
}