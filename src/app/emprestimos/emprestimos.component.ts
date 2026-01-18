import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Usuario } from '../usuarios/usuarios.model';
import { Livro } from '../livros/livros.model';
import { Emprestimo } from './emprestimos.model';
import { EmprestimoService } from './emprestimos.service';
import { LivroService } from '../livros/livros.service';
import { UsuarioService } from '../usuarios/usuarios.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './emprestimos.component.html',
  styleUrls: ['../app.component.scss'],
})
export class EmprestimosComponent implements OnInit {
  usuarios: Usuario[] = [];
  livros: Livro[] = [];
  emprestimos: Emprestimo[] = [];
  emprestimoSelecionado?: Emprestimo;
  usuarioSelecionado!: Usuario;
  livroSelecionado!: Livro;
  msgModal: string = '';
  modal = {
    alerta: false,
    cadastrar: false,
    deletar: false,
  };

  constructor(
    private emprestimoService: EmprestimoService,
    private livroService: LivroService,
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.buscarUsuarios();
    this.buscarLivros();
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

  buscarEmprestimos() {
    if (!this.usuarioSelecionado) {
      this.msgModal = 'Selecione um usuário.';
      this.abrirModal('alerta');
    } else {
      this.emprestimoService.findAllByUserId(this.usuarioSelecionado.id).subscribe({
        next: (emprestimos: Emprestimo[]) => {
          this.emprestimos = emprestimos;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.msgModal = error?.error?.message || error?.message || 'Erro ao buscar empréstimos.';
          this.abrirModal('alerta');
          this.cdr.detectChanges();
        },
      });
    }
  }

  buscarLivros() {
    this.livroService.findAll().subscribe({
      next: (livros: Livro[]) => {
        this.livros = livros;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.msgModal = error?.error?.message || error?.message || 'Erro ao buscar livros.';
        this.abrirModal('alerta');
        this.cdr.detectChanges();
      },
    });
  }

  selecionarEmprestimo(emprestimo: Emprestimo) {
    this.emprestimoSelecionado = emprestimo;
  }

  emprestar() {
    this.abrirModal('cadastrar');
  }

  cadastrarEmprestimo() {
    this.fecharModal('cadastrar');

    if (!this.livroSelecionado) {
      this.msgModal = 'Selecione um livro.';
      this.abrirModal('alerta');
    } else {
      this.emprestimoService
        .create(this.usuarioSelecionado.id, this.livroSelecionado.id)
        .subscribe({
          next: () => {
            this.msgModal = 'Livro emprestado com sucesso';
            this.abrirModal('alerta');
            this.cdr.detectChanges();
            this.buscarEmprestimos();
          },
          error: (error) => {
            this.msgModal = error?.error?.message || error?.message || 'Erro ao emprestar livro.';
            this.abrirModal('alerta');
            this.cdr.detectChanges();
          },
        });
    }
  }

  devolver() {
    this.abrirModal('deletar');
  }

  devolverLivro() {
    this.fecharModal('deletar');

    if (!this.emprestimoSelecionado) {
      this.msgModal = 'Selecione um empréstimo.';
      this.abrirModal('alerta');
    } else {
      const emprestimoAlterado = {
        idUsuario: this.usuarioSelecionado.id,
        idLivro: this.emprestimoSelecionado?.livro.id,
      };

      this.emprestimoService.update(this.emprestimoSelecionado.id, emprestimoAlterado).subscribe({
        next: () => {
          this.msgModal = 'Livro devolvido com sucesso';
          this.abrirModal('alerta');
          this.cdr.detectChanges();
          this.buscarEmprestimos();
        },
        error: (error) => {
          this.msgModal = error?.error?.message || error?.message || 'Erro ao devolver livro.';
          this.abrirModal('alerta');
          this.cdr.detectChanges();
        },
      });
    }
  }

  abrirModal(tipo: keyof typeof this.modal) {
    this.modal[tipo] = true;
  }

  fecharModal(tipo: keyof typeof this.modal) {
    this.modal[tipo] = false;
  }
}
