import { Component } from '@angular/core';
import { LivroService } from 'src/app/service/livro.service';

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
})
export class ListaLivrosComponent {
  listaLivros: [];
  campoBusca = '';

  constructor(private service: LivroService) {}

  buscarLivros() {
    this.service.buscar(this.campoBusca).subscribe({
      next: (retornoApi) => console.log(retornoApi),
      error: (error) => console.log(error),
      complete: () => console.log('Observable completado'),
    });
  }
}
