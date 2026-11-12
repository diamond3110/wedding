console.log("script loaded");
const button = document.getElementById("openInvitation");
const invitation = document.getElementById("invitation");
const params = new URLSearchParams(window.location.search);

const id = params.get("quest");
const quest = {
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

if (id && quest[id]) {
    document.getElementById("guestName").textContent =
        `Дорогие ${quest[id]}`;
}

button.addEventListener("click", () => {

    invitation.classList.toggle("hidden");

    if (!invitation.classList.contains("hidden")) {

        invitation.scrollIntoView({
            behavior: "smooth"
        });

        button.textContent = "Закрыть приглашение";

    } else {

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

        button.textContent = "Открыть приглашение";
    }
});

function updateCountdown() {

    const weddingDate = new Date("2027-07-18T16:00:00");

    const now = new Date();

    const difference = weddingDate - now;

    if (difference <= 0) {
        return;
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));

    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    const format = value => String(value).padStart(2, "0");
    document.getElementById("days").textContent = days;
    document.getElementById("hours").textContent = format(hours);
    document.getElementById("minutes").textContent = format(minutes);
    document.getElementById("seconds").textContent = format(seconds);
}

updateCountdown();

setInterval(updateCountdown, 1000);