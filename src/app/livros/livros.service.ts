import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Livro } from './livros.model';

@Injectable({ providedIn: 'root' })
export class LivroService {
  private readonly baseUrl = 'http://localhost:8080/api/livros';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Livro[]> {
    return this.http.get<Livro[]>(this.baseUrl);
  }

  findById(id: number): Observable<Livro> {
    return this.http.get<Livro>(`${this.baseUrl}/${id}`);
  }

  create(livro: {
    titulo: string;
    autor: string;
    isbn: string;
    dataPublicacao: string;
    categoria: string;
  }): Observable<Livro> {
    return this.http.post<Livro>(this.baseUrl, livro);
  }

  update(
    id: number,
    livro: {
      titulo: string;
      autor: string;
      isbn: string;
      dataPublicacao: string;
      categoria: string;
    },
  ): Observable<Livro> {
    return this.http.put<Livro>(`${this.baseUrl}/${id}`, livro);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
