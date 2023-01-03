document.addEventListener('DOMContentLoaded', () => {
    fetch(`/send-id`)
        .then(reqResponse => reqResponse.json())
        .then(jsonResponse => {
            let myLiffId = jsonResponse.id;
            initializeLiff(myLiffId);
        }).catch(err => {
            alert(`error: ${JSON.stringify(err)}`);
        });
});

function initializeLiff(myLiffId) {
    liff.init({
        liffId: myLiffId,
    }).then(() => {
        if (!liff.isLoggedIn()) {
            console.log("用戶未登入");
            liff.login({redirectUri: document.URL});
        } else {
            // liff.logout();
            console.log("用戶已登入");
            liff.getProfile().then(profile => {
                const userId = profile.userId;
                const roleUser = roleUsers.find(roleUser => roleUser.userId === userId);
                const userRoleCard = roles[roleUser.roleId];

                let numberHtml = '';
                for (let number = 1; number <= 10; number++) {
                    let user = roleUsers.find(roleUser => roleUser.number === number);
                    if (undefined !== user) {
                        let roleCard = roles[user.roleId];
                        if (user.userId === userId) {
                            numberHtml += `<div class="role__image__number__item active">`
                                + `<img class="group" src="/assets/img/game4/groups/me.png"><img src="/assets/img/game4/numbers/${number}.jpg"></div>`
                        } else {
                            numberHtml += `<div class="role__image__number__item active">`
                                + `<img class="group" src="/assets/img/game4/groups/${roleCard.groupImage}"><img src="/assets/img/game4/numbers/${number}.jpg"></div>`
                        }
                    } else {
                        numberHtml += `<div class="role__image__number__item"><img src="/assets/img/game4/numbers/${number}.jpg"></div>`
                    }
                }
                document.querySelector('[data-js-role="number"]').innerHTML = numberHtml;
                document.querySelector('[data-js-role="name"]').innerHTML = `${userRoleCard.name}`;
                document.querySelector('[data-js-role="type"]').innerHTML = `${userRoleCard.type}`;
                document.querySelector('[data-js-role="power"]').innerHTML = `${userRoleCard.power}`;
                document.querySelector('[data-js-role="winner"]').innerHTML = `${userRoleCard.winner}`;

                let buttonHtml = '';
                for (let sceneId in scenes) {
                    let scene = scenes[sceneId];
                    buttonHtml += `<div class="action__button__item">
                        <button class="action__button__item--button" data-js-button="changeToStartGame" data-js-button-type="${sceneId}">
                            <span class="action__button__item--title">${scene.name}</span>
                            <img src="/assets/img/game4/scenes/${scene.image}">
                        </button></div>`;
                }

                document.querySelector('[data-js-button="scenes"]').innerHTML = buttonHtml;
                changeToStartGame();
            }).catch((err) => {
                console.log('error', err);
            });
        }
    }).catch(err => {
        console.log('初始化失敗')
    });
}

function changeToStartGame() {
    let button = document.querySelector('[data-js-button="changeToStartGame"]');
    button.addEventListener('click', (e) => {
        const buttonMessageKey = this.getAttribute('data-js-button-type');

        liff.sendMessages(buttonMessage[buttonMessageKey]).then(() => {
            console.log('message sent');
        }).catch(err => {
            window.alert('Error sending message: ' + err);
        });
    });
}