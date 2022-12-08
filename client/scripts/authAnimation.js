var card = document.getElementById("card");
function openRegister() {
    card.style.transform = "rotateY(-180deg)";
}

function openLogIn() {
    card.style.transform = "rotateY(0deg)";
    card.style.height = "50";
    console.log("yo");
}