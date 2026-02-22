"use client";

import { useState, useEffect } from "react";
import { env } from "@/env";

function urlBase64ToUint8Array(base64String: string) {
	const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
	const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
		outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
}

export function PushManager() {
	const [isSubscribed, setIsSubscribed] = useState(false);
	const [statusMessage, setStatusMessage] = useState("");
	const [broadcastMessage, setBroadcastMessage] = useState("");
	const [deviceOS, setDeviceOS] = useState<"ios" | "android" | "other">("other");

	useEffect(() => {
		const userAgent = window.navigator.userAgent.toLowerCase();
		if (/iphone|ipad|ipod/.test(userAgent)) setDeviceOS("ios");
		else if (/android/.test(userAgent)) setDeviceOS("android");

		if ("serviceWorker" in navigator && "PushManager" in window) {
			navigator.serviceWorker.ready.then((registration) => {
				registration.pushManager.getSubscription().then((subscription) => {
					setIsSubscribed(subscription !== null);
				});
			});
		}
	}, []);

	const subscribeToPush = async () => {
		if (!("serviceWorker" in navigator)) {
			setStatusMessage("Service Workers are not supported by your browser.");
			return;
		}

		try {
			const permission = await Notification.requestPermission();
			if (permission !== "granted") {
				setStatusMessage("Permission for notifications was denied.");
				return;
			}

			const registration = await navigator.serviceWorker.ready;

			const subscription = await registration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: urlBase64ToUint8Array(env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
			});

			const response = await fetch("/api/web-push", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(subscription),
			});

			if (response.ok) {
				setIsSubscribed(true);
				setStatusMessage("Successfully subscribed! Firing a test notification...");
				
				// Automatically trigger a notification now
				await fetch("/api/web-push/send", { method: "POST" });
				setStatusMessage("Successfully subscribed to notifications!");
			} else {
				setStatusMessage("Failed to save subscription on the server.");
			}
		} catch (error) {
			console.error("Error subscribing:", error);
			setStatusMessage("Error subscribing to notifications.");
		}
	};

	return (
		<div className="flex flex-col items-center gap-8 w-full max-w-2xl mt-8">
			{/* Notifications Subscription Section */}
			<div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl w-full text-center shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] transition-all hover:scale-[1.02]">
				<div className="text-6xl mb-4 animate-bounce">🔔</div>
				<h2 className="text-3xl font-extrabold mb-4 bg-clip-text text-transparent bg-linear-to-r from-yellow-300 to-yellow-500">
					Hourly Chuckles
				</h2>
				<p className="text-lg text-yellow-100 mb-8 opacity-90">
					Subscribe to receive a funny notification every hour! You must allow notifications when prompted.
				</p>
				<button
					onClick={subscribeToPush}
					disabled={isSubscribed}
					className={`px-8 py-4 rounded-full font-bold text-xl transition-all w-full md:w-auto ${
						isSubscribed
							? "bg-green-500/50 text-white cursor-not-allowed border border-green-400/50"
							: "bg-linear-to-r from-yellow-400 to-orange-500 text-gray-900 hover:scale-105 hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] cursor-pointer"
					}`}
				>
					{isSubscribed ? "✓ Subscribed!" : "Enable Notifications"}
				</button>
				{statusMessage && (
					<p className="mt-4 text-sm tracking-wide text-white/80">{statusMessage}</p>
				)}

				{isSubscribed && (
					<div className="mt-8 pt-6 border-t border-white/10 flex flex-col items-center gap-4 w-full">
						<h3 className="font-bold text-lg text-white">Broadcast a Custom Message</h3>
						<input
							type="text"
							placeholder="Hello from my PC!"
							value={broadcastMessage}
							onChange={(e) => setBroadcastMessage(e.target.value)}
							className="w-full px-4 py-2 rounded-lg bg-black/30 border border-white/20 text-white placeholder-white/50 focus:outline-hidden focus:border-yellow-400"
						/>
						<button
							onClick={() => {
								setStatusMessage("Broadcasting message...");
								fetch("/api/web-push/send", { 
									method: "POST",
									headers: { "Content-Type": "application/json" },
									body: JSON.stringify({ message: broadcastMessage })
								})
									.then(() => {
										setStatusMessage("Broadcast sent!");
										setBroadcastMessage("");
									})
									.catch(() => setStatusMessage("Failed to broadcast."));
							}}
							disabled={!broadcastMessage}
							className="w-full px-6 py-2 rounded-full font-semibold text-lg bg-indigo-500 hover:bg-indigo-400 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
						>
							Send to All Devices
						</button>
						<button
							onClick={() => {
								setStatusMessage("Sending random test notification...");
								fetch("/api/web-push/send", { method: "POST" })
									.then(() => setStatusMessage("Test notification sent!"))
									.catch(() => setStatusMessage("Failed to send test."));
							}}
							className="mt-2 text-sm text-yellow-400 hover:text-yellow-300 transition-colors cursor-pointer"
						>
							Or send a random test
						</button>
					</div>
				)}
			</div>

			{/* Homescreen Tutorial Section */}
			<div className="bg-linear-to-br from-indigo-500/20 to-purple-500/20 backdrop-blur-xl border border-white/10 p-8 rounded-3xl w-full text-center hover:bg-white/5 transition-all">
				<h3 className="text-2xl font-bold mb-6 text-white">📱 Install as App</h3>
				
				{deviceOS === "ios" && (
					<div className="text-left space-y-4 text-lg text-indigo-100 bg-white/5 p-6 rounded-2xl">
						<p className="font-semibold text-xl border-b border-indigo-300/30 pb-2">iOS Instructions</p>
						<ol className="list-decimal pl-6 space-y-3">
							<li>Tap the <span className="font-bold bg-white/20 px-2 py-1 rounded">Share</span> button at the bottom of Safari.</li>
							<li>Scroll down and tap <span className="font-bold bg-white/20 px-2 py-1 rounded">Add to Home Screen</span>.</li>
							<li>Tap <span className="font-bold bg-white/20 px-2 py-1 rounded">Add</span> in the top right.</li>
						</ol>
					</div>
				)}

				{deviceOS === "android" && (
					<div className="text-left space-y-4 text-lg text-indigo-100 bg-white/5 p-6 rounded-2xl">
						<p className="font-semibold text-xl border-b border-indigo-300/30 pb-2">Android Instructions</p>
						<ol className="list-decimal pl-6 space-y-3">
							<li>Tap the <span className="font-bold bg-white/20 px-2 py-1 rounded">Menu</span> icon (3 dots) in the top right.</li>
							<li>Tap <span className="font-bold bg-white/20 px-2 py-1 rounded">Install app</span> or <span className="font-bold bg-white/20 px-2 py-1 rounded">Add to Home screen</span>.</li>
							<li>Follow the prompt to <span className="font-bold bg-white/20 px-2 py-1 rounded">Install</span>.</li>
						</ol>
					</div>
				)}

				{deviceOS === "other" && (
					<div className="text-left space-y-4 text-lg text-indigo-100 bg-white/5 p-6 rounded-2xl">
						<p className="font-semibold text-xl border-b border-indigo-300/30 pb-2">Desktop Instructions</p>
						<p>Look for the <span className="font-bold bg-white/20 px-2 py-1 rounded">Install</span> icon (usually a monitor with a downward arrow) in the right side of your address bar, or check your browser menu.</p>
					</div>
				)}
			</div>
		</div>
	);
}
