import { Observable, of } from "rxjs";
import { Hero } from "../../../models/hero.model";

export class HeroServiceStub {
    getHero(id: number): Observable<Hero | null> {
        return of(null);
    }
    updateHero(hero: any): Observable<Hero | null>  {
        return of(hero);
    }
    addHero(hero: any): Observable<any> {
        return of(hero);
    }
}
