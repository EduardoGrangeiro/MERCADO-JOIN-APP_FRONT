import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CategoriaService } from '../_services/categoriraservice';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  categorias: any[] = [];
  mensagem: string = '';
  isAddingNew: boolean = false;
  newCategoria: any = { nome: '', descricao: '' };
  backupCategoria: any = {};

  constructor(private categoriaService: CategoriaService) {}

  getCategorias(): void {
    console.log('Chamando listarCategorias...');
    this.categoriaService.listarCategorias().subscribe(
      (data) => {
        this.categorias = data;
        if (!this.categorias || this.categorias.length === 0) {
          this.mensagem = 'Não há categorias cadastradas.';
        } else {
          console.log(data);
          this.mensagem = '';
        }
      },
      (error) => {
        console.error('Erro ao carregar categorias:', error);
        this.mensagem = 'Erro ao carregar categorias.';
      }
    );
  }

  addCategoria(): void {
    console.log('Abrindo formulário para adicionar nova categoria.');
    this.isAddingNew = true;

    // Calcula o próximo índice com base no maior ID existente
    const nextId = this.categorias.length > 0
      ? Math.max(...this.categorias.map(categoria => categoria.id)) + 1
      : 1;

    this.newCategoria = { id: nextId, nome: '', descricao: '' };
  }

  saveCategoria(): void {
    const nomeExiste = this.categorias?.some(categoria => categoria.nome === this.newCategoria.nome) ?? false;

    if (nomeExiste) {
      alert('Erro: Já existe uma categoria com esse nome!');
      return;
    }

    if (this.newCategoria.nome && this.newCategoria.descricao) {
      this.categoriaService.salvarCategoria(this.newCategoria).subscribe(
        (response) => {
          this.categorias.push(response);
          this.newCategoria = { nome: '', descricao: '' };
          this.isAddingNew = false;
          this.getCategorias();
        },
        (error) => {
          console.error('Erro ao adicionar categoria:', error);
        }
      );
    } else {
      alert('Por favor, preencha todos os campos!');
    }
  }

  cancelAdd(): void {
    this.isAddingNew = false;
    this.newCategoria = { id: '', nome: '', descricao: '' };
  }

  editCategoria(categoria: any): void {
    categoria.isEditing = true;
    this.backupCategoria = { ...categoria };
  }

  saveEdit(categoria: any): void {
    const nomeExiste = this.categorias.some(c => c.nome === categoria.nome && c.id !== categoria.id);

    if (nomeExiste) {
      alert('Erro: Já existe uma categoria com esse nome!');
      return;
    }

    if (!categoria.nome || !categoria.descricao) {
      alert('Erro: Preencha todos os campos corretamente.');
      return;
    }

    this.categoriaService.atualizarCategoria(categoria.id, categoria).subscribe(
      (response) => {
        categoria.isEditing = false;
        console.log('Categoria atualizada com sucesso!', response);
      },
      (error) => {
        console.error('Erro ao salvar categoria:', error);
        alert('Falha ao salvar a categoria. Tente novamente.');
      }
    );
  }

  cancelEdit(categoria: any): void {
    const index = this.categorias.findIndex(c => c.id === categoria.id);
    if (index !== -1) {
      this.categorias[index] = { ...this.backupCategoria, isEditing: false };
    }
  }

  deleteCategoria(id: number): void {
    const confirmDelete = window.confirm(
      'Ao excluir esta categoria, os produtos relacionados também serão excluídos. Você deseja continuar?'
    );

    if (!confirmDelete) {
      return;
    }


    this.categoriaService.excluirCategoria(id).subscribe(
      () => {
        this.categorias = this.categorias.filter(categoria => categoria.id !== id);
        if (this.categorias.length === 0) {
          this.mensagem = 'Não há categorias cadastradas.';
        }
      },
      (error) => {
        console.error('Erro ao deletar categoria:', error);
      }
    );
  }

  ngOnInit(): void {
    this.getCategorias();
  }
}
