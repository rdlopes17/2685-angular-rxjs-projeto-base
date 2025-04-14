import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs';
import { Item } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

const PAUSA = 300;
@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
})
export class ListaLivrosComponent {
  // modelo com o uso do  pipe |async efetua as acoes de subcription e unsubscription e
  // guarda o conteudo na variavel listaLivros, simplificando as variaveis declaradas e
  // efetuando a atribuicao direta  no map()
  campoBusca = new FormControl();

  constructor(private service: LivroService) {}

  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    // agrupador de operadores
    debounceTime(PAUSA), // controle de tempo para pesquisa
    filter((valorDigitado) => valorDigitado.length >= 3), // uso do filter para controle do campo de busca
    tap(() => console.log('Fluxo inicial')), // espiao para controle de fluxo, debug
    distinctUntilChanged(), //compara os valores recebidos, caso sejam diferentes libera uma nova requisicao
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)), // transforma a entrada passando o ultimo valor
    tap(() => console.log('Requisicao ao servidor')), // espiao para controle de fluxo, debug
    map((items) => this.livrosResultadoParaLivros(items)) // transforma os dados para o formato da pesquisa, para apresentacao
  );

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map((item) => {
      return new LivroVolumeInfo(item);
    });
  }

  //modelo antes do uso do  pipe |async efetua as acoes de subcription e unsubscription e
  // guarda o conteudo na variavel listaLivros, simplificando as variaveis declaradas e
  // efetuando a atribuicao direta  no map()
  // listaLivros: Livro[];
  // campoBusca = new FormControl();
  // subscription: Subscription;
  // livro: Livro;

  // constructor(private service: LivroService) {}

  // livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
  //   switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
  //   map((items) => (this.listaLivros = this.livrosResultadoParaLivros(items)))
  //);
}
