self.addEventListener('push', (event) => {
    const data = event.data?.json() || {};
    const title = data.title || 'Сообщение от Bronfood';
    const message = data.message || '';
    const options = {
        body: message,
        icon: '/bronfood-fav.svg',
        vibrate: [200, 100, 200],
    };

    event.waitUntil(self.registration.showNotification(title, options));
});
