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
                if (undefined === roleUser) {
                    alert('你不是本局玩家');
                    liff.closeWindow();
                }

                const userRoleCard = roles[roleUser.roleId];

                document.querySelectorAll(`[data-js-role-number]`).forEach(function(item, index){
                    if (roleUsers.length > 5 || (roleUsers.length <= 5 && index < 5)) {
                        item.classList.add('active');
                        let userGuess = roleUser.guess.find(userGuess => Number(userGuess.number)
                            === Number(item.dataset.jsRoleNumber));
                        if (undefined !== userGuess) {
                            item.dataset.guess = userGuess.guess;
                        }
                    }
                });

                for (let number in numberGroupImages) {
                    let image = numberGroupImages[number];
                    let target = document.querySelector(`[data-js-role-number="${number}"]`);

                    if (Number(number) === roleUser.number) {
                        target.dataset.group = `me`;
                    } else if (canSeeAnyoneRoleId === roleUser.roleId
                            || canSeeImmunityRoleId === roleUser.roleId && "immunity" === image) {
                        target.dataset.group = `${image}`;
                    } else {
                        target.dataset.group = `other`;
                    }
                }
                let nameTarget = document.querySelector('[data-js-role="name"]');
                let powerTarget = document.querySelector('[data-js-role="power"]');
                let winnerTarget = document.querySelector('[data-js-role="winner"]');
                let roundMessageTarget = document.querySelector('[data-js-target="roundMessage"]');

                nameTarget.innerHTML = `${userRoleCard.name}`;
                powerTarget.innerHTML = `${userRoleCard.power}`;
                winnerTarget.innerHTML = `${userRoleCard.winner}`;

                const roundMessage = roundMessages.find(roundMessage => roundMessage.roleId === roleUser.roleId);

                if (undefined !== roundMessage) {
                    roundMessageTarget.innerHTML = `${roundMessage.message}`;
                }

                document.querySelectorAll(`[data-scene]`).forEach((el) => {
                    let scene = scenes.shift();
                    el.dataset.scene = scene.image;
                    el.querySelector(`[data-js-button="name"]`).innerHTML = `${scene.name}`;
                    el.querySelector(`[data-js-button="content"]`).innerHTML = `${scene.content}`;
                });

                changeToStartGame(userId);
            }).catch((err) => {
                console.log('error', err);
            });
        }
    }).catch(err => {
        console.log('初始化失敗')
    });
}

function changeToStartGame(userId) {
    document.querySelectorAll('[data-js-button="selectScene"]').forEach(button => {
        button.addEventListener('click', (el) => {
            const buttonMessageKey = el.target.getAttribute('data-scene');

            liff.sendMessages(buttonMessage[buttonMessageKey]).then(() => {
                console.log('message sent');
                liff.closeWindow();
            }).catch(err => {
                window.alert('Error sending message: ' + err);
            });
        });
    });

    document.querySelectorAll('[data-guess]:not([data-group=""])').forEach(guess => {
        guess.addEventListener('click', (el) => {
            let newGuess = (Number(el.target.getAttribute('data-guess')) + 1) % 5;
            let userNumber = el.target.getAttribute('data-js-role-number');

            fetch('/setGuess',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    sessionStoreKey: `${sessionStoreKey}`,
                    userId: `${userId}`,
                    userNumber: `${userNumber}`,
                    guess: `${newGuess}`
                })
            }).then(reqResponse => reqResponse.json())
                .then(jsonResponse => {
                    el.target.dataset.guess = newGuess;
                }).catch(function(err){
                console.log(err);
            });
        });
    });

}