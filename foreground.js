// création de la fenêtre de dialogue
const main_containter = document.createElement("DIV");
main_containter.classList.add("main_container");

const titre = document.createElement("DIV");
titre.classList.add("titre");
titre.innerHTML = "Charger image";

const button_load_wrapper = document.createElement("div");
const button_load_image = document.createElement("button");
const input = document.createElement("input");

button_load_wrapper.classList.add("button_load_wrapper");
button_load_image.classList.add("button_load_image");
button_load_image.innerHTML = "+";
input.id = "input_load_image";
input.setAttribute("type", "file");
input.setAttribute("accept", "image/*");

// add button and input to wrapper
button_load_wrapper.appendChild(button_load_image);
button_load_wrapper.appendChild(input);

const image = document.createElement("IMG");
image.classList.add("image");

const input_point1 = document.createElement("button");
const input_point2 = document.createElement("button");
input_point1.classList.add("input_point");
input_point2.classList.add("input_point");
// Add the same logic here
input_point1.innerHTML = "Set point 1";
input_point2.innerHTML = "Set point 2";

const buttonPeindre = document.createElement("DIV");
// add id to button
// disable button
// document.getElementById("myBtn").disabled = true;
buttonPeindre.classList.add("button_peindre");
buttonPeindre.innerHTML = "Peindre l'image";

const statutTxt = document.createElement("DIV");
statutTxt.classList.add("status_txt");
statutTxt.innerHTML = "Statut :";

const statutValue = document.createElement("DIV");
statutValue.classList.add("status_value");
statutValue.innerHTML = "En attente";

main_containter.appendChild(titre);
main_containter.appendChild(button_load_wrapper);
main_containter.appendChild(image);
main_containter.appendChild(input_point1);
main_containter.appendChild(input_point2);
main_containter.appendChild(buttonPeindre);
main_containter.appendChild(statutTxt);
main_containter.appendChild(statutValue);

// ajout de la fenêtre de dialogue au DOM
document.body.appendChild(main_containter);

// écouteur sur input
input.addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = () => {
    image.setAttribute("src", reader.result);
  };
  reader.readAsDataURL(file);
});

const point1 = {
  x: 0,
  y: 0,
};
const point2 = {
  x: 0,
  y: 0,
};

/**
 * On écoute le click sur le bouton de saisie,
 * si click alors on écoute les mouse event
 * => une fois la position obtenue oin l'affecte à point1
 * => L'event ne se joue qu'une fois grâce au {once : true}
 */
input_point1.addEventListener("click", () => {
  statutValue.innerHTML = "Point 1 : en attente.\n Cliquez pour valider.";
  document.addEventListener(
    "mouseup",
    (e) => {
      if (e.button === 1 || e.button === 2) {
        point1.x = e.clientX;
        point1.y = e.clientY + 103;
        e.stopPropagation();

        if (point1.x !== 0 || point1.y !== 0) {
          statutValue.innerHTML = "Point 1 défini";
        }
      }
    },
    { once: true }
  );
});

input_point2.addEventListener("click", () => {
  statutValue.innerHTML = "Point 2 : en attente.\n Cliquez pour valider.";
  document.addEventListener(
    "mouseup",
    (e) => {
      if (e.button === 1 || e.button === 2) {
        point2.x = e.clientX;
        point2.y = e.clientY + 103;
        e.stopPropagation();

        if (point2.x !== 0 || point2.y !== 0) {
          statutValue.innerHTML = "Point 2 défini";
          // document.getElementById("myBtn").disabled = false;
        }
      }
    },
    { once: true }
  );
});

buttonPeindre.addEventListener("click", () => {
  

  if (point1.x != 0 && point1.y != 0 && point2.x != 0 && point2.y != 0) {
    statutValue.innerHTML = "Envoi de l'image...";



    const formData = new FormData();

    formData.append("image", image.src);
    formData.append("x1", point1.x);
    formData.append("y1", point1.y);
    formData.append("x2", point2.x);
    formData.append("y2", point2.y);


    fetch("https://localhost:5000/images", {
      method: "POST",
      // headers: { "Content-Type": "application/json" },
      body: formData,
    }).then((response) => {
      if (response.status === 200) {
        response.json().then((data) => {
          console.log(data);
        });
      }
    });


    /**
     * reset points
     * disable btn point 2 + btn peindre
     */
  }
});



// chrome.runtime.sendMessage(
//   {
//     message: "peindre_image",
//     // payload: [image.getAttribute("src"), point1, point2],
//     payload: "bonjour",
//   },
//   (response) => {
//     if (response) {
//       if (response.message === "image_peinte") {
//         statutValue.innerHTML = "Image peinte";
//       } else {
//         statutValue.innerHTML = "Erreur";
//       }
//     }
//   }
// );

// // écouteur sur le bouton
// chrome.runtime.sendMessage({
//     message: "get_name"
// }, response => {
//     if (response.message === 'success') {
//         ce_name.innerHTML = `Hello ${response.payload}`;
//     }
// });

// // écouteur sur le changement de nom
// input.addEventListener('click', () => {
//     chrome.runtime.sendMessage({
//         message: "change_name",
//         payload: input.value
//     }, response => {
//         if (response.message === 'success') {
//             ce_name.innerHTML = `Hello ${ce_input.value}`;
//         }
//     });
// });
