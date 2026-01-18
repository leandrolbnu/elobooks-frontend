import { Routes } from '@angular/router';
import { UsuarioComponent } from './usuarios/usuarios.component';
import { HomeComponent } from './home/home.component';
import { LivrosComponent } from './livros/livros.component';
import { RecommendacoesComponent } from './recomendacoes/recomendacoes.component';
import { EmprestimosComponent } from './emprestimos/emprestimos.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'usuarios', component: UsuarioComponent },

  { path: 'livros', component: LivrosComponent },

  { path: 'emprestimos', component: EmprestimosComponent },

  { path: 'recomendacoes', component: RecommendacoesComponent },

  { path: '**', redirectTo: '' }
];