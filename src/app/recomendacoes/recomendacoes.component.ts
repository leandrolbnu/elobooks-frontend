import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Usuario } from '../usuarios/usuarios.model';
import { Livro } from '../livros/livros.model';
import { RecomendacaoService } from './recomendacoes.service';
import { EmprestimoService } from '../emprestimos/emprestimos.service';
import { UsuarioService } from '../usuarios/usuarios.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './recomendacoes.component.html',
  styleUrls: ['../app.component.scss'],
})
export class RecommendacoesComponent implements OnInit {
  usuarios: Usuario[] = [];
  recomendacoes: Livro[] = [];
  recomendacaoSelecionada: Livro = new Livro();
  usuarioSelecionado!: Usuario;
  msgModal: string = '';
    modal = {
    alerta: false,
    cadastrar: false,
  };

  constructor(
    private recomendacaoService: RecomendacaoService,
    private emprestimoService: EmprestimoService,
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.buscarUsuarios();
  }

  buscarUsuarios() {
    this.usuarioService.findAll().subscribe({
      next: (usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.msgModal = error?.error?.message || error?.message || 'Erro ao buscar usuários.';
        this.abrirModal('alerta');
        this.cdr.detectChanges();
      },
    });
  }

  buscarRecomendacoes() {
    if (!this.usuarioSelecionado) {
      this.msgModal = 'Selecione um usuário.';
      this.abrirModal('alerta');
    } else {
      this.recomendacaoService.findAllByUserId(this.usuarioSelecionado.id).subscribe({
        next: (livros: Livro[]) => {
          this.recomendacoes = livros;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.msgModal = error?.error?.message || error?.message || 'Erro ao buscar recomendações.';
          this.abrirModal('alerta');
          this.cdr.detectChanges();
        },
      });
    }
  }

  selecionarRecomendacao(recomendacao: Livro) {
    this.recomendacaoSelecionada = recomendacao;
  }

  emprestar() {
    let radio = <HTMLInputElement>document.querySelector('input[name="nmRadio"]:checked');
    if (!radio || !this.recomendacaoSelecionada) {
      this.msgModal = 'Selecione um livro para emprestar.';
      this.abrirModal('alerta');
    } else {
      this.abrirModal('cadastrar');
    }
  }

  cadastrarEmprestimo() {
    this.fecharModal('cadastrar');

    this.emprestimoService
      .create(this.usuarioSelecionado.id, this.recomendacaoSelecionada.id)
      .subscribe({
        next: () => {
          this.msgModal = 'Livro emprestado com sucesso';
          this.abrirModal('alerta');
          this.cdr.detectChanges();
          this.buscarRecomendacoes();
        },
        error: (error) => {
          this.msgModal = error?.error?.message || error?.message || 'Erro ao emprestar livro.';
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
