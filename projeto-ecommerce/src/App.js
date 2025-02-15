import { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import styled from 'styled-components';
import GlobalStyle from './Global';
import Filtros from './components/Filtros/Filtros';
import Carrinho from './components/Carrinho/Carrinho';
import Produtos from './components/Produtos/Produtos';
import dadosProdutos from './assets/mockDeDados.json';

const Header = styled.header`
  padding: 2em 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  background-color: linear-gradient(45deg, #4B0082, #87CEEB, #FF69B4);;
  
  h1 {
    font-size: 3em;
  }
  
  div {
    button {
      font-size: 1.5em;
      background: transparent;
      border: none;
      color: #fff;
      padding: 0.5em 0 0 0.5em;
    }
    
    input {
      padding: 1em;
      border: none;
      border-radius: 1em;
      width: 35em;
    }
  }
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 0.5fr 3fr 1fr;
  font-size: 1em;
  margin-left: 1em;
  margin-right: 1em;
  
  div {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
  }
`;

const ProdutosOrdenados = styled.div`
  margin-top: 1em; 
  display: flex;
  
  label {
    display: flex;
    flex-direction: row;
    margin-left: 1.5em;
    font-size: 1.5em;
    margin-bottom: 0.5em;
  }
  
  select {
    font-size: 0.8em;
    margin-left: 1.2em;
    width: 14em;
    height: 1.8em;
    border-radius: 0.7em;
    text-align: center;
  }
`;

const Prod = styled.div`
  align-items: center;
  justify-content: center;
`;

const Footer = styled.footer`
  height: 10em;
  background-color: linear-gradient(45deg, #4B0082, #87CEEB, #FF69B4);;
  
  h2 {
    text-align: center;
    padding-top: 2em;
  }
`;

function App() {
  const produto = dadosProdutos;
  const [titulo, setTitulo] = useState('');
  const [valorMin, setValorMin] = useState(-Infinity); 
  const [valorMax, setValorMax] = useState(Infinity); 
  const [ordenacao, setOrdenacao] = useState('produto');
  const [ordemCresDec, setOrdemCresDec] = useState('asc');
    const [carrinhoDeCompras, setCarrinhoDeCompras] = useState(() => {
    const savedCart = localStorage.getItem('carrinhoDeCompras');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('carrinhoDeCompras', JSON.stringify(carrinhoDeCompras));
  }, [carrinhoDeCompras]);
  
  const addProdutoCarrinho = (id) => {
    const indexCarrinho = carrinhoDeCompras.findIndex((prodCarrinho) => prodCarrinho.id === id);
    
    if (indexCarrinho < 0) {
      const novoProdutoAdd = {
        ...produto.find((prodCarrinho) => prodCarrinho.id === id),
        quantidade: 1,
      };
      const novoProdAddCarrinho = [...carrinhoDeCompras, novoProdutoAdd];
      setCarrinhoDeCompras(novoProdAddCarrinho);
    } else {
      const novoProdAddCarrinho = carrinhoDeCompras.map(produto => {
        if (produto.id === id) {
          return { ...produto, quantidade: produto.quantidade + 1 };
        }
        return produto;
      });
      setCarrinhoDeCompras(novoProdAddCarrinho);
    }
  };
  
  const removerProdutoDoCarrinho = (id) => {
    const novoProdAddCarrinho = carrinhoDeCompras
      .map((produtos) => {
        if (produtos.id === id) {
          return { ...produtos, quantidade: produtos.quantidade - 1 };
        }
        return produtos;
      })
      .filter((produtos) => produtos.quantidade > 0);
    setCarrinhoDeCompras(novoProdAddCarrinho);
  };
  
  return (
    <>
      <Header>
        <h1>Geek Store Galáxia</h1>
        <div>
          <input
            type="search" 
            placeholder="Busca"
            value={titulo}
            onChange={(e) => { setTitulo(e.target.value) }}
          />
          <button>
            <FaSearch />
          </button>
        </div>
      </Header>
       
      <Container>
        <Filtros
          titulo={titulo}
          valorMin={valorMin}
          valorMax={valorMax}
          setTitulo={setTitulo}
          setValorMin={setValorMin}
          setValorMax={setValorMax}
        /> 
        
        <ProdutosOrdenados>
          <label>Ordenar por:
            <select
              value={ordenacao}
              onChange={(e) => { setOrdenacao(e.target.value) }}
            >
              <option value={"produto"}>Produto (A-Z)</option>
              <option value={"valor"}>Valor</option>
            </select>
            <select
              value={ordemCresDec}
              onChange={(ev) => setOrdemCresDec(ev.target.value)}
            >
              <option value={"asc"}>Crescente</option>
              <option value={"desc"}>Decrescente</option>
            </select>
          </label> 
          
          <Prod>
            {produto
              .filter(prod => {
                return prod.produto.toLocaleLowerCase().includes(titulo) || prod.produto.toLocaleUpperCase().includes(titulo) || prod.produto.includes(titulo)
              })
              .filter(prod => {
                return prod.valor >= valorMin || valorMin === ""
              })
              .filter(prod => {
                return prod.valor <= valorMax || valorMax === ""
              })
              .sort((atualProd, proxProd) => {
                switch (ordenacao) {
                  case "valor":
                    return atualProd.valor - proxProd.valor;
                  default:
                    return atualProd.produto.localeCompare(proxProd.produto);
                }
              })
              .sort(() => {
                if (ordemCresDec === "asc") {
                  return 0;
                } else {
                  return -1;
                }
              })
              .map(prod => {
                return (
                  <Produtos
                    key={prod.id} 
                    prod={prod}
                    id={prod.id}
                    addProdutoCarrinho={addProdutoCarrinho}
                  />
                )
              })}
          </Prod> 
        </ProdutosOrdenados> 
        
        <Carrinho
          carrinhoDeCompras={carrinhoDeCompras}
          removerProdutoDoCarrinho={removerProdutoDoCarrinho}
        />
      </Container>
       
      <Footer>
        <h2>Geek Store Galáxia, sua melhor compra sempre!!!</h2>
      </Footer>
      
      <GlobalStyle /> 
    </>
  );
}

export default App;

