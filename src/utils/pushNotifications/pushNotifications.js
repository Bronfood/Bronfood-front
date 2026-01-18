export async function subscribeUser() {
    const registration = await navigator.serviceWorker.ready;
    console.log(registration);
    const publicVapidKey = 'BHl_Fh--oPYfT1WHTTH_DPKPfI6nTUWnQNeDLlSAjKZzLZloIbSY1ht9Sb0Vfd_iMyBPaoZivU-7Vkw44KYtfMU';

    const convertedVapidKey = urlBase64ToUint8Array(publicVapidKey);

    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
    });

    await fetch('http://localhost:3000/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    console.log('Push subscription sent to server', subscription);
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
