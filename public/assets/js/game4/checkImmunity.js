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
                const user = roleUsers.find(roleUser => roleUser.userId === userId);

                for (let roleUser of roleUsers) {
                    let roleUserNumber = roleUser.number

                    if (Number(roleUserNumber) === user.number) {
                        document.querySelector(`[data-js-role-number="${roleUserNumber}"]`).dataset.group = `me`
                    } else {
                        document.querySelector(`[data-js-role-number="${roleUserNumber}"]`).dataset.group = `selectRoleNumber`
                    }
                }

                selectRoleNumber();
            }).catch((err) => {
                console.log('error', err);
            });
        }
    }).catch(err => {
        console.log('初始化失敗')
    });
}

function selectRoleNumber() {
    document.querySelectorAll('[data-group="selectRoleNumber"]').forEach(button => {
        button.addEventListener('click', (el) => {
            const buttonMessageKey = el.target.getAttribute('data-js-role-number');

            liff.sendMessages(buttonMessage[buttonMessageKey]).then(() => {
                console.log('message sent');
                liff.closeWindow();
            }).catch(err => {
                window.alert('Error sending message: ' + err);
            });
        });
    });
}