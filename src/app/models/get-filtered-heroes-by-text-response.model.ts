import { Hero } from "./hero.model";

export interface GetFilteredHeroesByTextResponse {
  heroes: Hero[];
  totalHeroes: number;
  pageSize: number;
  currentPage: number;
}