import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  EMPTY,
  filter,
  map,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Item, LivrosResultado } from 'src/app/models/interfaces';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';
import {
  trigger,
  transition,
  query,
  style,
  stagger,
  animate,
  keyframes,
} from '@angular/animations';

const PAUSA = 300;
@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(
          ':enter',
          [
            style({ opacity: 0, transform: 'translateY(-50px)' }),
            stagger('100ms', [
              animate(
                '500ms ease-out',
                keyframes([
                  style({
                    opacity: 0,
                    transform: 'translateY(-50px)',
                    offset: 0,
                  }),
                  style({
                    opacity: 0.5,
                    transform: 'translateY(-25px)',
                    offset: 0.3,
                  }),
                  style({ opacity: 1, transform: 'none', offset: 1 }),
                ])
              ),
            ]),
          ],
          { optional: true }
        ),
        query(
          ':leave',
          [
            stagger('200ms', [
              animate(
                '500ms ease-out',
                keyframes([
                  style({ opacity: 1, transform: 'none', offset: 0 }),
                  style({
                    opacity: 0.5,
                    transform: 'translateY(-25px)',
                    offset: 0.3,
                  }),
                  style({
                    opacity: 0,
                    transform: 'translateY(-50px)',
                    offset: 1,
                  }),
                ])
              ),
            ]),
          ],
          { optional: true }
        ),
      ]),
    ]),
  ],
})
export class ListaLivrosComponent {
  // modelo com o uso do  pipe |async efetua as acoes de subcription e unsubscription e
  // guarda o conteudo na variavel listaLivros, simplificando as variaveis declaradas e
  // efetuando a atribuicao direta  no map()
  campoBusca = new FormControl();
  mensagemErro = '';
  livrosResultado: LivrosResultado;
  listaLivros: LivroVolumeInfo[];

  constructor(private service: LivroService) {}

  // Ex: Obsevervable com os operadores para buscar resultados e convertendos os para o tipo LivrosResultado  para apresentacao em tela
  totalDelivros$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    filter((valorDigitado) => valorDigitado.length >= 3),
    tap(() => console.log('Fluxo inicial')),
    distinctUntilChanged(),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map((resultado) => (this.livrosResultado = resultado)),
    catchError((erro) => {
      console.log(erro);
      return of(); //pode receber ou não um valor, completa o Observable
    })
  );

  // Ex: Obsevervable com os operadores para buscar resultados e convertendos os para o tipo ITENS para apresentacao em tela
  livrosEncontradosAntigo$ = this.campoBusca.valueChanges.pipe(
    // agrupador de operadores
    debounceTime(PAUSA), // controle de tempo para pesquisa
    filter((valorDigitado) => valorDigitado.length >= 3), // uso do filter para controle do campo de busca
    tap(() => console.log('Fluxo inicial')), // espiao para controle de fluxo, debug
    distinctUntilChanged(), //compara os valores recebidos, caso sejam diferentes libera uma nova requisicao
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)), // transforma a entrada passando o ultimo valor
    tap(() => console.log('Requisicao ao servidor')), // espiao para controle de fluxo, debug
    map((resultado) => resultado.items ?? []), // uso do operador ?? para coalascencia nula, aceitar valores vazios ou nulos no campo de busca.
    map((items) => this.livrosResultadoParaLivros(items)), // transforma os dados para o formato da pesquisa, para apresentacao
    catchError((erro) => {
      //captura o erro, mais não emite valores
      //this.mensagemErro = 'Ops, ocorreu um erro. Recarrege a aplicação!'
      // return EMPTY//Ele cria um Observable simples que não emite nenhum item para o Observer e que emite imediatamente uma notificação de "Complete" para encerrar o seu ciclo de vida
      console.log(erro);
      return throwError(
        () =>
          new Error(
            (this.mensagemErro = 'Ops, ocorreu um erro. Recarrege a aplicação!')
          )
      ); //cria um observeble com a instancia de erro
    })
  );

  //modelo que une os dois observables criados
  livrosEncontrados$ = this.campoBusca.valueChanges.pipe(
    debounceTime(PAUSA),
    tap(() => {
      console.log('Fluxo inicial de dados');
    }),
    filter((valorDigitado) => valorDigitado.length >= 3),
    switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
    map((resultado) => (this.livrosResultado = resultado)),
    map((resultado) => resultado.items ?? []),
    tap(console.log),
    map((items) => (this.listaLivros = this.livrosResultadoParaLivros(items))),
    catchError((erro) => {
      console.log(erro);
      return throwError(
        () =>
          new Error(
            (this.mensagemErro = `Ops, ocorreu um erro! Recarregue a aplicação!`)
          )
      );
    })
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
