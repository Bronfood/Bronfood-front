export function sendPushSubscriptionToServer(subscription: PushSubscription) {
    const token = localStorage.getItem('token');
    return fetch(`${import.meta.env.VITE_API_URL}/api/notifications/subscribe/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subscription),
    }).then(async function (response) {
        if (!response.ok) {
            throw new Error('Bad status code from server.');
        }
        const result = await response.text();
        // eslint-disable-next-line no-console
        console.log(result);
        return result;
    });
}
