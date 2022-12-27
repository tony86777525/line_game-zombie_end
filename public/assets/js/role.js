function initializeLiff(myLiffId) {
    liff.init({
        liffId: myLiffId,
    }).then(() => {
        if (!liff.isLoggedIn()) {
            console.log("用戶未登入");
            liff.login();
        } else {
            console.log("用戶已登入");
            liff.getProfile()
            .then(profile => {
                const name = profile.displayName
                alert(profile);
            })
            .catch((err) => {
                console.log('error', err);
            });
        }
        setButtonHandler();
    }).catch(err => {
        console.log('初始化失敗')
    });

    // liff.getProfile().then(function (profile) {
    //     const userId = profile.userId;
    //     const name = profile.displayName;
    //     const pictureUrl = profile.pictureUrl;
    //     const statusMessage = profile.statusMessage;
    //     console.log(userId);
    // }).catch(function (error) {
    //     console.log('error', err);
    // });
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