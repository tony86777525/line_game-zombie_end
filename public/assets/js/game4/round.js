document.addEventListener('DOMContentLoaded', () => {
    fetch(`/send-id`)
        .then(reqResponse => reqResponse.json())
        .then(jsonResponse => {
            let myLiffId = jsonResponse.id;
            initializeLiff(myLiffId);
        }).catch(err => {
            alert(`error: ${JSON.stringify(err)}`);
        });

    changeToStartGame();
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

                for (let number in numberGroupImages) {
                    let image = numberGroupImages[number];

                    if (Number(number) === roleUser.number) {
                        document.querySelector(`[data-js-role-number="${number}"]`).dataset.group = `me`
                    } else if (canSeeAnyoneRoleId === roleUser.roleId
                            || canSeeImmunityRoleId === roleUser.roleId && "immunity" === image) {
                        document.querySelector(`[data-js-role-number="${number}"]`).dataset.group = `${image}`
                    }
                }


                document.querySelector('[data-js-role="name"]').innerHTML = `${userRoleCard.name}`;
                document.querySelector('[data-js-role="type"]').innerHTML = `${userRoleCard.type}`;
                document.querySelector('[data-js-role="power"]').innerHTML = `${userRoleCard.power}`;
                document.querySelector('[data-js-role="winner"]').innerHTML = `${userRoleCard.winner}`;

                document.querySelectorAll(`[data-scene]`).forEach((el) => {
                    let scene = scenes.shift();
                    el.dataset.scene = scene.image;
                    el.querySelector(`[data-js-button="title"]`).innerHTML = scene.content;
                });
            }).catch((err) => {
                console.log('error', err);
            });
        }
    }).catch(err => {
        console.log('初始化失敗')
    });
}

function changeToStartGame() {
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

}