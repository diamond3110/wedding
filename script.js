const card = document.getElementById("invitationCard");
const openButton = document.getElementById("openInvitation");
const closeButton = document.getElementById("closeInvitation");
const invitationSide = document.getElementById("invitation");

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
    document.getElementById("guestName").textContent = `Дорогие ${quest[id]}`;
}

openButton.addEventListener("click", () => {
    card.classList.add("is-flipped");
});

closeButton.addEventListener("click", () => {
    card.classList.remove("is-flipped");
    // Возвращаем скролл обратной стороны наверх после завершения анимации
    setTimeout(() => {
        invitationSide.scrollTop = 0;
    }, 900);
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


// ЛОГИКА ДВИЖЕНИЯ СЕРДЕЧКА ПО ВОЛНЕ ПРИ СКРОЛЛЕ
const timelineContainer = document.getElementById("timelineContainer");
const wavePath = document.getElementById("wavePath");
const timelineHeart = document.getElementById("timelineHeart");
const timelineSvg = document.querySelector(".timeline-svg");

if (wavePath && timelineContainer && timelineHeart) {
    const pathLength = wavePath.getTotalLength();

    // Настраиваем линию так, чтобы она постепенно «рисовалась» за сердечком
    wavePath.style.strokeDasharray = pathLength;
    wavePath.style.strokeDashoffset = pathLength;

    function updateHeartOnScroll() {
        const containerRect = timelineContainer.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // Точка на экране, где находится фокус взгляда (60% высоты экрана)
        const triggerPoint = windowHeight * 0.6;

        // Вычисляем прогресс прокрутки от 0 до 1
        let progress = (triggerPoint - containerRect.top) / containerRect.height;
        progress = Math.max(0, Math.min(1, progress));

        // Находим координаты точки на SVG-кривой
        const currentLength = progress * pathLength;
        const point = wavePath.getPointAtLength(currentLength);

        // Переводим координаты SVG (viewBox 200x600) в реальные пиксели на экране
        const svgWidth = timelineSvg.clientWidth;
        const svgHeight = timelineSvg.clientHeight;
        const offsetX = (point.x - 100) * (svgWidth / 200);
        const offsetY = point.y * (svgHeight / 600);

        // Перемещаем сердечко и закрашиваем пройденную часть волны
        timelineHeart.style.left = `calc(50% + ${offsetX}px)`;
        timelineHeart.style.top = `${offsetY}px`;
        wavePath.style.strokeDashoffset = pathLength - currentLength;
    }

    // Слушаем скролл обратной стороны открытки и изменение размера окна
    invitationSide.addEventListener("scroll", updateHeartOnScroll);
    window.addEventListener("resize", updateHeartOnScroll);

    // Обновляем позицию сразу при открытии приглашения
    openButton.addEventListener("click", () => {
        setTimeout(updateHeartOnScroll, 100);
    });

    updateHeartOnScroll();
}

// ЛОГИКА ФОРМЫ ПОДТВЕРЖДЕНИЯ (RSVP) С ОТПРАВКОЙ В TELEGRAM
const rsvpForm = document.getElementById("rsvpForm");
const rsvpGuestInput = document.getElementById("rsvpGuest");
const rsvpSuccess = document.getElementById("rsvpSuccess");
const submitRsvpBtn = document.getElementById("submitRsvpBtn");

// Автозаполнение имени гостя из ссылки ?quest=...
if (id && quest[id] && rsvpGuestInput) {
    rsvpGuestInput.value = quest[id];
}

// НАСТРОЙКИ TELEGRAM БОТА (вставьте свои данные)
const TELEGRAM_BOT_TOKEN = "9128114649:AAFw5YeoH8nvAeXOgUbudIvjyQbU9oVkSrY";
const TELEGRAM_CHAT_ID = "1103193768";

if (rsvpForm) {
    rsvpForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const guest = rsvpGuestInput.value.trim();
        const attendance = rsvpForm.querySelector('input[name="attendance"]:checked').value;
        const comment = document.getElementById("rsvpComment").value.trim() || "Без комментариев";

        // Формируем красивое сообщение для Telegram
        const message = 
            `💍 <b>Новый ответ на приглашение!</b>\n\n` +
            `👤 <b>Гости:</b> ${guest}\n` +
            `✅ <b>Статус:</b> ${attendance}\n` +
            `💬 <b>Комментарий:</b> ${comment}`;

        submitRsvpBtn.disabled = true;
        submitRsvpBtn.textContent = "Отправка...";

                try {
            const response = await fetch(`https://telegram.org{TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: message,
                    parse_mode: "HTML"
                })
            });

            if (response.ok) {
                rsvpForm.classList.add("hidden");
                rsvpSuccess.classList.remove("hidden");
            } else {
                throw new Error("Ошибка Telegram API");
            }
        } catch (error) {
            alert("Не удалось отправить ответ. Проверьте интернет или напишите нам лично." + error.message);
            submitRsvpBtn.disabled = false;
            submitRsvpBtn.textContent = "Отправить ответ";
        }
    });
}
