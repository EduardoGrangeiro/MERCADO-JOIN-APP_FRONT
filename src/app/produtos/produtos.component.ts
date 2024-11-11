import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProdutoService } from '../_services/produtoservice';
import { CategoriaService } from '../_services/categoriraservice';

@Component({
  selector: 'app-produto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './produtos.component.html',
  styleUrls: ['./produtos.component.css']
})
export class ProdutosComponent implements OnInit {
  produtos: any[] = [];
  categorias: any[] = [];
  mensagem: string = '';
  isAddingNew: boolean = false;
  newProduto: any = { nome: '', valor: '', quantidade: '', categoria: null };
  backupProduto: any = {};

  constructor(
    private produtoService: ProdutoService,
    private categoriaService: CategoriaService
  ) {}

  getCategorias(): void {
    this.categoriaService.listarCategorias().subscribe(
      (response) => {
        this.categorias = response || [];
      },
      (error) => {
        console.error('Erro ao carregar categorias:', error);
      }
    );
  }

  getProdutos(): void {
    console.log('Chamando listarProdutos...');
    this.produtoService.listarProdutos().subscribe(
      (data) => {
        this.produtos = data;
        this.mensagem = this.produtos.length === 0 ? 'Não há produtos cadastrados.' : '';
      },
      (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.mensagem = 'Erro ao carregar produtos.';
      }
    );
  }

  addProduto(): void {
    console.log('Abrindo formulário para adicionar novo produto.');
    this.isAddingNew = true;
    this.newProduto = { nome: '', valor: '', quantidade: '', categoria: null };
  }

  saveProduto(): void {
    if (!this.newProduto.nome || !this.newProduto.valor || !this.newProduto.quantidade) {
      alert('Por favor, preencha todos os campos!');
      return;
    }

    if (!this.newProduto.categoria) {
      alert('Por favor, selecione uma categoria válida!');
      return;
    }

    const produtoComCategoriaId = {
      nome: this.newProduto.nome,
      valor: this.newProduto.valor,
      quantidade: this.newProduto.quantidade,
      categoria: this.newProduto.categoria
    };

    this.produtoService.salvarProduto(produtoComCategoriaId).subscribe(
      (response) => {
        this.produtos.push(response);
        this.newProduto = { nome: '', valor: '', quantidade: '', categoria: null };
        this.isAddingNew = false;
        this.getProdutos();
      },
      (error) => {
        console.error('Erro ao adicionar produto:', error);
      }
    );
  }

  cancelAdd(): void {
    this.isAddingNew = false;
    this.newProduto = { nome: '', valor: '', quantidade: '', categoria: null };
  }

  editProduto(produto: any): void {
    produto.isEditing = true;
    this.backupProduto = { ...produto };
  }

  saveEdit(produto: any): void {
    if (!produto.nome || !produto.valor || produto.valor <= 0 || !produto.quantidade || !produto.categoria) {
      alert('Erro: Preencha todos os campos corretamente.');
      return;
    }

    const produtoAtualizado = {
      id: produto.id,
      nome: produto.nome,
      valor: produto.valor,
      quantidade: produto.quantidade,
      categoria: produto.categoria // Agora é apenas o ID da categoria
    };

    this.produtoService.atualizarProduto(produto.id, produtoAtualizado).subscribe(
      (response) => {
        produto.isEditing = false;
        console.log('Produto atualizado com sucesso!', response);
        this.getProdutos();
      },
      (error) => {
        console.error('Erro ao salvar produto:', error);
        alert('Falha ao salvar o produto. Tente novamente.');
      }
    );
  }

  cancelEdit(produto: any): void {
    const index = this.produtos.findIndex(p => p.id === produto.id);
    if (index !== -1) {
      this.produtos[index] = { ...this.backupProduto, isEditing: false };
    }
  }

  deleteProduto(id: number): void {
    this.produtoService.excluirProduto(id).subscribe(
      () => {
        this.produtos = this.produtos.filter(produto => produto.id !== id);
        this.mensagem = this.produtos.length === 0 ? 'Não há produtos cadastrados.' : '';
      },
      (error) => {
        console.error('Erro ao deletar produto:', error);
      }
    );
  }

  ngOnInit(): void {
    this.getCategorias();
    this.getProdutos();
  }
}
