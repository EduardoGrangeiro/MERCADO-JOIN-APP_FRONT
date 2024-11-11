export interface Produto {
  id: number;
  nome: string;
  quantidade: number;
  valor: number;
  categoria: {
    id: number;
    nome: string;
    descricao: string;
  };
}
