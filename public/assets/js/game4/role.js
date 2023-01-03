document.addEventListener('DOMContentLoaded', () => {
    fetch(`/send-id`)
        .then(reqResponse => reqResponse.json())
        .then(jsonResponse => {
            let myLiffId = jsonResponse.id;
            initializeLiff(myLiffId);
        })
        .catch(err => {
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
                let userId = profile.userId;
                console.log(userId);
                const roleUser = roleUsers.find(roleUser => roleUser.userId === userId);
                const userRoleCard = roles[roleUser.roleId];

                // let numberHtml = '';
                // for (let i = 1; i <= 10; i++) {
                //     numberHtml += `<div class="role__image__number__item"><img src="/assets/img/game4/numbers/${i}.jpg"></div>`
                // }
                // document.querySelector('[data-js-role="number"]').innerHTML = numberHtml;
                document.querySelector('[data-js-role="card"]').dataset.role = userRoleCard.image;
                document.querySelector('[data-js-role="name"]').innerHTML = `${userRoleCard.name}`;
                document.querySelector('[data-js-role="type"]').innerHTML = `${userRoleCard.type}`;
                document.querySelector('[data-js-role="power"]').innerHTML = `${userRoleCard.power}`;
                document.querySelector('[data-js-role="winner"]').innerHTML = `${userRoleCard.winner}`;
            })
            .catch((err) => {
                console.log('error', err);
            });
        }
        // setButtonHandler();
    }).catch(err => {
        console.log('初始化失敗')
    });
}

function changeToStartGame() {
    let button = document.querySelector('[data-js-button="changeToStartGame"]');
    button.addEventListener('click', () => {
        // liff.logout();
        // liff.closeWindow();

        liff.sendMessages(buttonMessage)
        .then(() => {
            console.log('message sent');
        })
        .catch(err => {
            window.alert('Error sending message: ' + err);
        });
    });
}