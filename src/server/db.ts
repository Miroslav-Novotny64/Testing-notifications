import type { PushSubscription } from "web-push";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Find data directory.
// For coolify/docker, you can mount a volume to /app/data
const dataDir = path.join(process.cwd(), "data");

if (!fs.existsSync(dataDir)) {
	fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(path.join(dataDir, "subscriptions.db"));

// Initialize the database table
db.exec(`
	CREATE TABLE IF NOT EXISTS subscriptions (
		endpoint TEXT PRIMARY KEY,
		subscription_json TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)
`);

const insertSubscriptionStatement = db.prepare(
	`INSERT OR REPLACE INTO subscriptions (endpoint, subscription_json) VALUES (?, ?)`
);

const getAllSubscriptionsStatement = db.prepare(
	`SELECT subscription_json FROM subscriptions`
);

export function saveSubscription(subscription: PushSubscription) {
	insertSubscriptionStatement.run(
		subscription.endpoint,
		JSON.stringify(subscription)
	);
}

export function getAllSubscriptions(): PushSubscription[] {
	const rows = getAllSubscriptionsStatement.all() as { subscription_json: string }[];
	return rows.map((row) => JSON.parse(row.subscription_json) as PushSubscription);
}
