import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Item, LivrosResultado } from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class LivroService {
  private readonly API = 'https://www.googleapis.com/books/v1/volumes';

  constructor(private http: HttpClient) {}

  // Ex: Observable de LivrosResultado (passamos os tratamentos do obsevable para o componente)
  buscar(valorDigitado: string): Observable<LivrosResultado> {
    const params = new HttpParams().append('q', valorDigitado);
    return this.http.get<LivrosResultado>(this.API, { params });
  }

  //  Ex: Observable de Item[]
  // buscar(valorDigitado: string): Observable<Item[]> {
  //   const params = new HttpParams().append('q', valorDigitado);
  //   return this.http.get<LivrosResultado>(this.API, { params }).pipe(
  //     //tap((retornoApi) => console.log('Fluxo do tap', retornoApi)),
  //     map((resultado) => resultado.items ?? [])
  //     //tap((resultado) => console.log('Fluxo após o map', resultado))
  //   );
  // }
}
