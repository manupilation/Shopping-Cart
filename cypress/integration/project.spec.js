const fetchMock = require('../mocks/fetch')
const products = require('../mocks/computerCategory')
const PROJECT_URL = './index.html'

const LOADING = '.loading';
const ITEM_SELECTOR = '.item';
const ADD_CART_BUTTON = '.item__add'
const CART_ITEMS = '.cart__items'
const DELETE_BTN = '.delete-container'
const EMPTY_CART_BUTTON = '.empty-cart'
const TOTAL_PRICE = '.total-price'
const BUY_BUTTON = '.buy'
const ITEM_TITLE = '.item-title'


let results = products.results

function reduceName(name) {
  if (name.includes(',')) {
    return name.substring(0, name.indexOf(','));
  }

  return name.replace('+', ' + ').split(' ').reduce((a, b) => {
    if (a.length < 50) {
      // eslint-disable-next-line no-param-reassign
      a += ` ${b}`;
    }

    return a;
  }, '');
}

const addToCart = (index) => {
  cy.get(ITEM_SELECTOR)
    .should('exist')
    .eq(index)
    .children(ADD_CART_BUTTON)
    .click();
}

const countCart = (amount) => {
  cy.get(CART_ITEMS)
      .children()
      .should('have.length', amount);
}

const checkPrice = (results, indexes) => {
  console.log(results)
  cy.wait(2000);
  let total = 0;
  indexes.forEach(index => total += results[index].price);
  cy.get(TOTAL_PRICE)
      .should('have.text', "R$ " + total.toFixed(2));
}

describe('Shopping Cart Project', () => {
  beforeEach(() => {
    cy.visit(PROJECT_URL, {
      onBeforeLoad(win) {
        win.fetch = fetchMock;
      },
    });
    cy.clearLocalStorage();
  });

  describe('1 - Crie uma listagem de produtos', () => {
    it('Listagem de produtos', () => {
      cy.get(ITEM_SELECTOR)
        .should('exist')
        .should('have.length', 20);
    });    
  });

  describe('2 - Adicione o produto ao carrinho de compras', () => {
    it('Adicione o produto ao carrinho de compras',() => {
      cy.wait(2000);
      addToCart(16);
      countCart(1);
      console.log(results[16].id, results[16].title)
      cy.get(CART_ITEMS)
        .children()
        .should('contain', `${reduceName(results[16].title)}`)
    });
  });
  
  describe('3 - Remova o item do carrinho de compras ao clicar nele', () => {
    it('Remova o item do carrinho de compras ao clicar nele', () => {
      addToCart(19);
      addToCart(11);
      addToCart(15);
      cy.get(DELETE_BTN)
        .children()
        .eq(1)
        .click()
      countCart(2);
      cy.get(DELETE_BTN)
        .children()
        .eq(1)
        .click()
      countCart(1);
      cy.get(DELETE_BTN)
        .children()
        .eq(0)
        .click()
      countCart(0);
  
    });
  });

  describe('4 - Carregue o carrinho de compras através do **LocalStorage** ao iniciar a página', () => {
    it('Carregue o carrinho de compras através do **LocalStorage** ao iniciar a página', () => {
      let first = 16;
      let last = 19;
      cy.visit(PROJECT_URL, {
        onBeforeLoad(win) {
          win.fetch = fetchMock;
        },
      });
      cy.wait(2000);
      addToCart(first);
      countCart(1);
      cy.get(CART_ITEMS)
        .children()
        .first()
        .should('contain', `${reduceName(results[first].title)}`)
       
        addToCart(last);
        cy.wait(2000);
      cy.get(CART_ITEMS)
        .children()
        .last()
        .should('contain', `${reduceName(results[last].title)}`)
  
      cy.reload({
        onBeforeLoad(win) {
          win.fetch = fetchMock;
        },
      });
      cy.get(CART_ITEMS)
        .children()
        .first()
        .should('contain', `${reduceName(results[first].title)}`)
      cy.get(CART_ITEMS)
        .children()
        .last()
        .should('contain', `${reduceName(results[last].title)}`)
    });
  });

  describe('5 - Some o valor total dos itens do carrinho de compras de forma assíncrona', () => {
    it('Some o valor total dos itens do carrinho de compras de forma assíncrona', () => {
      cy.visit(PROJECT_URL, {
        onBeforeLoad(win) {
          win.fetch = fetchMock;
        },
      });
      addToCart(5);
      checkPrice(results, [5]);
      addToCart(12);
      checkPrice(results, [5, 12]);
      addToCart(16);
      checkPrice(results, [5, 12, 16]);
      addToCart(15);
      checkPrice(results, [5, 12, 16, 15]);
      cy.get(CART_ITEMS)
        .children()
        .eq(1)
        .click()
      checkPrice(results, [5, 16, 15]);
    });
  });

  describe('6 - Crie os botões utilitários do carrinho de compras', () => {
    it('Botão para limpar carrinho de compras', () => {
      addToCart(3);
      addToCart(0);
      addToCart(1);
      countCart(3);
      cy.get(EMPTY_CART_BUTTON)
        .click()
      countCart(0);
    });

    it('O botão está presente', () => {
      cy.visit(PROJECT_URL)
      cy.get(BUY_BUTTON)
      .should('exist');
    });
  });

  describe('7 - Adicione um texto de `loading` durante uma requisição à API', () => {
    it('Adicionar um texto de "loading" durante uma requisição à API', () => {

      cy.visit(PROJECT_URL)
      cy.get(LOADING)
        .should('exist')
        .wait(4000)
        .should('not.exist');
    });
  });

  describe.only('8 - Cada item do carrinho possue o nome, valor e um botão para o apagar', () => {
    beforeEach(() => {
      addToCart(1)
      addToCart(10)
      addToCart(13)
    });

    it('Verifica se o nome do produto está presente', () => {
      cy.get(ITEM_TITLE).should((titles) => {
        expect(titles.eq(0)).to.contain(`${reduceName(results[1].title)}`)
        expect(titles.eq(1)).to.contain(`${reduceName(results[10].title)}`)
        expect(titles.eq(2)).to.contain(`${reduceName(results[13].title)}`)
      });
    });
  });
});
