import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ViewportScroller } from '@angular/common';
import { ProdutoService } from './_services/produtoservice';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mercado-join-app';

  constructor(private router: Router, private viewportScroller: ViewportScroller, private produtoServe: ProdutoService) {}


  redirecionarParaProdutos() {
    console.log('Redirecionando para Produtos...');
    this.router.navigate(['/produtos']).then(() => {
      console.log('Navegação concluída');
      this.viewportScroller.scrollToPosition([0, 500]);
    }).catch(error => {
      console.error('Erro ao redirecionar:', error);
    });
  }



  redirecionarParaCategorias() {
    this.router.navigate(['/categoria']).then(() => {
      this.viewportScroller.scrollToPosition([0, 500]);
    });
  }
/*
ngOnInit(): void {
    this.produtoServe.listarProdutos().subscribe({
      next: (response) =>
        console.log(response);
    })
}*/


  }



