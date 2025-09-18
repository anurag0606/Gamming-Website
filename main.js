// filterbar card
let list = document.querySelectorAll('.list');
let card = document.querySelectorAll('.gamescard');

for (let i = 0; i < list.length; i++) {
    list[i].addEventListener('click', function () {
        for (let j = 0; j < list.length; j++) {
            list[j].classList.remove('active');
        }
        this.classList.add('active');

        let dataFilter = this.getAttribute('data-filter');

        for (let k = 0; k < card.length; k++) {
            card[k].classList.remove('active');
            card[k].classList.add('hide');

            if (card[k].getAttribute('data-item') == dataFilter || dataFilter == 'all') {
                card[k].classList.remove('hide');
                card[k].classList.add('active');
            }
        }
    })
}

// // Light/Dark mode toggle
// const modeToggle = document.getElementById('modeToggle');
// const body = document.body;

// modeToggle.addEventListener('click', () => {
//     body.classList.toggle('light-mode');
//     // Change icon
//     if (body.classList.contains('light-mode')) {
//         modeToggle.innerHTML = "<i class='bx bx-moon'></i>";
//     } else {
//         modeToggle.innerHTML = "<i class='bx bx-sun'></i>";
//     }
// });

