import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Produto } from '../produtos/produto.model';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private apiUrl = 'http://localhost:8080/api/produtos';

  constructor(private http: HttpClient) {}

  // 1. Retornar lista de produtos - GET
  listarProdutos(): Observable<any> {
    console.log('Fazendo GET para listar produtos...');
    return this.http.get<any[]>(`${this.apiUrl}/listarprodutos`).pipe(
      tap((data) => {
        if (!data || data.length === 0) {
          console.warn('A lista de produtos está vazia.');
        }
      })
    );
  }

  // 2. Salvar Produto - POST
  salvarProduto(produto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/salvarproduto`, produto);
  }

  // 3. Buscar Produto por ID - GET
  buscarProduto(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/buscarproduto/${id}`);
  }

  // 4. Atualizar Produto por ID - PUT
  atualizarProduto(id: number, produto: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/atualizarproduto/${id}`, produto);
  }

  // 5. Excluir Produto por ID - DELETE
  excluirProduto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/excluirproduto/${id}`);
  }

}
