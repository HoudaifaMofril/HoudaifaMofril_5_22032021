localStorage.clear(); //On vide le localStorage dés que la commande est confirmé et que tout est OK



const inHtml = document.getElementById('order_number');
const params = new URLSearchParams(window.location.search);
const totalPriceOrder = document.getElementById("total_price_order");

//On récupére le numéro de commande envoyé par le back-end
const numCommande = params.get('order_number');
const priceOrders = params.get('order_price');

inHtml.innerHTML = numCommande;//-- On affiche le numéro de commande sur la page de confirmation
totalPriceOrder.innerHTML = priceOrders + ' euros ';


