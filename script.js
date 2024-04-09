//creation d'un objet de type carte avec les informations
function creerAuto(stockVoitures) {
    $("#vehicules").append(`

<div class="card w-50">
<img src="${stockVoitures.photo}" class="d-block w-100"  alt="...">
<div class="card-body">
        <h5 class="card-title">${stockVoitures.marque}</h5>
        <p class="card-text">${stockVoitures.id}</p>
    </div>
    <ul class="list-group list-group-flush">
        <li class="list-group-item">${stockVoitures.modele}</li>
        <li class="list-group-item">${stockVoitures.annee}</li>
        <li class="list-group-item">${stockVoitures.autonomie}</li>
        <li class="list-group-item">${stockVoitures.prix}<span>$</span></li>
        <div class="card-text">
        <div>
            <label for="heros-${stockVoitures.id}">Couleur</label>
            <input type="color" value="${stockVoitures.couleur}" id="heros-${stockVoitures.id}">
        </div>
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
     <button href="#" class="btn btn-primary btn-sm" onclick="supprimer(${stockVoitures.id})">supprimer</button>
     </div>
    </ul>
</div>
`)}

/*
*façon javascript (sans bibliotheque)
* la fonction fetch return une promesse qui resoud avec une réponse
* ce code effectue la requete pour recuperer des données Json a partir de l'API, traite les données
* et utilise la fonction creerAuto pour creer dynamiquement les cartes de voitures, il gere aussi les erreurs
 */
fetch('https://6610503f0640280f219cd0f9.mockapi.io/stockVoitures')
    //then est utiliser pour gerer la reponse
    .then(function (reponse) {
        //Un problème s'est produit
        if (!reponse.ok) {
            //Lancer une exception (pas de distinction de syntaxe entre exception et erreur)
            throw new Error("Erreur " + reponse.status);
        }
        //si ok, la meth Json est appelée pour extraire les données
        return reponse.json();
    })
    //la methode then est utilisée ici pour gerer les données Json et prends en param une fontion anonyme
    //qui itere sur chaque élément du tableau vehicules
    .then(function (vehicules) {
        vehicules.forEach(function (vehicules) {
            creerAuto(vehicules);
        })
    })
    //Attraper et gérer et gerer les erreurs
    .catch(function (erreur) {
        $('.alert').text(erreur.message).removeClass('d-none');
    });

/*
 * soumission du formulaire
 */
$('form').submit(function (event) {
    /*
    *pour la validation du modele qui doit etre identique a l'autonomie
    * si le modele n'est pas identique a l'autonomie, le message d'erreur est lancé
    * nous utilisons la class CSS d-none pour masquer l'alerte
     */
    let modele=$("#modele").val();
    let autonomie=$("#autonomie").val();
    $('p.alert').addClass('d-none');
    const msg=$('#autonomie + p.alert');
    if (!modele.includes(autonomie)){
        msg.text('le modele doit être identique au code autonomie').removeClass('d-none');
        return false;
    }
    //envoi des donnees du formulaire au serveur avec la methode POST de Jquery
    $.post('https://6610503f0640280f219cd0f9.mockapi.io/stockVoitures', {
        identifiant: $('#ident').val(),
        marque: $('#marque').val(),
        modele: $('#modele').val(),
        annee: $('#annee').val(),
        prix: $('#prix').val(),
        autonomie: $('#autonomie').val(),
        couleur: $('#couleur').val(),
        image: $('#urlImage').val()
    }).then(function (data) {
        //ajouter des éléments sur la carte
        $('.auto').append(`
<div class="card w-50">
<img src="${data.image}" class="d-block w-100"  alt="...">
<div class="card-body">
        <h5 class="card-title">${data.marque}</h5>
        <p class="card-text">${data.id}</p>
    </div>
    <ul class="list-group list-group-flush">
        <li class="list-group-item">${data.modele}</li>
        <li class="list-group-item">${data.annee}</li>
        <li class="list-group-item">${data.autonomie}</li>
        <li class="list-group-item">${data.prix}<span>$</span></li>
        <div class="card-text">
        <div>
            <label for="heros-${data.id}">Couleur</label>
            <input type="color" value="${data.couleur}" id="heros-${data.id}">
        </div>
        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
     <button href="#" class="btn btn-primary btn-sm" onclick="supprimer(${data.id})">supprimer</button>
     </div>
    </ul>
</div>
`);
        /*
        *Stocker les données dans le navigateur en utilisant la methode setItem
        * données stockées dans 'voitures' et converti en Json avec la meth Json.Stringify
         */
        localStorage.setItem('voitures', JSON.stringify({
            identifiant: $('#ident').val(),
            marque: $('#marque').val(),
            modele: $('#modele').val(),
            annee: $('#annee').val(),
            prix: $('#prix').val(),
            autonomie: $('#autonomie').val(),
            couleur: $('#couleur').val(),
            image: $('#urlImage').val()
        }));
    })
//empecher le comportement par defaut du formulaire (le rechargement d ela page)
    event.preventDefault();
    //vider le formulaire
    $('form').trigger('reset');
})

function supprimer(id){
    fetch('https://6610503f0640280f219cd0f9.mockapi.io/stockVoitures/' +id, {
        method: 'DELETE',
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
        // handle error
    }).then(stockVoitures => {
        location.reload();
        // Do something with deleted task
    }).catch(error => {
        $('alert').text(erreur.message).removeClass('d-none');
        // handle error
    })
}