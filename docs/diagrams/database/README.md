# Summary

`User` -  информация о пользователях

`RTSession` - информация связанная с refresh tokens (+ информация о сессии), для инвалидации RT в случае если он будет скомпрометирован

`MovieRecord` - информация об id фильмов(imdbId-s мы получаем из внешнего API). Информация о типе фильмов хранится в `./movie.interface.ts`

`Cinema` - информация о кинотеатрах, для которых доступен букинг билетов на фильмы

`MovieOnCinema` -  информация о фильмах, доступных для букинга в кинотеатрах

`MovieSession` - информация о сеансах в кинотеатрах (один сеанс подразумевает один фильм)

`Booking` - информация о забронированных месте(ах) на конкретный сеанс в конкретный кинотеатр

`Seat` - информация об абстрактных местах в кинотеатре

`SeatOnBooking` - информация о забронированных местах для определенного букинга

`SeatOnCinema` - информация о всех местах для определенного кинотеатра (подразумевается, что для всех сеансов в рамках одного кинотеатра доступны одни и те же места). Available false означает, что данное место изначально недоступно для букинга, но имеется в зале