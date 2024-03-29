// Créer les éléments
var container = document.createElement("div");
container.style.borderRadius = "10px";
container.style.position = "absolute";
container.style.width = "20%";
container.style.height = "50%";
container.style.border = "1px solid black";
container.style.backgroundColor = "white";
container.style.top = "10px";
container.style.left = "10px";
// Mettre au premier plan
container.style.zIndex = "9999";

var label = document.createElement("label");
label.innerText = "Charger une image";
label.style.position = "absolute";
label.style.top = "10px";
label.style.left = "10px";

var loadButton = document.createElement("button");
loadButton.innerText = "Charger une image";
loadButton.style.position = "absolute";
loadButton.style.top = "40px";
loadButton.style.left = "10px";

var imageContainer = document.createElement("div");
imageContainer.style.position = "absolute";
imageContainer.style.top = "80px";
imageContainer.style.left = "10px";
imageContainer.style.width = "90%";
imageContainer.style.height = "40%";
imageContainer.style.border = "1px solid black";
imageContainer.style.backgroundSize = "contain";
imageContainer.style.backgroundRepeat = "no-repeat";
imageContainer.style.backgroundPosition = "center";

var waitButton1 = document.createElement("button");
waitButton1.innerText = "Attendre l'entrée utilisateur";
waitButton1.style.position = "absolute";
waitButton1.style.top = "60%";
waitButton1.style.left = "10px";

var waitButton2 = document.createElement("button");
waitButton2.innerText = "Attendre l'entrée utilisateur 2";
waitButton2.style.position = "absolute";
waitButton2.style.top = "65%";
waitButton2.style.left = "10px";

var sendButton = document.createElement("button");
sendButton.innerText = "Envoyer l'image et la position de la souris";
sendButton.style.position = "absolute";
sendButton.style.top = "70%";
sendButton.style.left = "10px";
sendButton.style.width = "90%";

var statusLabel = document.createElement("label");
statusLabel.innerText = "En attente de l'entrée utilisateur";
statusLabel.style.position = "absolute";
statusLabel.style.top = "80%";
statusLabel.style.left = "10px";
statusLabel.style.width = "90%";

// create slider for brush size (1 to 5)
var slider = document.createElement("input");
slider.type = "range";
slider.min = 1;
slider.max = 5;
slider.value = 1;
slider.style.position = "absolute";
slider.style.top = "90%";
slider.style.left = "10px";
slider.style.width = "90%";
slider.style.height = "10%";

// show brush size
var brushSize = document.createElement("label");
brushSize.innerText = "Taille du pinceau : " + slider.value;
brushSize.style.position = "absolute";
brushSize.style.top = "85%";
brushSize.style.left = "10px";
brushSize.style.width = "90%";
brushSize.style.height = "10%";
slider.oninput = function () {
  brushSize.innerText = "Taille du pinceau : " + this.value;
};


// Ajouter les éléments au conteneur
container.appendChild(label);
container.appendChild(loadButton);
container.appendChild(imageContainer);
container.appendChild(waitButton1);
container.appendChild(waitButton2);
container.appendChild(sendButton);
container.appendChild(statusLabel);
container.appendChild(slider);
container.appendChild(brushSize);

// Ajouter le conteneur à la page
document.body.appendChild(container);

var mousePosition = { x: 0, y: 0 };

const point1 = {
  x: 0,
  y: 0,
};
const point2 = {
  x: 0,
  y: 0,
};

document.addEventListener("mousemove", function (mouseMoveEvent) {
  mousePosition.x = mouseMoveEvent.pageX;
  mousePosition.y = mouseMoveEvent.pageY + 103;
});

function setPoint1(event) {
  if (event.code === "Space") {
    point1.x = mousePosition.x;
    point1.y = mousePosition.y;

    statusLabel.innerText =
      "Position de la souris : X=" +
      mousePosition.x +
      ", Y=" +
      mousePosition.y;
  }
}

function setPoint2(event) {
  if (event.code === "Space") {
    point2.x = mousePosition.x;
    point2.y = mousePosition.y;

    statusLabel.innerText =
      "Position de la souris : X=" +
      mousePosition.x +
      ", Y=" +
      mousePosition.y;

  }
}

// Gérer le comportement du bouton "Attendre l'entrée utilisateur"
waitButton1.addEventListener("click", function () {
  statusLabel.innerText = "En attente de l'appui sur la touche Espace";

  document.removeEventListener("keydown", setPoint2);
  document.addEventListener("keydown", setPoint1);
}, {
  once: true
}
);

// Gérer le comportement du bouton "Attendre l'entrée utilisateur"
waitButton2.addEventListener("click", function () {
  statusLabel.innerText = "En attente de l'appui sur la touche Espace";

  document.removeEventListener("keydown", setPoint1);
  document.addEventListener("keydown", setPoint2);
}, {
  once: true
});

// Convertir une image en base64
function convertImageToBase64(url) {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = function () {
      var canvas = document.createElement("CANVAS");
      var ctx = canvas.getContext("2d");
      var dataURL;
      canvas.height = this.naturalHeight;
      canvas.width = this.naturalWidth;
      ctx.drawImage(this, 0, 0);
      dataURL = canvas.toDataURL("image/png");
      resolve(dataURL);
    };
    img.src = url;
  });
}

// Gérer le comportement du bouton "Envoyer l'image et la position de la souris"
sendButton.addEventListener("click", async function () {
  statusLabel.innerText = "Envoi des données en cours...";

  var imageURL = imageContainer.style.backgroundImage.slice(5, -2); // Get the URL from the backgroundImage property

  var imageBase64 = await convertImageToBase64(imageURL);

  const formData = new FormData();

  formData.append("image", imageBase64);
  formData.append("x1", point1.x);
  formData.append("y1", point1.y);
  formData.append("x2", point2.x);
  formData.append("y2", point2.y);
  formData.append("pas", slider.value);

  fetch("https://127.0.0.1:5000/images", {
    method: "POST",
    body: formData,
  })
    .then(function (response) {
      statusLabel.innerText = "Données envoyées avec succès";
    })
    .catch(function (error) {
      statusLabel.innerText = "Erreur lors de l'envoi des données";
    });
});

// Gérer le comportement du bouton "Charger une image"
loadButton.addEventListener("click", function () {
  // Afficher une boîte de dialogue pour choisir un fichier
  var input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = function (event) {
    var file = event.target.files[0];
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      imageContainer.style.backgroundImage = "url(" + reader.result + ")";
    };
  }
  input.click();
});
