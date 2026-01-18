export function subscribeUserToPushNotifications() {
    return navigator.serviceWorker
        .getRegistration()
        .then(function (registration) {
            const publicVapidKey = 'BHl_Fh--oPYfT1WHTTH_DPKPfI6nTUWnQNeDLlSAjKZzLZloIbSY1ht9Sb0Vfd_iMyBPaoZivU-7Vkw44KYtfMU';
            const subscribeOptions = {
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
            };
            return registration.pushManager.subscribe(subscribeOptions);
        })
        .then((pushSubscription) => {
            // eslint-disable-next-line no-console
            console.log('User successfully subscribed to push notifications.');
            return pushSubscription;
        });
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
