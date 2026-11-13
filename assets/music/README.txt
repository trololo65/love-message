АУДИОФАЙЛЫ

Положите сюда музыкальные файлы (рекомендуется MP3 или M4A) с точными именами:
- lonely-day.mp3                         — System Of A Down — Lonely Day (фоновый трек)
- andrew-bird-sisyphus.mp3               — Andrew Bird — Sisyphus
- dead-confederate-it-was-a-rose.mp3     — Dead Confederate — It Was a Rose
- bob-dylan-knockin-on-heavens-door.mp3  — Bob Dylan — Knockin’ on Heaven’s Door
- guns-n-roses-knockin-on-heavens-door.mp3 — Guns N’ Roses — Knockin’ on Heaven’s Door
- kansas-carry-on-wayward-son.mp3        — Kansas — Carry On Wayward Son

Логика:
- Lonely Day пытается запуститься автоматически при открытии страницы.
- Если браузер блокирует autoplay со звуком, воспроизведение стартует при первом касании/клике по странице (это ограничение браузеров, не сайта).
- Нажатие на музыкальную обложку запускает соответствующий трек.
- Повторное нажатие на ту же обложку возвращает Lonely Day.
- Время остановки каждого трека сохраняется отдельно в localStorage браузера.
- Перемотки и видимых элементов управления нет.
- Когда выбранная песня заканчивается, снова включается Lonely Day.

Если используете M4A вместо MP3, измените расширение в trackFiles в app.js.
