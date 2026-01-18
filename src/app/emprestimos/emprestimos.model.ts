import { Livro } from "../livros/livros.model";
import { Usuario } from "../usuarios/usuarios.model";

export class Emprestimo {
  id!: number;
  usuario!: Usuario;
  livro!: Livro;
  dataEmprestimo!: string;
  dataDevolucao?: string;
  status!: string;
}
