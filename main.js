(function () {
    let statusArray = [];
    let cardsArray = [];
    let timeToRefreshGame = 60;
    let timer;

    function couplesOfArray(numb) {
        let numbArray = [];
        for (let count = 1; count <= numb; count++) {
            numbArray.push(count, count);
        };
        return numbArray;
    };
    function mixArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    };
    function field() {
        let $form = document.createElement('form');
        let $input = document.createElement('input');
        let $btnwrapper = document.createElement('div');
        let $btnStart = document.createElement('button');
        $form.classList.add('form');
        $input.classList.add('input');
        $input.placeholder = 'even numb(2/10)';
        $btnStart.classList.add('btn');
        $btnStart.textContent = 'START GAME';

        $btnwrapper.append($btnStart);
        $form.append($input);
        $form.append($btnwrapper);

        return {
            $form,
            $input,
            $btnStart
        };
    };
    function startTimer() {
        if (timer) {
            clearInterval(timer);
        }
        timer = setInterval(() => {
            timeToRefreshGame--;
            console.log(timeToRefreshGame)
            if (timeToRefreshGame === 0) {
                clearInterval(timer);
                endGame();
            };
        }, 1000);
    };
    function endGame() {
        let $game = document.getElementById('game');
        while ($game.firstChild) {
            $game.removeChild($game.lastChild);
        }
        let $message = document.createElement('div');
        $message.textContent = 'Game over!';
        $message.id = 'game-over-message';
        $game.appendChild($message);
        const btnStart = document.querySelector('.btn');
        // btnStart.disabled = false;
    };
    function createCard(arr) {
        let openCard = [];
        let $game = document.getElementById('game');
        let status = false;

        for (const numb of arr) {
            let $li = document.createElement('li');
            $li.classList.add('castomCard');
            $li.textContent = numb;
            $game.append($li);

            $li.addEventListener('click', () => {
                if (openCard.length >= 2 || $li.classList.contains('open') || $li.classList.contains('success')) { return };

                $li.classList.add('open');
                openCard.push($li);

                // check for match of 2 cards
                if (openCard.length == 2) {
                    if (openCard[0].textContent == openCard[1].textContent) {
                        for (const card of openCard) {
                            card.classList.remove('open');
                            openCard[0].classList.add('success');
                            openCard[1].classList.add('success');
                        };
                        status = true;
                        statusArray.push(status);
                        openCard = [];
                        // if the two open cards not MATCH close them after delay
                    } else {
                        // when player not match second card, after 0.5sec 2 cards will close
                        setTimeout(() => {
                            for (const card of openCard) {
                                card.classList.remove('open');
                            };
                            openCard = [];
                        }, 500);
                    };
                };
                // check if player has mathes all cards
                let couples = document.querySelectorAll('.success');
                console.log(cardsArray.length)
                console.log(couples.length)
                if (cardsArray.length == couples.length) {
                    endGame()
                };
            });
        };
        return {
            status,
        };
    };
    function startGame(container, countCouples) {
        let $field = field();
        let title = document.getElementById('title');
        title.after($field.$form)

        $field.$form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!$field.$input.value) {
                return;
            };
            // delite messege 'GAME OVER' before new game
            let $message = document.getElementById('game-over-message');
            if ($message) {
                $message.parentNode.removeChild($message);
                timeToRefreshGame = 60;
            };
            // delite current cards when player submit other num & refresh timer
            let $game = document.getElementById('game');
            while ($game.firstChild) {
                $game.lastChild.remove();
            };
            timeToRefreshGame = 60;


            if ($field.$input.value % 2 === 0 && $field.$input.value >= 2 && $field.$input.value <= 10) {
                let $couplesOfArray = couplesOfArray($field.$input.value);
                let $mixArray = mixArray($couplesOfArray);
                cardsArray = $mixArray;
                createCard(cardsArray);
                $field.$input.value = '';
                // $field.$btnStart.disabled = true;
                startTimer(); // запуск таймера при начале игры
            } else {
                alert('not correct number! You start with 4 couples');
                let $couplesOfArray = couplesOfArray(countCouples);
                let $mixArray = mixArray($couplesOfArray);
                cardsArray = $mixArray;
                createCard(cardsArray);
                $field.$input.value = '';
                // $field.$btnStart.disabled = true;
                startTimer(); // запуск таймера при начале игры
            };

        });
    };

    window.startGame = startGame;
})();
