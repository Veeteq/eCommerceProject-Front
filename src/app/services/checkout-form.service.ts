import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'
import { environment } from 'src/environments/environment';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class CheckoutFormService {
  private endpoint = environment.backendUrl;
  private countryiesUrl = `${this.endpoint}/countries`;
  private statesUrl = `${this.endpoint}/states`;

  constructor(private httpClient: HttpClient) { }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let data: number[] = [];
    for (let month = startMonth; month <= 12; month++) {
      data.push(month);
    }
    return of(data);
  }

  getCreditCardYears(): Observable<number[]> {
    let data: number[] = [];
    let startYear: number = new Date().getFullYear();
    let endYear: number = startYear + 10;
    for (let year = startYear; year <= endYear; year++) {
      data.push(year);
    }
    return of(data);
  }

  getCountryList(): Observable<Country[]> {
    console.log('getCategoryList');
    return this.httpClient.get<CountryResponse>(this.countryiesUrl)
    .pipe(map(response => response._embedded.country));
  }  

  getStateList(countryCode: string): Observable<State[]> {
    const searchUrl = `${this.statesUrl}/search/findByCountryCode?code=${countryCode}`;
    console.log(searchUrl);

    return this.httpClient.get<StateResponse>(searchUrl)
    .pipe(map(response => response._embedded.state));
  }  

}

interface CountryResponse {
  _embedded: {
    country: Country[];
  }
}

interface StateResponse {
  _embedded: {
    state: State[];
  }
}