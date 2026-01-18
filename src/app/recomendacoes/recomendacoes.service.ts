import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Livro } from '../livros/livros.model';

@Injectable({ providedIn: 'root' })
export class RecomendacaoService {
  private readonly baseUrl = 'http://localhost:8080/api/recomendacoes';

  constructor(private http: HttpClient) {}

  findAllByUserId(id: number): Observable<Livro[]> {
    return this.http.get<Livro[]>(`${this.baseUrl}/${id}`);
  }
}
