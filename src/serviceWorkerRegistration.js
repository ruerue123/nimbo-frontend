// Registers the hand-rolled /service-worker.js, but only in production.
// In dev CRA's webpack-dev-server breaks SW caching, so we actively
// unregister any leftover worker so devs don't see stale assets.
export const registerServiceWorker = () => {
    if (!('serviceWorker' in navigator)) return;

    if (process.env.NODE_ENV !== 'production') {
        // Dev: actively kill any previously-registered SW so reloads pick up
        // fresh code. Without this, an old prod SW lingering from an earlier
        // visit would intercept fetches and you'd debug ghosts.
        navigator.serviceWorker.getRegistrations().then((regs) => {
            regs.forEach((r) => r.unregister());
        }).catch(() => {});
        return;
    }

    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/service-worker.js')
            .then((registration) => {
                // When a new SW is found, tell it to take over immediately so
                // users don't have to close every tab to see updates.
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (!newWorker) return;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            newWorker.postMessage('SKIP_WAITING');
                        }
                    });
                });
            })
            .catch(() => { /* SW registration failures shouldn't break the app */ });

        // Reload once the new SW takes control so the page sees the updated
        // assets it just precached.
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
            if (refreshing) return;
            refreshing = true;
            window.location.reload();
        });
    });
};
