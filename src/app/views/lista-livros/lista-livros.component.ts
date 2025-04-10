import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { map, switchMap, tap } from 'rxjs';
import { Item } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

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
    tap(() => console.log('Fluxo inicial')),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    tap(() => console.log('Requisicao ao servidor')),
    map((items) => this.livrosResultadoParaLivros(items))
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
