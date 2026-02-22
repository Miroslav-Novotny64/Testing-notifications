import { PushManager } from "@/app/_components/PushManager";

export default function Home() {
	return (
		<main className="flex min-h-screen flex-col items-center justify-start bg-[#0f172a] text-white pt-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
			{/* Dynamic Background Elements */}
			<div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/30 rounded-full blur-[120px] pointer-events-none" />
			<div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none" />
			<div className="absolute top-[30%] left-[20%] w-[30%] h-[30%] bg-yellow-500/10 rounded-full blur-[80px] pointer-events-none" />

			<div className="z-10 flex flex-col items-center w-full">
				<h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-center mb-6 drop-shadow-lg">
					Notify<span className="text-transparent bg-clip-text bg-linear-to-br from-yellow-300 to-orange-500">Test</span>
				</h1>
				<p className="text-lg md:text-2xl text-slate-300 text-center max-w-2xl leading-relaxed mb-4">
					Experience the future of the web. Install this app anywhere and receive hourly moments of joy.
				</p>

				<PushManager />
			</div>
			
			<div className="mt-auto py-8 text-slate-500 text-sm z-10 w-full text-center">
				A PWA and Web Push demonstration.
			</div>
		</main>
	);
}
