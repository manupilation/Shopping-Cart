// Queria agradecer aos trybees, em especial Matheus Duarte pela força ^^!
//= ============= Variáveis globais ==============
const getCart = document.querySelector('.cart__items');
const getDelButton = document.querySelector('.empty-cart');
const getTotalPrice = document.querySelector('.total-price');
const getSearchInput = document.querySelector('#searchInput');
const search = document.querySelector('.search-img');
const cardsContainer = document.querySelector('.cards-container');
const items = document.querySelector('.items');

//= =============                   ==============

//= ============= Começo do código ==============
function createProductImageElement(imageSource) {
  const imageDiv = document.createElement('div');
  const img = document.createElement('img');

  imageDiv.className = 'image-container grid-cl-f';
  img.className = 'item__image';
  img.src = imageSource;
  imageDiv.appendChild(img);

  return imageDiv;
}

/** @param {PointerEvent} event */
function cartItemClickListener(event) {
  event.currentTarget.parentNode.remove();
  saveCart();
}

function setDeleteItemOnCart() {
  const deleteItemList = document.querySelectorAll('.delete-container');
  
  return Array.from(deleteItemList).forEach((delItem) => {
    delItem.addEventListener('click', cartItemClickListener);
  });
}

/** @param {String} name */
function reduceName(name) {
  if (name.includes(',')) {
    return name.substring(0, name.indexOf(','));
  }

  return name.replace('+', ' + ').split(' ').reduce((a, b) => {
    if (a.length < 50) {
      a += ` ${b}`;
    }

    return a;
  }, '');
}

function getLocalStorageProducts() {
  const products = localStorage.getItem('produtosSalvos');

  return products;
}

function calcTotalPrice() {
  const prices = document.querySelectorAll('.item-price');

  const calc = Array.from(prices).filter((prod) => prod !== undefined)
   .map((prodPrice) => String(prodPrice.innerText).replace('R$ ', ''))
   .reduce((a, b) => Number(a) + Number(b), 0);

  return calc.toFixed(2);
}

function setTotalPrice() {
  const value = calcTotalPrice();

  getTotalPrice.innerText = `R$ ${value}`;
}

function saveCart() {
  const ids = document.querySelectorAll('.item-id');
  const arrayOfIds = [];

  if (ids) {
    ids.forEach((id) => {
      arrayOfIds.push(id.innerHTML);
    });
  }

  localStorage.setItem('produtosSalvos', arrayOfIds);

  setTotalPrice();
  setDeleteItemOnCart();
}

async function restoreCart() {
  const ids = getLocalStorageProducts().split(',');

  if (ids[0].length > 0) {
    ids.forEach((id) => {
      setItemOnCart(id);
    });
  }

  setTotalPrice();
}

function createCustomElement(element, className, innerText = '') {
  const newElement = document.createElement(element);
  newElement.className = className;
  newElement.innerText = innerText;
  return newElement;
}

function deleteAllCart() {
  getCart.innerHTML = '';
  saveCart();
}

getDelButton.addEventListener('click', (deleteAllCart));

function createCartItemElement({ id, title: name, price: salePrice }) {
  const li = createCustomElement('li', 'cart__item');
  const itemId = createCustomElement('span', 'item-id', id);
  const p = createCustomElement('p', 'cart-text font-1-s');
  const itemTitle = createCustomElement('p', 'item-title', reduceName(name));
  const itemPrice = createCustomElement('span', 'item-price', `R$ ${salePrice.toFixed(2)}`);
  const deleteContainer = createCustomElement('div', 'delete-container');
  const deleteButton = createCustomElement('img', 'delete-button');

  itemId.hidden = true;

  deleteButton.setAttribute('src', './images/delete_FILL0_wght400_GRAD0_opsz48.svg');
  deleteContainer.appendChild(deleteButton);
  deleteContainer.addEventListener('click', cartItemClickListener);

  p.appendChild(itemTitle);
  p.appendChild(itemPrice);
  li.appendChild(itemId);
  li.appendChild(p);
  li.appendChild(deleteContainer);
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

function createPrices(price, originalPrice) {
  if (originalPrice === null || originalPrice === undefined) {
    return { cPrice: price, oPrice: undefined };
  }

  if (price < originalPrice) {
    return { cPrice: price, oPrice: originalPrice };
  }

  return {
    cPrice: price,
    oPrice: undefined,
  };
}

function renderPrices({ cPrice, oPrice }) {
  const pricesContainer = document.createElement('div');
  pricesContainer.classList = 'prices-container grid-cl-f';

  const createOriginalPrice = document.createElement('span');
  createOriginalPrice.classList = 'originalPrice font-1-s-b cr2';

  if (oPrice) {
    createOriginalPrice.innerText = `R$ ${oPrice.toFixed(2).replace('.', ',')}`;
    pricesContainer.appendChild(createOriginalPrice);
  }

  const createCurrentPrice = document.createElement('span');
  createCurrentPrice.classList = 'currentPrice font-1-s-b cg2';
  createCurrentPrice.innerText = `R$ ${cPrice.toFixed(2).replace('.', ',')}`;

  pricesContainer.appendChild(createCurrentPrice);

  return pricesContainer;
}

function createSeeMoreButton(url) {
  const button = document.createElement('a');
  button.innerText = 'saiba mais';
  button.classList = 'see-more-button cwp font-2-xs';
  button.setAttribute('target', '_blank');
  button.setAttribute('rel', 'noopener noreferrer');
  button.setAttribute('href', url);

  return button;
}

function createProductItemElement({
    id: sku,
    title: name,
    thumbnail: image,
    original_price: op,
    price,
    permalink,
  }) {
  const section = document.createElement('section');
  section.className = 'item';
  
  const definePrices = createPrices(price, op);
  
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__title font-1-s cgw', reduceName(name)));
  section.appendChild(renderPrices(definePrices));
  section.appendChild(createSeeMoreButton(permalink));
  section.appendChild(createCustomElement('a', 'item__add', '+'));
  section.lastElementChild.addEventListener('click', (callback) => {
    const getId = callback.target.parentElement.firstElementChild.innerHTML;
    setItemOnCart(getId);
  });

  items.appendChild(section);
}

// function getSkuFromProductItem(item) {
//   return item.querySelector('span.item__sku').innerText;
// }

function createLoading() {
  const loadingElement = document.createElement('section');

  loadingElement.classList.add('loading');

  return loadingElement;
}

function removeLoading() {
  const loading = document.querySelector('.loading');

  if (loading) {
    loading.remove();
  }
}

function getSiteApi(product) {
  cardsContainer.appendChild(createLoading());
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=${product}`)
    .then((result) => {
      result.json()
    .then((another) => another.results.forEach((element, i) => {
      setTimeout(() => {
        if (i >= 20) {
          removeLoading();
          return;
        }
        createProductItemElement(element);
      }, 1500);
    }));
  })
    .catch((e) => console.log(e));
}

function handleSearchClick(_e) {
  if (getSearchInput.value.length >= 2) {
    items.innerHTML = '';
    getSiteApi(getSearchInput.value);
  }
}

function handleEnterSearch(event) {
  if (event.key === 'Enter' && getSearchInput.value.length >= 2) {
    items.innerHTML = '';
    getSiteApi(getSearchInput.value);
  }
}

function setSearchEvent() {
  search.addEventListener('click', handleSearchClick);
  getSearchInput.addEventListener('keypress', handleEnterSearch);
}

window.onload = () => { 
  getSiteApi('computador'); 
  restoreCart();
  setSearchEvent();
  setDeleteItemOnCart();
};
