const mainGrid = document.querySelector('.grid')
const searchField = document.querySelector('.search')

let card = 0
let cart = []

class Card{
    constructor(id, image, name, description, price, href){
        this._id = id;
        this._image = image;
        this._name = name;
        this._description = description;
        this._price = price;
        this._href = href;
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

    render(){
        const mainWrapper = document.createElement('div');
        mainWrapper.classList.add('card');

        mainWrapper.innerHTML = `
        <div class="add">Добавлено</div>
        <img class="card__image" src="${this.image}" alt="" >
        <div class="card__wrapper">
            <h3 class="card__title">${this.name}</h3>
            <p class="card__description">${this.description}</p>
        </div>
        <div class="card__btn-wrapper">
            <button class="card__btn card__btn_sale" data-price: "${this.price}">Купить</button>
            <a href="" class="card__more">Подробнее</a>
        </div>
        `;
        mainGrid.append(mainWrapper);

        const btn = mainWrapper.querySelector('.card__btn');
        const add = mainWrapper.querySelector('.add')
        btn.addEventListener('click', (e) => {
            this.addToCart(this.id, String(e.target.dataset.price))
            add.classList.add('show')
            btn.disabled = true
        })
    }

    addToCart(id, price) {
        cart.push({
            id,
            price,
        })
        console.log(cart);
    }
}

const item1 = new Card('1234543',
    './images/BMW_G30.jpg',
    "BMW G30",
    "Супер крутая и заряженная BMW по самой низкой цене!",
    1000000
    );
item1.render();

const item2 = new Card(
    '1234678',
    './images/audi_rs30.jpg',
    "Audi RS30",
    "Еще одна крутая машина",
    600000
);
item2.render();

const item3 = new Card(
    '12345098',
    './images/dodge.jpg',
    "Dodge Viper",
    "Еще одна крутая машина",
    600000
);
item3.render();