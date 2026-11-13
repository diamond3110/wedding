const card = document.getElementById("invitationCard");
const openButton = document.getElementById("openInvitation");
const closeButton = document.getElementById("closeInvitation");
const invitationSide = document.getElementById("invitation");

document.addEventListener('DOMContentLoaded', () => {
    // Ваш список гостей (сортируется автоматически)
    const guestsList = [
        "Валерий и Оксана Каража",
        "Сергей и Юлия Лазаревы",
        "Валентина и Иван Киорогло",
        "Виталий и Виктория Киорогло",
        "Александр и Людмила Каража",
        "Тит и Ксения Лазаревы",
        "Иван и Мария Самси",
        "Олег и Татьяна Волковы",
        "Иван и Наталья Каража"
    ];

    const customSelect = document.getElementById('custom-guest-select');
    const trigger = document.getElementById('select-trigger');
    const optionsContainer = document.getElementById('select-options');
    const hiddenInput = document.getElementById('guest-name-input');

    if (customSelect && trigger && optionsContainer && hiddenInput) {
        const placeholder = trigger.querySelector('.select-placeholder');
        
        // 1. Сортируем по алфавиту
        const sortedGuests = [...guestsList].sort((a, b) => a.localeCompare(b, 'ru'));

        // 2. Создаем красивые пункты меню
        sortedGuests.forEach(guest => {
            const optionEl = document.createElement('div');
            optionEl.classList.add('select-option');
            optionEl.textContent = guest;

            // Выбор гостя при клике
            optionEl.addEventListener('click', () => {
                placeholder.textContent = guest;
                hiddenInput.value = guest;
                trigger.classList.add('has-value');
                trigger.style.borderColor = '#e2d5c8'; // Убираем красную обводку, если была ошибка

                // Выделяем выбранный пункт
                optionsContainer.querySelectorAll('.select-option').forEach(el => el.classList.remove('selected'));
                optionEl.classList.add('selected');

                customSelect.classList.remove('open');
            });

            optionsContainer.appendChild(optionEl);
        });

        // 3. Открытие / закрытие при клике на поле
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            customSelect.classList.toggle('open');
        });

        // 4. Закрытие при клике в любое другое место страницы
        document.addEventListener('click', (e) => {
            if (!customSelect.contains(e.target)) {
                customSelect.classList.remove('open');
            }
        });
    }
});

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

document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('bg-music');
    const muteBtn = document.getElementById('mute-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const iconOn = document.getElementById('icon-sound-on');
    const iconOff = document.getElementById('icon-sound-off');

    let lastVolume = 0.5; // Запоминаем громкость до выключения
    audio.volume = lastVolume;

    // Функция обновления иконки
    function updateIcon(volume) {
        if (volume === 0 || audio.paused) {
            iconOn.style.display = 'none';
            iconOff.style.display = 'block';
        } else {
            iconOn.style.display = 'block';
            iconOff.style.display = 'none';
        }
    }

    // Изначально ставим иконку "выключено", пока музыка не запущена
    updateIcon(0);

    // Клик по кнопке звука (вкл/выкл)
    muteBtn.addEventListener('click', () => {
        if (audio.paused) {
            // Если музыка еще не играла — запускаем
            audio.play().catch(e => console.log("Нужно взаимодействие пользователя:", e));
            audio.volume = lastVolume > 0 ? lastVolume : 0.5;
            volumeSlider.value = audio.volume;
        } else if (audio.volume > 0) {
            // Если звук есть — выключаем (mute)
            lastVolume = audio.volume;
            audio.volume = 0;
            volumeSlider.value = 0;
        } else {
            // Если звук был на 0 — возвращаем прошлую громкость
            audio.volume = lastVolume > 0 ? lastVolume : 0.5;
            volumeSlider.value = audio.volume;
        }
        updateIcon(audio.volume);
    });

    // Перетаскивание ползунка
    volumeSlider.addEventListener('input', (e) => {
        const newVolume = parseFloat(e.target.value);
        
        // Если пользователь начал двигать ползунок, а музыка еще на паузе — запускаем её
        if (audio.paused && newVolume > 0) {
            audio.play().catch(e => console.log("Ошибка запуска:", e));
        }

        audio.volume = newVolume;
        if (newVolume > 0) {
            lastVolume = newVolume;
        }
        updateIcon(newVolume);
    });
});
