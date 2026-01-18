import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from './usuarios.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private readonly baseUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient) {}

  findAll(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.baseUrl);
  }

  findById(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.baseUrl}/${id}`);
  }

  create(usuario: { nome: string; email: string, telefone: string }): Observable<Usuario> {
    return this.http.post<Usuario>(this.baseUrl, usuario);
  }

  update(id: number, usuario: { nome: string; email: string, telefone: string }): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.baseUrl}/${id}`, usuario);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
