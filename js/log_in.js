function init () {
    logoMuve();
}

function toSignUp() {
    window.location.href = "./sign_up.html"
}

function logoMuve() {
    setTimeout(() => {
        document.getElementById('animation').style.display = "none";
        document.getElementById('logo').style.display = "block";
    }, 1500);
}