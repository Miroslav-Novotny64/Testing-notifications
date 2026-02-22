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
    "Moje babička má srdce lva a doživotní zákaz vstupu do zoo.",
    "Černý humor je jako nohy. Někdo je má, někdo ne.",
    "Doktor: 'Mám pro vás dobrou a špatnou zprávu. Kterou chcete nejdřív?' Pacient: 'Tu dobrou.' Doktor: 'Budou po vás pojmenovávat nemoc.'",
    "Dal jsem slepci k narozeninám struhadlo. Druhý den mi volal, že tak drsnou knížku ještě nečetl.",
    "I ten největší pesimista může v životě narazit na něco pozitivního. Třeba na test na HIV.",
    "Můj děda zemřel v klidu, ve spánku. Na rozdíl od těch padesáti lidí v jeho autobuse.",
    "Co udělá kanibal, když sežere klauna? Začne se cítit nějak divně.",
    "Jaký je rozdíl mezi dětmi a sněhulákem? Sněhulák při fénování nekřičí.",
    "Doktor: 'Zbývá vám 10.' Pacient: '10 čeho? Let? Měsíců?' Doktor: '9... 8... 7...'",
    "Manželka mi napsala seznam věcí k nákupu. Už jsem v obchodě hodinu a pořád nemůžu najít 'svobodu'.",
    "Sirotek v obchodě: 'Tati, podívej!' ... 'Aha, vlastně nic.'",
    "Proč se sebevrazi neperou? Protože to stejně vždycky skončí remízou.",
    "Moje přítelkyně mi řekla, že by pro mě i umřela. Tak jsem jí podal nůž, ať nekecá.",
    "Když daruješ ledvinu, jsi hrdina. Když jich daruješ pět v igelitce, volají policii.",
    "Učitel: 'Kdo mi odpoví na tuhle otázku, může jít domů.' *Student prohodí cihlu oknem.* Učitel: 'Kdo to udělal?!' Student: 'Já! Čau!'",
    "Jak se říká tlusté ženě? To je jedno, stejně tě nedoběhne.",
    "Co je to absolutní osamělost? Když ti i spamové maily přestanou chodit.",
    "Děda mi vždycky říkal: 'Když se jedny dveře zavřou, jiné se otevřou.' Byl to skvělý člověk, ale mizerný výrobce ponorek.",
    "Proč nemají bezdomovci televizi? Protože se nemají na co dívat.",
    "Včera jsem viděl chlapa, jak mluví se svým psem. Bylo vidět, že si myslí, jak je ten pes chytrý. Pak jsem přišel domů a vyprávěl to svému kocourovi. Ten se mohl potrhat smíchy.",
    "První slova mýho syna byla: 'Kde je máma?' Musel jsem mu vysvětlit, že v lese se kopou hroby blbě, když prší.",
    "Jaký je rozdíl mezi tátou a bumerangem? Bumerang se vrací.",
    "Můj syn se mě ptal, jaké to je být dospělý. Tak jsem ho vzbudil ve 3 ráno, řekl mu, že dlužíme za nájem a zakázal mu jíst.",
    "Co má společného humor a jídlo v Africe? Ne každý ho má.",
    "Hřbitovy jsou plné lidí, kteří měli v křižovatce přednost.",
    "Manželka: 'Kam jdeš?' Já: 'Na pohřeb.' Manželka: 'Bez dárku?' Já: 'Vezu rakev, to stačí.'",
    "Můj pes je jako rodina. Taky ho občas musím zavřít do klece, když přijdou hosté.",
    "Víte, proč si slepci nekupují auta? Protože nevidí smysl v řízení.",
    "Přítelkyně mi řekla, že potřebuje víc prostoru. Tak jsem ji nechal v lese.",
    "Optimista vidí světlo v tunelu. Pesimista vidí tmu. Strojvůdce vidí dva idioty na kolejích.",
    "Co je horší než najít červa v jablku? Najít tam jen půlku červa.",
    "Pracuju jako dobrovolník v domově důchodců. Moje oblíbená hra je 'schovej jim zuby'.",
    "Našel jsem v lese hřib, po kterém se ti změní celý život. Jen jednou.",
    "Jaký je rozdíl mezi klavírem a rakví? Klavír se lépe ladí.",
    "Mami, proč jsou ty děti tak tlusté? Protože mají hodně cukrovky, zlato.",
    "Koupil jsem si knihu 'Jak přežít pád z letadla'. Došla mi, až když jsem dopadl.",
    "Dva vězni: 'Za co tu jsi?' 'Za krádež.' 'A ty?' 'Za to, že jsem si nenechal ukrást auto.'",
    "Víte, proč jsou v nemocnicích zdi tak tenké? Aby pacienti věděli, co je čeká v nebi.",
    "Moje ex mi poslala zprávu: 'Chybíš mi.' Tak jsem přidal plyn a zkusil ji trefit znovu.",
    "Co je největší ironie? Když upálí hasiče.",
    "Manžel: 'Zlato, co bude k večeři?' Manželka: 'Nic.' Manžel: 'To bylo i včera!' Manželka: 'Uvařila jsem na dva dny.'",
    "Proč nemají kostlivci kamarády? Protože jim nikdo neleze pod kůži.",
    "Soused mi zaklepal na dveře ve 2 ráno. Normálně jsem ho ignoroval a dál hrál na bicí.",
    "Když se mě lidé ptají, kde se vidím za pět let, vždycky odpovídám: 'V zrcadle.'",
    "Co uděláš, když uvidíš epileptika ve vaně? Přihodíš špinavé prádlo.",
    "Ztratil jsem práci v bance. Stará paní mě poprosila, abych jí zkontroloval zůstatek, tak jsem ji strčil.",
    "Co dělá smutný programátor? Kouká do nullu.",
    "Smrt je jenom způsob, jakým ti příroda říká, abys trochu zpomalil.",
    "Můj oblíbený sport je běh. Hlavně když mě honí policajti.",
    "Život je jako bonboniéra. Pokud jsi alergik, pravděpodobně tě zabije."
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



