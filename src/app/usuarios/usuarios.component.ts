import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TelefonePipe } from '../utils/telefone.pipe';
import { Usuario } from './usuarios.model';
import { UsuarioService } from './usuarios.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TelefonePipe],
  templateUrl: './usuarios.component.html',
  styleUrls: ['../app.component.scss'],
})
export class UsuarioComponent implements OnInit {
  usuarios: Usuario[] = [];
  msgModal: string = '';
  modal = {
    alerta: false,
    cadastrar: false,
    alterar: false,
    deletar: false,
  };
  usuarioCadastro: Usuario = new Usuario();
  usuarioSelecionado: Usuario = new Usuario();
  telefoneRegex =
    '/^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/';

  constructor(
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.usuarioService.findAll().subscribe({
      next: (usuarios: Usuario[]) => {
        this.usuarios = usuarios;
        this.cdr.detectChanges();
      },
      error: (error) => {
        this.usuarios = [];
      },
    });
  }

  selecionarUsuario(usuario: Usuario) {
    this.usuarioSelecionado = usuario;
  }

  cadastrar() {
    this.abrirModal('cadastrar');
  }

  cadastrarUsuario() {
    this.fecharModal('cadastrar');

    this.usuarioService.create(this.usuarioCadastro).subscribe({
      next: () => {
        this.msgModal = 'Usuário cadastrado com sucesso.';
        this.abrirModal('alerta');
        this.cdr.detectChanges();
        this.carregarUsuarios();
      },
      error: (error) => {
        this.msgModal = error?.error?.message || error?.message || 'Erro ao cadastrar usuário.';
        this.abrirModal('alerta');
        this.cdr.detectChanges();
      },
    });
  }

  alterar() {
    let radio = <HTMLInputElement>document.querySelector('input[name="nmRadio"]:checked');
    if (!radio || !this.usuarioSelecionado) {
      this.msgModal = 'Selecione um usuário para alterar.';
      this.abrirModal('alerta');
    } else {
      this.abrirModal('alterar');
    }
  }

  alterarUsuario() {
    this.fecharModal('alterar');

    const usuarioAlterado = new Usuario();
    usuarioAlterado.nome = this.usuarioSelecionado.nome;
    usuarioAlterado.email = this.usuarioSelecionado.email;
    usuarioAlterado.telefone = this.usuarioSelecionado.telefone;

    this.usuarioService.update(this.usuarioSelecionado.id, usuarioAlterado).subscribe({
      next: () => {
        this.msgModal = 'Usuário alterado com sucesso';
        this.abrirModal('alerta');
        this.cdr.detectChanges();
        this.carregarUsuarios();
      },
      error: (error) => {
        this.msgModal = error?.error?.message || error?.message || 'Erro ao alterar usuário.';
        this.abrirModal('alerta');
        this.cdr.detectChanges();
      },
    });
  }

  deletar() {
    let radio = <HTMLInputElement>document.querySelector('input[name="nmRadio"]:checked');
    if (!radio || !this.usuarioSelecionado) {
      this.msgModal = 'Selecione um usuário para remover.';
      this.abrirModal('alerta');
    } else {
      this.abrirModal('deletar');
    }
  }

  deletarUsuario() {
    this.fecharModal('deletar');

    this.usuarioService.delete(this.usuarioSelecionado.id).subscribe({
      next: () => {
        this.msgModal = 'Usuário removido com sucesso';
        this.abrirModal('alerta');
        this.cdr.detectChanges();
        this.carregarUsuarios();
      },
      error: (error) => {
        this.msgModal = error?.error?.message || error?.message || 'Erro ao remover usuário.';
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
