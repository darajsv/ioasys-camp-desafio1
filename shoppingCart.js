class shoppingCart {

    constructor(client, date, newClient){
        this.client = client;
        this.newCLient = newClient
        this.date = date;
        this.items = [];
        this.totalPrice = 0 ;
        this.coupon = null;
    }
    //getters
    get totalItems() {
        let quantity = 0;
        for(const item of this.items){
            quantity += item.quantity;
        }
        
        return quantity;
    }

    get productList(){
        let list = '';
        for(const item of this.items){
            list += '\n(' + item.quantity + 'x) ' + item.product.name + '\t R$' + item.product.price * item.quantity
        }

        return list;
    }


    addItems( product, quantity) {
        this.items.push({product, quantity});
        this.calcTotalPrice();
    }
    addItemList(list) {
        this.items.push(...list); 
        this.calcTotalPrice();
    }
    
    //remove itens do carrinho pelo o codigo, e a quantidade a ser removida
    removeItems(productCode,quantity) {
        for(let i = 0; i<this.items.length;i++){
            if(this.items[i].product.code == productCode){
                this.items[i].quantity -= quantity;
                if(this.items[i].quantity == 0){
                    this.items.splice(i,1);
                }
            }
        }
        this.calcTotalPrice();
    }
    calcTotalPrice() {
        let totalPrice = 0;

        for(const item of this.items){
            totalPrice += item.product.price * item.quantity
        }

        this.totalPrice = totalPrice;
    }

    addCoupon(code) {
        if (code.toUpperCase().startsWith('CAMP') && !code.includes('-') && parseInt(code.slice(4)) <= 50) { //slice corta os 4 primeiros caracteres, deixando so o numero
            this.coupon = parseInt(code.slice(4)) / 100;
        }
    }

    checkout() {
        let totalPrice;

        if(this.newCLient){
            totalPrice = this.totalPrice * 0.8;
        }
        else if(this.coupon) {
            totalPrice = this.totalPrice * (1 - this.coupon);
        }
        else {
            if(this.totalPrice > 100) {
                totalPrice = this.totalPrice *0.95;
            }
            else{
                totalPrice = this.totalPrice;
            }
        }
        this.totalPrice = totalPrice;
        return totalPrice.toFixed(2); //toFixed formata para aceitar no maximo 2 casas decimais
    }
}

function Product(code, name, price) {
    this.code = code;
    this.name = name;
    this.price = price;
}

const myCart = new shoppingCart('Dara', new Date(), false )

myCart.addItems({ code: 001, name: 'caneta', price: 3}, 5);
myCart.addItems({ code: 002, name: 'caderno', price: 10}, 3);

myItemList = [
    { product: new Product( 003, 'borracha', 3), quantity: 1},
    { product: new Product( 004, 'lapis', 2), quantity: 5},
    { product: new Product( 005, 'marca-texto', 5), quantity: 1}
];

myCart.addItemList(myItemList);

myCart.removeItems(001,3);
myCart.removeItems(005,1);

myCart.addCoupon('camp20');

function receipt(myCart){
    let dateFormat = myCart.date.toLocaleDateString().split('-');

    const receipt = `
        O cliente ${myCart.client} realizou uma compra no dia ${dateFormat} dos seguintes itens:
        ${myCart.productList}
            
        Total de itens: ${myCart.totalItems}
        Valor Total: R$ ${myCart.totalPrice}
        ${
            myCart.newClient && 'Ganhou desconto de primeira compra' 
            || myCart.coupon && `Usou um cupom de ${myCart.coupon * 100}%`
            || myCart.totalPrice > 100 && 'Ganhou 5% de desconto (acima de R$ 100)'
        }
        O valor final da compra é de R$${myCart.checkout()}
        `;

    return (paymentMethod, splitPayment) => {
        const splitPrice = (myCart.totalPrice / splitPayment).toFixed(2);
        return `${receipt}\nPagamento com ${paymentMethod} em ${splitPayment}x de RS ${splitPrice}\n`;
    }
}

console.log(receipt(myCart)('Cartão de Credito', 3));