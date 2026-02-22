import { NextResponse } from "next/server";
import { saveSubscription } from "@/server/db";
import type { PushSubscription } from "web-push";

export async function POST(req: Request) {
	try {
		const subscription = (await req.json()) as PushSubscription;

		if (!subscription || !subscription.endpoint) {
			return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
		}

		saveSubscription(subscription);

		return NextResponse.json({ success: true, message: "Subscription saved securely." });
	} catch (error) {
		console.error("Error saving subscription:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
