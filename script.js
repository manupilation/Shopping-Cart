// Queria agradecer aos trybees, em especial Matheus Duarte pela força ^^!
//= ============= Variáveis globais ==============
const getCart = document.querySelector('.cart__items');
const getDelButton = document.querySelector('.empty-cart');
const getTotalPrice = document.querySelector('.total-price');
const loading = document.querySelector('.loading');
//= =============                   ==============

//= ============= Começo do código ==============
function createProductImageElement(imageSource) {
  const imageDiv = document.createElement('div');
  const img = document.createElement('img');

  imageDiv.className = 'image-container';
  img.className = 'item__image';
  img.src = imageSource;
  imageDiv.appendChild(img);

  return imageDiv;
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

function restoreCart() {
  getCart.innerHTML = localStorage.getItem('produtosSalvos');
  setTotalPrice();
}

function createCustomElement(element, className, innerText) {
  const newElement = document.createElement(element);
  newElement.className = className;
  newElement.innerText = innerText;
  return newElement;
}

function cartItemClickListener(event) {
  event.target.remove();
  saveCart();
}

function deleteAllCart() {
  getCart.innerHTML = '';
  saveCart();
}

getDelButton.addEventListener('click', (deleteAllCart));

getCart.addEventListener('click', (cartItemClickListener));

function createCartItemElement({ id: sku, title: name, price: salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  getCart.appendChild(li);
}

const setItemOnCart = async (itemId) => {
  try {
    const product = await (await fetch(`https://api.mercadolibre.com/items/${itemId}`)
    ).json();
      createCartItemElement(product);
  } catch (Error) {
    alert(Error);
  }
  saveCart();
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const items = document.querySelector('.items');
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('a', 'item__add', 'Adicionar ao carrinho!'));
  section.lastElementChild.addEventListener('click', (callback) => {
    const getId = callback.target.parentElement.firstElementChild.innerHTML;
    setItemOnCart(getId);
  });

  items.appendChild(section);
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function getSiteApi() {
  fetch('https://api.mercadolibre.com/sites/MLB/search?q=computador')
    .then((result) => {
      result.json()
    .then((another) => another.results.forEach((element, i) => {
      setTimeout(() => {
        loading.remove();
        if (i >= 20) return;
        createProductItemElement(element);
      }, 1500);
    }));
  })
    .catch(() => console.log('Error'));
}

window.onload = () => { 
  getSiteApi(); 
  restoreCart();
};
