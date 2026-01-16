export const subscribeUser = async () => {
    const registration = await navigator.serviceWorker.ready;
    const publicVapidKey = 'BG134ti7dvWXp-N92uCbqb7VZ3Ic7PWbScqaSG2O7tL6LhExLO6LH3AYBJ6u1jNhFg04B3zPv935ZLEt9PvPUDE';

    const convertedVapidKey = urlBase64ToUint8Array(publicVapidKey);

    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidKey,
    });

    await fetch('https://localhost:3000/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
