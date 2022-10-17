// Queria agradecer aos trybees, em especial Matheus Duarte pela força ^^!
//= ============= Variáveis globais ==============
const getCart = document.querySelector('.cart__items');
const getDelButton = document.querySelector('.empty-cart');
const getTotalPrice = document.querySelector('.total-price');
const loading = document.querySelector('.loading');
//= =============                   ==============

//= ============= Começo do código ==============
function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function getLocalStorageProducts() {
  const products = localStorage.getItem('produtosSalvos');

  return products;
}

function calcTotalPrice() {
  const getProducts = getLocalStorageProducts();

  if (getProducts === undefined || getProducts === null) return 0;

  const products = getProducts.split('</li>');

  const calc = products.filter((prod) => prod !== undefined).map((product) => {
    const removeHTML = product.substring(product.indexOf('| PRICE'));
  
    const removePipesAndPrice = removeHTML.substring(10);

    return removePipesAndPrice;
  }).reduce((a, b) => Number(a) + Number(b), 0);

  return calc.toFixed(2);
}

function setTotalPrice() {
  const value = calcTotalPrice();

  getTotalPrice.innerText = `R$ ${value}`;
}

function saveCart() {
  localStorage.setItem('produtosSalvos', getCart.innerHTML);
  setTotalPrice();
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemClickListener(event) {
  // coloque seu código aqui
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

window.onload = () => { };