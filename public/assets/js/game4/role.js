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
                userId = profile.userId;
                console.log(userId);

                document.querySelector('[data-js-role="card"]').innerHTML = `<img src="/assets/img/game4/roles/${role.image}">`;
                document.querySelector('[data-js-role="name"]').innerHTML = `${role.name}`;
                document.querySelector('[data-js-role="type"]').innerHTML = `${role.type}`;
                document.querySelector('[data-js-role="power"]').innerHTML = `${role.power}`;
                document.querySelector('[data-js-role="winner"]').innerHTML = `${role.winner}`;
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

        liff.sendMessages(message.story)
        .then(() => {
            console.log('message sent');
        })
        .catch(err => {
            window.alert('Error sending message: ' + err);
        });
    });
}