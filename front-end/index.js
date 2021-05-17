const inHtml = document.getElementById('main'); //récupération id=main

fetch('http://localhost:3000/api/teddies') //fetch sur l'url de l'API
    .then(response => { // Renvoi d'une première promesse
        if (response.ok) {
            return response.json() // Si la "résponse" est OK, on retourne un objet JSON
        } else {
            Promise.reject(response.status); // Sinon, on retroune l'erreur.
        };

    })
    .then(data => { // Si la réponse est OK, on envoie une 2éme promesse
        data.forEach(teddy => { // On créée une boucle pour récupérer les informations de l'API 
            

            let priceTeddies = teddy.price / 100; //Variable prix pour le diviser par 100

            //On créer du HTML dynamique avec les bonnes variables
            inHtml.innerHTML += `
                <div class="card card-body col-12 col-md-6 col-lg-4 mx-auto m-2 border-dark rounded">
                    <img alt="${teddy.name}" class="img-fluid rounded " style=height:250px src="${teddy.imageUrl}">
                    <h2>${teddy.name}</h2>
                    <p>${priceTeddies.toFixed(2)} €</p>
                    <a href="produit.html?id=${teddy._id}" class="btn-outline-secondary text-center">Voir ${teddy.name}</a>
                </div>
                `;
        });

    }).catch((error) => {
        console.log(error);
    });