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

                document.querySelector('[data-js-role="card"]').innerHTML = `<img src="/assets/img/game/roles/${role.image}">`;
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

function setButtonHandler() {
    let button = document.getElementById('button');
    button.addEventListener('click', () => {
        window.alert('clicked: sendMessages');
        liff
        .sendMessages([
            {
                type: 'text',
                text: 'Hello, LIFF!',
            },
        ])
        .then(() => {
            alert('message sent');
            liff.closeWindow();
        })
        .catch(err => {
            window.alert('Error sending message: ' + err);
        });
    });
}

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
});