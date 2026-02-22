import { NextResponse } from "next/server";
import { saveSubscription } from "@/server/db";
import type { PushSubscription } from "web-push";

export async function POST(req: Request) {
	try {
		const subscription = (await req.json()) as PushSubscription;

		console.log("INCOMING SUBSCRIPTION PAYLOAD:", subscription);

		if (!subscription || !subscription.endpoint) {
			console.log("REJECTED: missing endpoint field");
			return NextResponse.json({ error: "Invalid subscription" }, { status: 400 });
		}

		saveSubscription(subscription);
		console.log("SUCCESSFULLY SAVED SUBSCRIPTION");

		return NextResponse.json({ success: true, message: "Subscription saved securely." });
	} catch (error) {
		console.error("Error saving subscription:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
