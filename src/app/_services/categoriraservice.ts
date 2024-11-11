import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ProdutoService } from './produtoservice';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private apiUrl = 'http://localhost:8080/api/categorias';

  constructor(private produtoService: ProdutoService, private http: HttpClient) {}


  listarCategorias(): Observable<any> {
    console.log('Fazendo GET para listar categorias...');
    return this.http.get<any[]>(`${this.apiUrl}/listarcategorias`).pipe(
      tap((data) => {
        if (!data || data.length === 0) {
          console.warn('A lista de categorias está vazia.');
        }
      })
    );
  }


  salvarCategoria(categoria: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/salvarcategoria`, categoria);
  }

  buscarCategoria(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/buscarcategoria/${id}`);
  }


  atualizarCategoria(id: number, categoria: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/atualizarcategoria/${id}`, categoria);
  }

  
  excluirCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/excluircategoria/${id}`);
  }

}
