console.log("script loaded");
const button = document.getElementById("openInvitation");
const invitation = document.getElementById("invitation");
const params = new URLSearchParams(window.location.search);

const id = params.get("quests");
const quests = {
    1: "Валерий и Оксана Каража",
    2: "Сергей и Юлия Лазаревы",
    3: "Валентина и Иван Киорогло",
    4: "Виталий и Виктория Киорогло",
    5: "Александр и Людмила Каража",
    6: "Тит и Ксения Лазаревы",
    7: "Иван и Мария Самси",
    8: "Олег и Татьяна Волковы",
    9: "Иван и Наталья Каража"
};

if (id && quests[id]) {
    document.getElementById("guestName").textContent =
        `Дорогие ${quests[id]}`;
}
button.addEventListener("click", () => {

    invitation.classList.remove("hidden");

    invitation.scrollIntoView({
        behavior: "smooth"
    });

});