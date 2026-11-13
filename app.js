const CONFIG = {
  // Оставил финальное сообщение максимально близким к первоначальному варианту.
  finalMessage: `Милая моя Яночка,\n\nЯ хотел бы кое-что тебе сказать:\nты делаешь мои дни теплее просто тем, что ты есть. Спасибо за смех, за комфорт и за то, что рядом с тобой хочется быть собой.\nПожалуйста, не плачь никогда, разве что только от счастья, смеха или радости! Я буду стараться делать все, чтобы это было именно так.\n\nОбожаю тебя 💖`,
};

const stageIds = [
  "stage-intro",
  "stage-quiz-1",
  "stage-quiz-2",
  "stage-rain",
  "stage-soundtrack",
  "stage-supernatural",
  "stage-finale",
];

const stages = stageIds.map((id) => document.getElementById(id));
const progressFill = document.getElementById("progress-fill");
const progressCount = document.getElementById("progress-count");

function showStage(id) {
  const index = stageIds.indexOf(id);
  if (index < 0) return;

  stages.forEach((stage) => {
    const active = stage.id === id;
    stage.classList.toggle("active", active);
    stage.setAttribute("aria-hidden", String(!active));
  });

  progressFill.style.width = `${((index + 1) / stageIds.length) * 100}%`;
  progressCount.textContent = `${String(index + 1).padStart(2, "0")} / ${String(stageIds.length).padStart(2, "0")}`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Звёзды — мягкое движение на общем фоне.
(function createStars() {
  const container = document.getElementById("stars");
  if (!container) return;
  const symbols = ["✦", "·", "✧", "⋆"];
  for (let i = 0; i < 34; i += 1) {
    const star = document.createElement("span");
    star.className = "star";
    star.textContent = symbols[i % symbols.length];
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    star.style.fontSize = `${7 + Math.random() * 9}px`;
    star.style.setProperty("--duration", `${3.5 + Math.random() * 5}s`);
    star.style.setProperty("--delay", `${Math.random() * 5}s`);
    container.appendChild(star);
  }
})();

// Отдельные капли: не зависят от прокрутки и не перехватывают касания.
(function createRain() {
  const container = document.getElementById("rain-drops");
  if (!container) return;
  const count = window.matchMedia("(max-width: 560px)").matches ? 42 : 64;
  for (let i = 0; i < count; i += 1) {
    const drop = document.createElement("span");
    drop.className = "rain-drop";
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.setProperty("--fall-time", `${0.72 + Math.random() * 0.8}s`);
    drop.style.setProperty("--fall-delay", `${Math.random() * 2.5}s`);
    drop.style.setProperty("--fall-height", `${70 + Math.random() * 80}px`);
    container.appendChild(drop);
  }
})();

// Первый экран.
document.getElementById("btn-yes").addEventListener("click", () => {
  showStage("stage-quiz-1");
});

// Логика убегающей кнопки: мышь и касание обрабатываются раздельно.
const noBtn = document.getElementById("btn-no");
const noBtnZone = document.getElementById("no-btn-zone");
const noCaption = document.getElementById("no-caption");
let noAttempts = 0;
let noButtonTimer = 0;

function moveNoButton(pointerType = "mouse", pointerEvent = null) {
  const zone = noBtnZone.getBoundingClientRect();
  const button = noBtn.getBoundingClientRect();
  const padding = 8;
  const topPadding = 31;
  const maxLeft = Math.max(padding, zone.width - button.width - padding);
  const maxTop = Math.max(topPadding, zone.height - button.height - padding);
  const availableX = Math.max(0, maxLeft - padding);
  const availableY = Math.max(0, maxTop - topPadding);

  // Не ставим кнопку ровно под предыдущим положением — иначе кажется, что она не сдвинулась.
  let left = padding + Math.random() * availableX;
  let top = topPadding + Math.random() * availableY;
  const currentLeft = Number.parseFloat(noBtn.style.left) || zone.width * 0.52;
  const currentTop = Number.parseFloat(noBtn.style.top) || topPadding;
  const pointerX = pointerEvent ? pointerEvent.clientX - zone.left : Number.NaN;
  const pointerY = pointerEvent ? pointerEvent.clientY - zone.top : Number.NaN;

  // Для мыши и пальца стараемся не оставлять кнопку под самой точкой касания.
  if (Number.isFinite(pointerX) && Number.isFinite(pointerY)) {
    const escapeDistance = Math.min(105, Math.max(58, Math.min(zone.width, zone.height) * 0.42));
    for (let attempt = 0; attempt < 14; attempt += 1) {
      const centerX = left + button.width / 2;
      const centerY = top + button.height / 2;
      if (Math.hypot(centerX - pointerX, centerY - pointerY) >= escapeDistance) break;
      left = padding + Math.random() * availableX;
      top = topPadding + Math.random() * availableY;
    }
  }
  if (availableX > 65 && Math.abs(left - currentLeft) < 55) left = (left + availableX * 0.63) % maxLeft;
  if (availableY > 12 && Math.abs(top - currentTop) < 18) top = top < topPadding + availableY / 2 ? topPadding + availableY : topPadding;

  noBtn.style.left = `${Math.min(maxLeft, Math.max(padding, left))}px`;
  noBtn.style.top = `${Math.min(maxTop, Math.max(topPadding, top))}px`;
  noBtn.classList.remove("button-dodge");
  // Перезапуск короткой анимации перемещения.
  void noBtn.offsetWidth;
  noBtn.classList.add("button-dodge");

  noAttempts += 1;
  if (noAttempts === 1) {
    noCaption.textContent = pointerType === "touch" ? "ловкость пальцев пригодится 👀" : "она, кажется, не хочет нажиматься";
  } else if (noAttempts >= 4) {
    noCaption.textContent = "кажется, у неё свои планы 😼";
  }
  window.clearTimeout(noButtonTimer);
  noButtonTimer = window.setTimeout(() => noBtn.classList.remove("button-dodge"), 260);
}

noBtn.addEventListener("pointerenter", (event) => {
  if (event.pointerType === "mouse") moveNoButton("mouse", event);
});
noBtn.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "touch" || event.pointerType === "pen") {
    event.preventDefault();
    moveNoButton("touch", event);
  }
});
noBtn.addEventListener("click", (event) => {
  event.preventDefault();
  moveNoButton(event.pointerType || "mouse", event);
});

// Первый вопрос.
const q1Wrong = document.getElementById("q1-wrong-msg");
document.querySelectorAll("[data-q1]").forEach((button) => {
  button.addEventListener("click", () => {
    const answer = button.dataset.q1;
    if (answer === "you") {
      q1Wrong.textContent = "Именно. Тут даже спорить не о чем. ♥";
      q1Wrong.style.color = "var(--gold)";
      document.querySelectorAll("[data-q1]").forEach((choice) => { choice.disabled = true; });
      window.setTimeout(() => showStage("stage-quiz-2"), 650);
      return;
    }

    q1Wrong.style.color = "var(--rose-bright)";
    q1Wrong.textContent = answer === "pizza"
      ? "Пиццу я тоже уважаю. Но всё-таки попробуй ещё раз."
      : "Сон важен, спору нет. Но ответ немного ближе. ♥";
  });
});

// Второй вопрос. Любой ответ верен — подсказка повторяет именно выбранную фразу.
const q2Hints = {
  same: "В точку. Мы и правда всегда мыслим одинаково.",
  chaos: "В точку. Два котика, один общий хаос — это уже почти официальное название.",
  cold: "В точку. Вечно мёрзнем — зато хотя бы не по одному.",
};
const q2Hint = document.getElementById("q2-hint");
document.querySelectorAll("[data-q2]").forEach((button) => {
  button.addEventListener("click", () => {
    if (!q2Hint.hidden) return;
    document.querySelectorAll("[data-q2]").forEach((choice) => {
      choice.disabled = true;
      choice.classList.add("choice-muted");
    });
    document.getElementById("q2-hint-text").textContent = q2Hints[button.dataset.q2] || q2Hints.same;
    q2Hint.hidden = false;
  });
});

document.getElementById("to-rain").addEventListener("click", () => showStage("stage-rain"));

// Дождь: зонтик меняет интенсивность дождя и открывает небольшую фразу.
const rainScene = document.getElementById("rain-scene");
const umbrellaButton = document.getElementById("umbrella-button");
const umbrellaMessage = document.getElementById("umbrella-message");
umbrellaButton.addEventListener("click", () => {
  const sheltered = rainScene.classList.toggle("sheltered");
  umbrellaButton.setAttribute("aria-pressed", String(sheltered));
  umbrellaButton.innerHTML = sheltered
    ? "<span>☂</span> Зонтик открыт"
    : "<span>☂</span> Укрыться от дождя вместе";
  umbrellaMessage.hidden = !sheltered;
});

// Котята реагируют на касание — каждый со своим коротким сообщением.
const kittenNote = document.getElementById("kitten-note");
document.getElementById("kitten-dark").addEventListener("click", () => {
  kittenNote.textContent = "Нокс одобряет этот вечер. Но гладить его нужно очень аккуратно. 🐾";
  kittenNote.classList.remove("kitten-note-pop");
  void kittenNote.offsetWidth;
  kittenNote.classList.add("kitten-note-pop");
});
document.getElementById("kitten-light").addEventListener("click", () => {
  kittenNote.textContent = "Луна уже устроилась рядом. Кажется, она решила, что прогулка удалась. 🐾";
  kittenNote.classList.remove("kitten-note-pop");
  void kittenNote.offsetWidth;
  kittenNote.classList.add("kitten-note-pop");
});

document.getElementById("to-soundtrack").addEventListener("click", () => showStage("stage-soundtrack"));
document.getElementById("to-supernatural").addEventListener("click", () => showStage("stage-supernatural"));

// Локальный саундтрек. Файлы пользователь добавит в assets/music/.
// Один audio-элемент переключает треки; позиция каждого сохраняется отдельно.
const audio = document.getElementById("story-audio");
const trackFiles = {
  lonely: "assets/music/lonely-day.mp3",
  sisyphus: "assets/music/andrew-bird-sisyphus.mp3",
  rose: "assets/music/dead-confederate-it-was-a-rose.mp3",
  dylan: "assets/music/bob-dylan-knockin-on-heavens-door.mp3",
  gnr: "assets/music/guns-n-roses-knockin-on-heavens-door.mp3",
  kansas: "assets/music/kansas-carry-on-wayward-son.mp3",
};
const trackTitles = {
  lonely: "SOAD — Lonely Day",
  sisyphus: "Andrew Bird — Sisyphus",
  rose: "Dead Confederate — It Was a Rose",
  dylan: "Bob Dylan — Knockin’ on Heaven’s Door",
  gnr: "Guns N’ Roses — Knockin’ on Heaven’s Door",
  kansas: "Kansas — Carry On Wayward Son",
};
const positions = {};
const storageKey = "yana-story-audio-positions-v1";
let currentTrack = "lonely";
let pendingTrack = "lonely";
let audioUnlocked = false;
let switchingTrack = false;

try {
  Object.assign(positions, JSON.parse(localStorage.getItem(storageKey) || "{}"));
} catch {
  // Если localStorage недоступен, позиции всё равно хранятся в памяти до закрытия страницы.
}

function persistPositions() {
  try { localStorage.setItem(storageKey, JSON.stringify(positions)); } catch { /* private mode */ }
}

function rememberPosition() {
  if (!audio.src || !Number.isFinite(audio.currentTime)) return;
  positions[currentTrack] = audio.currentTime;
  persistPositions();
}

audio.addEventListener("timeupdate", () => { if (!switchingTrack) rememberPosition(); });
audio.addEventListener("pause", () => { if (!switchingTrack) rememberPosition(); });

function markPlayingTrack(track) {
  document.querySelectorAll("[data-track]").forEach((button) => {
    const active = button.dataset.track === track && track !== "lonely";
    button.classList.toggle("is-playing", active);
    button.setAttribute("aria-pressed", String(active));
  });
  const status = document.getElementById("audio-status");
  if (status) status.textContent = `♫ ${trackTitles[track] || trackTitles.lonely}`;
}

async function loadAndPlay(track, { resume = true } = {}) {
  if (!trackFiles[track]) return;
  pendingTrack = track;
  if (currentTrack !== track || !audio.src.endsWith(trackFiles[track])) {
    rememberPosition();
    switchingTrack = true;
    currentTrack = track;
    audio.onloadedmetadata = () => {
      if (currentTrack !== track) return;
      if (resume) {
        const saved = Number(positions[track] || 0);
        if (Number.isFinite(saved) && saved > 0 && saved < audio.duration) audio.currentTime = saved;
      }
      switchingTrack = false;
      audio.play().then(() => {
        audioUnlocked = true;
        markPlayingTrack(track);
      }).catch(() => {
        markPlayingTrack(null);
      });
    };
    audio.src = trackFiles[track];
    audio.load();
    return;
  }
  try {
    await audio.play();
    audioUnlocked = true;
    markPlayingTrack(track);
  } catch {
    markPlayingTrack(null);
  }
}

// Последовательная предварительная загрузка ресурсов музыкального этапа:
// 1) сначала Lonely Day (основной audio-элемент),
// 2) затем все обложки,
// 3) затем остальные аудиофайлы. Всё начинается на первом экране.
const preloadAudioElements = [];
let assetPreloadStarted = false;

function waitForAudioData(element, timeoutMs = 9000) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeout);
      element.removeEventListener("loadeddata", finish);
      element.removeEventListener("canplaythrough", finish);
      element.removeEventListener("error", finish);
      resolve();
    };
    const timeout = window.setTimeout(finish, timeoutMs);
    element.addEventListener("loadeddata", finish, { once: true });
    element.addEventListener("canplaythrough", finish, { once: true });
    element.addEventListener("error", finish, { once: true });
    // На случай, если данные успели загрузиться до установки обработчиков.
    if (element.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA || element.error) finish();
  });
}

function preloadCoverImages() {
  const images = Array.from(document.querySelectorAll(".cover-photo-button img"));
  images.forEach((image) => { image.loading = "eager"; });
  return Promise.all(images.map((image) => new Promise((resolve) => {
    const probe = new Image();
    probe.onload = async () => {
      try { if (probe.decode) await probe.decode(); } catch { /* изображение уже загружено */ }
      resolve();
    };
    probe.onerror = resolve;
    probe.src = image.currentSrc || image.src;
    if (probe.complete) resolve();
  })));
}

async function preloadRemainingTracks() {
  const tracks = Object.keys(trackFiles).filter((track) => track !== "lonely");
  for (const track of tracks) {
    const preloader = new Audio();
    preloader.preload = "auto";
    preloadAudioElements.push(preloader);
    preloader.src = trackFiles[track];
    const ready = waitForAudioData(preloader);
    preloader.load();
    await ready;
  }
}

async function preloadMusicStageAssets() {
  if (assetPreloadStarted) return;
  assetPreloadStarted = true;
  await preloadCoverImages();
  await preloadRemainingTracks();
}

// Браузер может запретить звук до первого жеста пользователя. Пробуем autoplay сразу,
// а при блокировке повторяем запуск после первого касания/клика по странице.
let initialTrackWaitTimer = 0;
const startNextPreloadStage = () => {
  window.clearTimeout(initialTrackWaitTimer);
  void preloadMusicStageAssets();
};
audio.addEventListener("canplaythrough", startNextPreloadStage, { once: true });
audio.addEventListener("error", startNextPreloadStage, { once: true });
// Если браузер не сообщает canplaythrough (такое бывает на мобильных),
// не блокируем загрузку обложек и остальных треков бесконечно.
initialTrackWaitTimer = window.setTimeout(startNextPreloadStage, 15000);
loadAndPlay("lonely");
document.addEventListener("pointerdown", () => {
  if (audioUnlocked || currentTrack !== "lonely" || !audio.paused) return;
  loadAndPlay(pendingTrack || "lonely");
}, { once: true, passive: true });
document.addEventListener("keydown", () => {
  if (audioUnlocked || currentTrack !== "lonely" || !audio.paused) return;
  loadAndPlay(pendingTrack || "lonely");
}, { once: true });

document.querySelectorAll("[data-track]").forEach((button) => {
  button.addEventListener("click", async () => {
    const selected = button.dataset.track;
    if (currentTrack === selected && !audio.paused) {
      // Повторное нажатие возвращает фоновый Lonely Day с сохранённой позиции.
      rememberPosition();
      await loadAndPlay("lonely");
      return;
    }
    await loadAndPlay(selected);
  });
});

audio.addEventListener("ended", () => {
  if (currentTrack !== "lonely") {
    positions[currentTrack] = 0;
    persistPositions();
    loadAndPlay("lonely", { resume: true });
  }
});

// Небольшая проверка для охотницы.
const hunterFeedback = document.getElementById("hunter-feedback");
const finaleButton = document.getElementById("to-finale");
document.querySelectorAll("[data-hunt]").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.dataset.hunt === "salt") {
      document.querySelectorAll("[data-hunt]").forEach((option) => {
        option.disabled = true;
        option.classList.toggle("correct", option === button);
      });
      hunterFeedback.textContent = "Верно. Соль — и можно продолжать путь. Винчестеры бы одобрили.";
      finaleButton.disabled = false;
    } else {
      hunterFeedback.textContent = button.dataset.hunt === "flowers"
        ? "Красиво, но призраки обычно не впечатляются букетами. Ещё попытка?"
        : "Wi-Fi полезен почти всегда, но в этом деле нужен другой инструмент.";
    }
  });
});

// Секретная заметка в сцене «Сверхъестественного».
const secretTrigger = document.getElementById("secret-trigger");
const secretMessage = document.getElementById("secret-message");
secretTrigger.addEventListener("click", () => {
  secretMessage.hidden = !secretMessage.hidden;
  secretTrigger.setAttribute("aria-expanded", String(!secretMessage.hidden));
});

finaleButton.addEventListener("click", () => showStage("stage-finale"));

// Конверт: клапан открывается первым, лист поднимается, затем появляется письмо.
let letterOpened = false;
let typingTimer = 0;
function typeWriter(element, text, speed = 27) {
  window.clearTimeout(typingTimer);
  element.textContent = "";
  element.classList.add("is-typing");
  const characters = Array.from(text); // Не разрываем эмодзи на половины суррогатной пары.
  let index = 0;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const footnote = document.getElementById("final-footnote");

  if (reducedMotion) {
    element.textContent = text;
    element.classList.remove("is-typing");
    footnote.hidden = false;
    return;
  }

  function tick() {
    if (index >= characters.length) {
      element.classList.remove("is-typing");
      footnote.hidden = false;
      return;
    }
    element.textContent += characters[index];
    index += 1;
    typingTimer = window.setTimeout(tick, speed);
  }
  tick();
}

function openLetter() {
  if (letterOpened) return;
  letterOpened = true;

  const envelope = document.getElementById("envelope");
  const envelopeWrap = document.getElementById("envelope-wrap");
  const letterContent = document.getElementById("letter-content");
  const letterText = document.getElementById("letter-text");

  envelopeWrap.classList.add("opened");
  envelope.setAttribute("aria-expanded", "true");
  envelope.setAttribute("aria-label", "Письмо открыто");
  document.getElementById("envelope-instruction").textContent = "Вот и всё, что я хотел тебе сказать.";

  // Не показываем бумагу поверх движущегося конверта: ждём окончания анимации клапана.
  window.setTimeout(() => {
    letterContent.classList.add("visible");
    window.setTimeout(() => {
      letterContent.scrollIntoView({ behavior: "smooth", block: "nearest" });
      typeWriter(letterText, CONFIG.finalMessage, 25);
    }, 520);
  }, 720);
}

document.getElementById("envelope").addEventListener("click", openLetter);

// Начальное состояние прогресса.
showStage("stage-intro");
