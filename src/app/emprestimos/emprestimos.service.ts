import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Emprestimo } from './emprestimos.model';

@Injectable({ providedIn: 'root' })
export class EmprestimoService {
  private readonly baseUrl = 'http://localhost:8080/api/emprestimos';

  constructor(private http: HttpClient) {}

  findAllByUserId(idUsuario: number): Observable<Emprestimo[]> {
    return this.http.get<Emprestimo[]>(`${this.baseUrl}/${idUsuario}`);
  }

  create(idUsuario: number, idLivro: number): Observable<Emprestimo> {
    return this.http.post<Emprestimo>(this.baseUrl, { idUsuario, idLivro });
  }

  update(id: number, emprestimo: { idUsuario: number; idLivro: number }): Observable<Emprestimo> {
    return this.http.put<Emprestimo>(`${this.baseUrl}/${id}`, emprestimo);
  }
}
