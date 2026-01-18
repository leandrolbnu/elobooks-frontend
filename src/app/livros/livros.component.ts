import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Livro } from './livros.model';
import { LivroService } from './livros.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './livros.component.html',
  styleUrls: ['../app.component.scss'],
})
export class LivrosComponent implements OnInit {
  livros: Livro[] = [];
  msgModal: string = '';
  modal = {
    alerta: false,
    cadastrar: false,
    alterar: false,
    deletar: false,
  };
  livroCadastro: Livro = new Livro();
  livroSelecionado: Livro = new Livro();
  categorias: string[] = [  'FICCAOCIENTIFICA',
                            'ROMANCE',
                            'FANTASIA',
                            'TERROR',
                            'SUSPENSE',
                            'AVENTURA',
                            'DRAMA',
                            'POESIA',
                            'CONTOS',
                            'INFANTIL',
                            'HISTORIA',
                            'GEOGRAFIA',
                            'AUTOAJUDA',
                            'CULINARIA'];

  constructor(private livroService: LivroService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.buscarLivros();
  }

  buscarLivros() {
    this.livroService.findAll().subscribe({
      next: (livros: Livro[]) => {
        this.livros = livros;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.livros = [];
      },
    });
  }

  selecionarLivro(livro: Livro) {
    this.livroSelecionado = livro;
  }

  cadastrar() {
    this.abrirModal('cadastrar');
  }

  cadastrarLivro() {
    this.fecharModal('cadastrar');

    this.livroService.create(this.livroCadastro).subscribe({
      next: () => {
        this.msgModal = 'Livro cadastrado com sucesso.';
        this.abrirModal('alerta');
        this.cdr.detectChanges();
        this.buscarLivros();
      },
      error: (error) => {
        this.msgModal = error?.error?.message || error?.message || 'Erro ao cadastrar livro.';
        this.abrirModal('alerta');
        this.cdr.detectChanges();
      },
    });
  }

  alterar() {
    let radio = <HTMLInputElement>document.querySelector('input[name="nmRadio"]:checked');
    if (!radio || !this.livroSelecionado) {
      this.msgModal = 'Selecione um livro para alterar.';
      this.abrirModal('alerta');
    } else {
      this.abrirModal('alterar');
    }
  }

  alterarLivro() {
    this.fecharModal('alterar');

    let livroAlterado = new Livro();
    livroAlterado.titulo = this.livroSelecionado.titulo;
    livroAlterado.autor = this.livroSelecionado.autor;
    livroAlterado.isbn = this.livroSelecionado.isbn;
    livroAlterado.dataPublicacao = this.livroSelecionado.dataPublicacao;
    livroAlterado.categoria = this.livroSelecionado.categoria;

    this.livroService.update(this.livroSelecionado.id, livroAlterado).subscribe({
      next: () => {
        this.msgModal = 'Livro alterado com sucesso';
        this.abrirModal('alerta');
        this.cdr.detectChanges();
        this.buscarLivros();
      },
      error: (error) => {
        this.msgModal = error?.error?.message || error?.message || 'Erro ao alterar livro.';
        this.abrirModal('alerta');
        this.cdr.detectChanges();
      },
    });
  }

  deletar() {
    let radio = <HTMLInputElement>document.querySelector('input[name="nmRadio"]:checked');
    if (!radio || !this.livroSelecionado) {
      this.msgModal = 'Selecione um livro para remover.';
      this.abrirModal('alerta');
    } else {
      this.abrirModal('deletar');
    }
  }

  deletarLivro() {
    this.fecharModal('deletar');

    this.livroService.delete(this.livroSelecionado.id).subscribe({
      next: () => {
        this.msgModal = 'Livro removido com sucesso';
        this.abrirModal('alerta');
        this.cdr.detectChanges();
        this.buscarLivros();
      },
      error: (error) => {
        this.msgModal = error?.error?.message || error?.message || 'Erro ao remover livro.';
        this.abrirModal('alerta');
        this.cdr.detectChanges();
      },
    });
  }

  abrirModal(tipo: keyof typeof this.modal) {
    this.modal[tipo] = true;
  }

  fecharModal(tipo: keyof typeof this.modal) {
    this.modal[tipo] = false;
  }
}
