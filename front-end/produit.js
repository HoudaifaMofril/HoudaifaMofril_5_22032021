const inHtml = document.getElementById('main');
const params = new URLSearchParams(window.location.search);


//On récupére l'id du Teddy dans l'URL avec fetch pour récupérer les information du teddy(_id) en question.
fetch(`http://localhost:3000/api/teddies/${params.get('id')}`)
    .then(response => {
        if (response.ok) {
            return data = response.json()
        } else {
            Promise.reject(response.status);
        };
    })
    .then(data => {
        

        //--Variable prix pour le diviser par 100
        let priceProdUnit = (data.price / 100).toFixed(2);

        //--Variable vide qui acceuillera les options de couleurs pour les teddies. On récupérera ces couleurs avec une boucle.
        let colors = "";

        data.colors.forEach(color => {
            colors += `<option value="${color}">${color}</option>`;
        });

        //--Ecriture dynamique du HTML
        inHtml.innerHTML += `
                <div class="card card-body col-12 col-lg-6 border-dark border-right-0">
                    <img alt="${data.name}" class="img-fluid" src="${data.imageUrl}">
                </div>
                <div class="card col-12 col-lg-6 pb-3 border-dark border-left-0">
                    <h2>${data.name}</h2>
                    <p>${data.description}</p>
                    <form>
                        <label for="quantiteProduit">Quantité:</label>
                        <input id ="quantiteProduit" type="number" min="1" value="1"/>
                            <div class="col-auto my-1 pb-5 mt-4">
                                <label class="mr-sm-2" for="inlineFormCustomSelect">Couleur</label>
                                <select class="custom-select mr-sm-2" id="inlineFormCustomSelect">
                                    ${colors}   
                                </select>        
                            </div>
                        <p><strong>Prix total</strong> : <span id="totalPrice">${priceProdUnit}</span> €</p>
                        <button id="btnAjoutId" type="button" class="btn btn-success"><i class="fas fa-cart-arrow-down fa-lg"></i> Ajouter au panier</button>
                    </form>   
                </div>
                `;


        //--Appel de la fonction qui calculera le prix Total
        calculePrice(priceProdUnit)

        //--On déclare les variables dont on aura besoin pour le localStorage:
        const btnAjout = document.getElementById('btnAjoutId'); //--Bouton d'ajout au panier
        const cart = JSON.parse(localStorage.getItem("cart")) || [];//-- Array qui contient les informations key/values du localStorage
        const colorElm = document.getElementById('inlineFormCustomSelect');//--Variable qui contient les couleurs des teddies
        const quantityElm = document.getElementById('quantiteProduit');//--Variable qui contient la quantité demandé

        btnAjout.addEventListener('click', () => {//-- On écoute le bouton d'ajout au panier (click)
            ajoutLocalStor()//-- Au 'click' , on appelle la fonction ajoutLocalStor, pour enregistrer les élements dans el localStorage.
        });

        //--On créer une fonction qui va catché les données voulues et les stocker dans un objet
        function ajoutLocalStor() {
            const oldteddy = cart.find((item) => item._id == data._id && item.colors == colorElm.value);
            if (oldteddy != undefined) {
                oldteddy.quantite = parseInt(oldteddy.quantite) + parseInt(quantityElm.value)
                oldteddy.totalPrice = data.price /100 * oldteddy.quantite
                
            } else {
                let objetTabb = {
                    _id: data._id,
                    image: data.imageUrl,
                    name: data.name,
                    colors: colorElm.value,
                    quantite: quantityElm.value
                };
                cart.push(objetTabb);

            }
            localStorage.setItem('cart', JSON.stringify(cart));
            window.location.href = 'panier.html';
        };



    });

//--- Fonction qui calcule dynamiquement le prix total en fonction de la quantité sur la page produit.js
function calculePrice(priceProdUnit) {
    let quantites = document.getElementById('quantiteProduit');
    quantites.addEventListener('change', (event) => {
        const result = document.getElementById('totalPrice');
        result.textContent = (`${priceProdUnit}` * `${event.target.value}`).toFixed(2);
    });
};