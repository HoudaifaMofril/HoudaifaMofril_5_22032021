const inHtml = document.getElementById("main");
const prixInHtml = document.getElementById("finalPrice");
const btnCommande = document.getElementById("btnCom");
let data = JSON.parse(localStorage.getItem("cart"));

if (localStorage.length > 0) {
    prixInHtml.innerHTML = calculPrixPanier() + " €uros "; //--Fonction qui affiche le prix total de la commande

    data.forEach((objet) => { //-- On céer une boucle pour parcourir chaque produits ajouter dans le localStorage et l'afficher dynamiquement sur la page
        inHtml.innerHTML += `
            <div class="row m-2 pt-3 panierLine">
                <div class="col-md-3 col-lg-2">
                    <img alt="${objet.name}" class="img-fluid" src="${objet.image}">
                </div>
                <div class="col-md-4">
                    <a href="produit.html?id=${objet._id}"><h2>${objet.name}</h2></a>
                    <p><strong>Quantité</strong> : ${objet.quantite}</p>
                    <p><strong>Couleur</strong> : ${objet.colors}</p>
                </div>
                <div class="col-md-5 col-lg-4"
                    <p class="prixProduitPanier"><strong>Prix : <span>${objet.totalPrice} €</span></strong></p>   
                </div>
                <div class="col-md-1">
                    <button class="btn btn-danger mb-3" onclick="deleteItem('${objet._id}', '${objet.colors}')">Supprimer</button>  
                </div>
            </div>
            `;
    });
} else {

    inHtml.innerHTML = `
        <div class="container-fluid">
            
            <p class="text-center lead"><small>Votre panier est vide ! </small><br/><a href="index.html"><b class="voir_produit"> => Voir tout nos produits <=</b></a></p>
            
            
        </div>`
        prixInHtml.innerHTML = "Aucun articles dans votre panier !";
};

//-- Fonction pour supprimer un produit du panier,donc du localStorage, grâce à son _id et à sa couleur

function deleteItem(_id, color) {
 
    const lsUpdate = data.filter((objet) => objet._id !== _id || objet.colors !== color);
    localStorage.setItem("cart", JSON.stringify(lsUpdate));

    if (lsUpdate == 0) {
        localStorage.clear();
    }
    document.location.href = "panier.html";
};

//-- Calcul du prix total Panier

function calculPrixPanier() {
    let totalPriceItem = data.reduce((accumulator, item) => {
        return accumulator + item.totalPrice;
    }, 0);

    return totalPriceItem;
};

/************* On créer des constantes pour le formulaire ******************/

const lastName = document.getElementById('nom ');
const firstName = document.getElementById('prenom ');
const address = document.getElementById('adresse ');
const city = document.getElementById('ville ');
const email = document.getElementById('email ');
const form = document.querySelector("#submitForm");

// ***************** Envoie des données au back-end ***********************

//-- Fonction d'envoie au back-end

form.addEventListener("submit", (e) => {
    e.preventDefault()

    const contact = { // Client à envoyer en objet en POST
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        city: city.value,
        email: email.value,
    };

    

    const products = []; // Teddies en tant que tableau à envoyer en POST
    const donnees = { contact, products }; // Créer donnees comme objet contact + tableau products

    data.forEach((teddies) => {
        products.push(teddies._id);

    });

    // En-têtes pour la requête (dire qu'elle est POST et non GET)
    const options = {
        method: "POST",
        body: JSON.stringify(donnees),
        headers: {
            "Content-Type": "application/json",
        },
    };
//-- On vérifie que l'on attend les bonnes informations dans les champs de contact et que ce ci ne sont pas vides avant envoi au back-end
    if (firstName.value.length == ""  || lastName.value.length == "" || address.value.length == "" || city.value.length == "" || email.value.length == "" ) {
        alert("Tous les champs doivent êtres remplis !") 
        

    } else {
        // Requête POST
        fetch("http://localhost:3000/api/teddies/order", options)
            // On reçoit les données du back
            .then(response => { // On reçoit une première prommesse
                if (response.ok) {
                    
                    return response.json() // Si la response est OK alors , on nous retourne un objet JSON
                } else {
                    Promise.reject(response.status); // Sinon , on recoit le statut de l'érreur
                };
            })

            // Traitement pour l'obtention du numéro de commmande
            .then((datas) => {
                
                const orderId = datas.orderId;
                const priceTotalOrder = calculPrixPanier();
                console.log(priceTotalOrder)

                window.location.href = `confirm.html?order_number=${orderId}&order_price=${priceTotalOrder}`;

            })

            .catch((error) => {
                alert(error);
            });
            
    }
    

});

