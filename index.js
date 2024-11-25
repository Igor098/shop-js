import shop from "./data/products.js";

const mainGrid = document.querySelector('.grid');
const searchField = document.querySelector('.search__input');
const searchBtn = document.querySelector('.search__btn');
const cartCount = document.querySelector('.cart-btn__count');
const cartWindow = document.querySelector('.cart')
const cartItems = document.querySelector('.cart__items');
const cartOpener = document.querySelector('.cart-btn')
const cartCloser = cartWindow.querySelector('.cart-btn__close')

let cart = localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
console.log(cart);

class Card{
    constructor(id, image, name, description, price, href="", count=0){
        this._id = id;
        this._image = image;
        this._name = name;
        this._description = description;
        this._price = price;
        this._href = href;
        this._count = count;
    }

    get id(){
        return this._id;
    }

    get image() {
        return this._image;
    }

    get name() {
        return this._name;
    }

    get description() {
        return this._description;
    }

    get price() {
        return this._price;
    }

    get href() {
        return this._href;
    }


    get count() {
        return this._count;
    }


    set count(value) {
        this._count = value;
    }

    render(){
        const mainWrapper = document.createElement('div');
        mainWrapper.classList.add('card');

        mainWrapper.innerHTML = `
        <img class="card__image" src="${this.image}" alt="">
        <div class="card-content">
            <div class="card__wrapper">
                <h3 class="card__title">${this.name}</h3>
                <p class="card__description">${this.description}</p>
            </div>
            <div class="card__btn-wrapper">
                <button class="card__btn card__btn-buy card__btn_style_normal btn-reset" data-price: "${this.price}">Купить</button>
                <div class="card__buttons hidden">
                    <button class="card__btn card__btn-remove card__btn_style_easy btn-reset">-</button>
                    <span class="card__count">${this.count}</span>
                    <button class="card__btn card__btn-buy card__btn_style_easy btn-reset"">+</button>                    
                </div>
                <a href="" class="card__more">Подробнее</a>
            </div>
        </div>
        `;
        mainGrid.append(mainWrapper);

        const saleButtons = mainWrapper.querySelectorAll('.card__btn-buy');
        const removeFromCartBtn = mainWrapper.querySelector('.card__btn-remove');
        const cardAddedWrapper = mainWrapper.querySelector('.card__buttons')
        const countText = mainWrapper.querySelector('.card__count');

        saleButtons.forEach((saleBtn) => saleBtn.addEventListener('click', (e) => {
            addToCart(this.id, String(e.target.dataset.price));
            this.count += 1;
            saleButtons[0].disabled = true;
            saleButtons[0].classList.add('hidden');
            cardAddedWrapper.disabled = false;
            cardAddedWrapper.classList.remove('hidden');
            countText.innerText = cart.filter(item => item.id === this.id).reduce((a, b) => a + b.count, 0);
        }))

        removeFromCartBtn.addEventListener('click', () => {
            removeFromCart(this.id);
            this.count -= 1;
            if (this.count === 0) {
                cardAddedWrapper.disabled = true;
                cardAddedWrapper.classList.add('hidden');
                saleButtons[0].disabled = false
                saleButtons[0].classList.remove('hidden');
            }
            countText.innerText = cart.filter(item => item.id === this.id).reduce((a, b) => a + b.count, 0);
        })

        const itemInCart = cart.find(item => item.id === this.id);
        // console.log(itemInCart);
        saleButtons[0].disabled = itemInCart;
        itemInCart && saleButtons[0].classList.add('hidden');

        cardAddedWrapper.disabled = !itemInCart;
        itemInCart && cardAddedWrapper.classList.remove('hidden');
    }
}

class Cart {

    render(item){
        const mainWrapper = document.createElement('div');
        mainWrapper.classList.add('cart__item');
        let count = cart.filter(el => el.id === item.id).reduce((a, b) => a + b.count, 0);

        mainWrapper.innerHTML = `
        <img class="cart__image" src="${item.image}" alt="">

        <div class="cart__desc">
            <h3 class="cart__title">${item.name}</h3>
            <span class="cart__supplier">${item.supplier}</span>
        </div>
    
        <div class="cart__characters">
            <span class="cart__price">${item.price} ₽</span>
            <div class="cart__data-wrapper">
                <div class="cart__buttons">
                    <button class="cart__btn-remove btn-reset">-</button>
                    <span class="cart__count">${count}</span>
                    <button class="cart__btn-buy btn-reset">+</button>
                </div>
            </div>
        </div>
        `;

        cartItems.append(mainWrapper);

        const countText = mainWrapper.querySelector('.cart__count');
        const btnBuy = mainWrapper.querySelector('.cart__btn-buy');
        const btnRemove = mainWrapper.querySelector('.cart__btn-remove');

        btnBuy.addEventListener('click', () => {
            addToCart(item.id, item.price);
            count = cart.filter(el => el.id === item.id).reduce((a, b) => a + b.count, 0);
            countText.innerText = count;
            renderAll()
        })

        btnRemove.addEventListener('click', () => {
            if (count > 1) {
                removeFromCart(item.id);
                count = cart.filter(el => el.id === item.id).reduce((a, b) => a + b.count, 0);
                countText.innerText = count;
                console.log(count)
            }else{
                removeFromCart(item.id);
                this.renderAll()
            }
            renderAll()
        });
    }

    renderAll() {
        removeCartAll()
        const elements = cart.map(cartItem => {
            const shopElement = shop.find(item => item.id === cartItem.id);
            return {...shopElement};
        });
        elements.forEach(item => {
            this.render(item);
        })
    }
}

const addToCart = (id, price) => {
    const {cartItem, index} = getElementInfo(id)
    if (Boolean(cartItem)) {
        const item = {
            ...cartItem,
            'count': cartItem.count && cartItem.count + 1,
        }
        cartItem.price = price * item.count
        cart.splice(index, 1, item)
    } else {
        cart.push({
            id: id,
            price: price,
            count: 1,
        })
    }
    localStorage.setItem('cart', JSON.stringify(cart))
    setCartCount()
}

const removeFromCart = (id) => {
    const {cartItem, index} = getElementInfo(id);
    if (cartItem.count > 1){
        const item = {
            ...cartItem,
            'count': cartItem.count && cartItem.count - 1,
        }
        cartItem.price = cartItem.price * item.count
        cart.splice(index, 1, item)
    }else {
        cart.splice(index, 1)
    }
    // console.log(cart);
    localStorage.setItem('cart', JSON.stringify(cart))
    setCartCount()
}

const setCartCount = () => {
    if (cart.length) {
        cartCount.classList.remove('hidden');
        cartCount.textContent = cart.reduce((total, item) => total + item.count, 0);
    }else{
        cartCount.classList.add('hidden');
    }
}

const getElementInfo = (id) => {
    const cartItem = cart.find(item => item.id === id);
    const index = cart.findIndex(el => el.id === id)
    return {cartItem, index}
}

const removeCardAll = () => {
    while (mainGrid.firstChild) {
        mainGrid.replaceChildren()
    }
}

const renderAll = (text) => {
    removeCardAll()
    const searchedItems = !text ? shop : shop.filter((item) => item.name
            .toLowerCase()
        .includes(text)
        || item.description
            .toLowerCase()
            .includes(text));
    searchedItems.forEach(searchedItem => {
        const itemInCart = cart.find(item => item.id === searchedItem.id);
        console.log(itemInCart)
        if (itemInCart) {
            new Card(searchedItem.id, searchedItem.image, searchedItem.name, searchedItem.description, searchedItem.price, "", itemInCart.count).render();
        }else{
            new Card(searchedItem.id, searchedItem.image, searchedItem.name, searchedItem.description, searchedItem.price).render();
        }
    })
}

searchField.addEventListener('input', (e) => {
    !e.target.value && renderAll();
})

searchBtn.addEventListener('click', () => {
    const text = searchField.value.toLowerCase();
    renderAll(text)
})

const openModalAndLockScroll = () => {
    cartWindow.showModal();
    document.body.classList.add('scroll-lock');
    new Cart().renderAll();
}

const closeOnBackDropClick = ({ currentTarget, target }) => {
    const isClickedOnBackDrop = target === currentTarget
    if (isClickedOnBackDrop) {
        closeDialog()
    }
}

const returnScroll = () => {
    document.body.classList.remove('scroll-lock')
}

const closeDialog = () => {
    cartWindow.close()
    returnScroll()
}

const removeCartAll = () => {
    while (cartItems.firstChild) {
        cartItems.replaceChildren();
    }
}

cartWindow.addEventListener('click', closeOnBackDropClick)
cartWindow.addEventListener('cancel', () => {
    returnScroll()
});

cartOpener.addEventListener('click', openModalAndLockScroll);

cartCloser.addEventListener('click', (event) => {
    event.stopPropagation()
    removeCartAll()
    closeDialog()
})

document.addEventListener('DOMContentLoaded', () => {
    setCartCount()
    renderAll()
})