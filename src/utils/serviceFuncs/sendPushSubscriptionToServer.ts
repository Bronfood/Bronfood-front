export function sendPushSubscriptionToServer(subscription) {
    return fetch('http://localhost:3000/subscribe', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
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
