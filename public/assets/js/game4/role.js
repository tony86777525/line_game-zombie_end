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

    // fetch('/getUser',{
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //     },
    //     body: JSON.stringify({key: `${userId}`})
    // }).then(reqResponse => reqResponse.json())
    //     .then(jsonResponse => {
    //         console.log(123);
    //         console.log(jsonResponse.data);
    //     }).catch(function(err){
    //     console.log(err);
    // });
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
                const roleData = roles[roleUser.roleId];

                document.querySelector('[data-js-role="card"]').dataset.role = roleData.image;
                document.querySelector('[data-js-role="name"]').innerHTML = `${roleData.name}`;
                document.querySelector('[data-js-role="power"]').innerHTML = `${roleData.power}`;
                document.querySelector('[data-js-role="winner"]').innerHTML = `${roleData.winner}`;
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
            liff.closeWindow();
        })
        .catch(err => {
            window.alert('Error sending message: ' + err);
        });
    });
}