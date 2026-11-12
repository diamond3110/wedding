const button = document.getElementById("openInvitation");
const invitation = document.getElementById("invitation");

button.addEventListener("click", () => {

    invitation.classList.remove("hidden");

    invitation.scrollIntoView({
        behavior: "smooth"
    });

});