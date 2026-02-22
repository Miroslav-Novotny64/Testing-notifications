/// <reference lib="webworker" />

declare let self: ServiceWorkerGlobalScope;

self.addEventListener("push", (event) => {
	const data = event.data?.json() ?? {};
	const title = data.title || "New Notification";
	const options = {
		body: data.body || "You have a new message.",
		icon: data.icon || "/icon-192x192.png",
		badge: "/icon-192x192.png",
		data: {
			url: data.url || "/",
		},
	};

	event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
	event.notification.close();
	const urlToOpen = event.notification.data?.url || "/";

	event.waitUntil(
		self.clients
			.matchAll({ type: "window", includeUncontrolled: true })
			.then((clientList) => {
				for (const client of clientList) {
					if (client.url === urlToOpen && "focus" in client) {
						return client.focus();
					}
				}
				if (self.clients.openWindow) {
					return self.clients.openWindow(urlToOpen);
				}
			})
	);
});
