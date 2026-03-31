export function requestNotificationPermission() {
    return new Promise(function (resolve, reject) {
        const permissionResult = Notification.requestPermission(function (result) {
            resolve(result);
        });
        if (permissionResult) {
            permissionResult.then(resolve, reject);
        }
    }).then(function (permissionResult) {
        if (permissionResult !== 'granted') {
            throw new Error('Notification permission was not granted.');
        }
        // eslint-disable-next-line no-console
        console.log('User granted notification permission.');
        return permissionResult;
    });
}
