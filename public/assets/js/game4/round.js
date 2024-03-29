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
                let getUserGuess = null !== localStorage.getItem('guess') ? localStorage.getItem('guess') : JSON.stringify({});
                getUserGuess = JSON.parse(getUserGuess);
                getUserGuess = getUserGuess.id === guessKey ? JSON.parse(getUserGuess.data) : [];

                if (undefined === roleUser) {
                    alert('你不是本局玩家');
                    liff.closeWindow();
                }

                const userRoleCard = roles[roleUser.roleId];

                document.querySelectorAll(`[data-js-role-number]`).forEach(function(item, index){
                    if (roleUsers.length > 5 || (roleUsers.length <= 5 && index < 5)) {
                        item.classList.add('active');

                        let userGuess = getUserGuess.find(userGuess => Number(userGuess.number)
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
                    let targetName = el.querySelector(`[data-js-button="name"]`);
                    if (null !== targetName) targetName.innerHTML = `${scene.name}`;
                    let targetContent = el.querySelector(`[data-js-button="content"]`);
                    if (null !== targetContent) targetContent.innerHTML = `${scene.content}`;
                });

                if (null !== votingRoundMessage) {
                    let target = document.querySelector(`[data-js-popup="votingRound"]`);
                    let targetTitle = target.querySelector(`[data-js-popup="title"]`);
                    let targetContent = target.querySelector(`[data-js-popup="content"]`);

                    targetTitle.innerHTML = votingRoundMessage.title;

                    const arr = Object.keys(votingRoundMessage.content).map(key => votingRoundMessage.content[key]);

                    targetContent.innerHTML = arr.join("<br>");
                }

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
    if (null !== votingRoundButtonMessage) {
        document.querySelectorAll('[data-js-button="votingRound"]').forEach(button => {
            button.addEventListener('click', (el) => {
                const buttonMessageKey = el.target.getAttribute('data-isAgree');

                liff.sendMessages(votingRoundButtonMessage[buttonMessageKey]).then(() => {
                    console.log('message sent');
                    liff.closeWindow();
                }).catch(err => {
                    window.alert('Error sending message: ' + err);
                });
            });
        });
        document.querySelector('[data-js-popup="votingRound"]').classList.add('active');
    } else {
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
                // let userNumber = el.target.getAttribute('data-js-role-number');

                el.target.dataset.guess = newGuess;

                let newAllGuess = [];
                document.querySelectorAll('[data-guess]:not([data-group=""])').forEach(element => {
                    if ('0' !== element.dataset.guess) {
                        newAllGuess.push({number: element.dataset.jsRoleNumber, guess: element.dataset.guess});
                    }
                });

                localStorage.setItem('guess', JSON.stringify({
                    id: guessKey,
                    data: JSON.stringify(newAllGuess)
                }));

                // fetch('/setGuess',{
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //         'Accept': 'application/json'
                //     },
                //     body: JSON.stringify({
                //         sessionStoreKey: `${sessionStoreKey}`,
                //         userId: `${userId}`,
                //         userNumber: `${userNumber}`,
                //         guess: `${newGuess}`
                //     })
                // }).then(reqResponse => reqResponse.json())
                //     .then(jsonResponse => {
                //         el.target.dataset.guess = newGuess;
                //     }).catch(function(err){
                //     console.log(err);
                // });
            });
        });
    }
}