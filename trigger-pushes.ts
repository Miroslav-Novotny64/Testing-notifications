/**
 * trigger-pushes.ts
 * 
 * Run this script with `bun run trigger-pushes.ts` or `npx tsx trigger-pushes.ts`.
 * Ensure your Next.js server is running on http://localhost:3000.
 * It will call the Push endpoint every hour for a month (720 hours).
 */

const URL = "http://localhost:3000/api/web-push/send";
const HOURS_IN_MONTH = 24 * 30; // 720 hours
let count = 0;

console.log("Starting cron to push notifications every hour for a month (720 hours)...");

async function trigger() {
	try {
		const res = await fetch(URL, { method: "GET" });
		const data = await res.json();
		console.log(`[${new Date().toISOString()}] Push Response:`, data);
	} catch (error) {
		console.error("Failed to trigger push:", (error as Error).message);
	}
}

// Trigger immediately once
trigger();

const interval = setInterval(() => {
	count++;
	if (count >= HOURS_IN_MONTH) {
		console.log("Finished 1 month of pushes.");
		clearInterval(interval);
		return;
	}
	trigger();
}, 1000 * 60 * 60); // 1 hour

// Keep the script running
console.log("Script is running in the background. Press Ctrl+C to stop.");
