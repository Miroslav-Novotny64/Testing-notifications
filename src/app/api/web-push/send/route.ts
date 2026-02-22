import { NextResponse } from "next/server";
import webpush from "web-push";
import { getAllSubscriptions } from "@/server/db";
import { env } from "@/env";

webpush.setVapidDetails(
	"mailto:test@example.com",
	env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
	env.VAPID_PRIVATE_KEY
);

const funnyMessages = [
	"Time to stretch those legs! Or just your fingers.",
	"Did you know? Pigeons can do math. Probably better than me.",
	"Hourly reminder: You're doing great. But your posture could use work.",
	"Another hour, another excuse for coffee.",
	"Blink manually. You're welcome.",
	"Here's a notification to make you feel popular.",
	"A wizard is never late, nor is he early. But this notification is precisely on time.",
	"Time flies when you're writing code (or scrolling).",
	"Have you hydrated recently? DO IT.",
	"Error 404: Motivation not found. Retrying in an hour.",
];

export async function GET(req: Request) {
	return handlePush(req);
}

export async function POST(req: Request) {
	let customMessage: string | undefined;
	try {
		const body = await req.json();
		if (body && body.message) {
			customMessage = body.message;
		}
	} catch (e) {
		// Ignore empty body
	}
	return handlePush(req, customMessage);
}

async function handlePush(req: Request, customMessage?: string) {
	try {
		const subscriptions = getAllSubscriptions();

		if (subscriptions.length === 0) {
			return NextResponse.json({ message: "No subscriptions found." });
		}

		const randomMessage = funnyMessages[Math.floor(Math.random() * funnyMessages.length)];
		const imageIndex = Math.floor(Math.random() * 1000);

		const payload = JSON.stringify({
			title: customMessage ? "Custom Broadcast" : "Hourly Chuckle",
			body: customMessage || randomMessage,
			icon: "/icon-192x192.png",
			image: `https://picsum.photos/seed/${imageIndex}/400/200`,
			url: "/chuckler",
		});

		const sendPromises = subscriptions.map((sub) =>
			webpush.sendNotification(sub, payload).catch((error) => {
				console.error("Error sending push to a subscription, it might have expired:", error);
				// In a real app, we'd remove expired subscriptions here
			})
		);

		await Promise.all(sendPromises);

		return NextResponse.json({ success: true, sentTo: subscriptions.length });
	} catch (error) {
		console.error("Error sending push notifications:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}



