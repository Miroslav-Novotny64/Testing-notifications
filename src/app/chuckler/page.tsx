import Link from "next/link";

export default function ChucklerPage() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-center bg-[#0f172a] text-white p-4 relative overflow-hidden">
			<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-96 bg-yellow-500/20 rounded-full blur-[100px] pointer-events-none" />

			<div className="z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl text-center shadow-2xl max-w-md w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
				<div className="text-8xl mb-6">🤡</div>
				<h1 className="text-4xl font-extrabold mb-4 text-transparent bg-clip-text bg-linear-to-r from-yellow-300 to-orange-500">
					You Clicked It!
				</h1>
				<p className="text-xl text-slate-300 mb-8">
					This is the dedicated page opened by your hourly push notification.
				</p>
				<Link
					href="/"
					className="inline-block px-8 py-4 rounded-full font-bold text-lg bg-white/10 hover:bg-white/20 transition-all border border-white/10"
				>
					← Back to Home
				</Link>
			</div>
		</main>
	);
}
