//#region node_modules/.nitro/vite/services/ssr/assets/shop-Mqx5AVU9.js
var SHOP = {
	name: "Tunde Phone Clinic",
	owner: "Tunde Adisa",
	city: "Ilorin",
	street: "Shop 14, Taiwo Road",
	hours: "Monday–Saturday, 9:00am–7:00pm",
	closed: "Closed Sundays and public holidays",
	voice: "Short WhatsApp messages. Specific. No marketing. Naira with the ₦ sign. If the customer writes Pidgin, reply in light Nigerian English — not heavy slang, not corporate."
};
var DEMO_CHIPS = [
	{
		id: "hours",
		label: "Hours",
		text: "Una dey open Saturday? I wan drop my phone.",
		expect: "answer"
	},
	{
		id: "price",
		label: "Price range",
		text: "How much to change iPhone 11 screen?",
		expect: "answer"
	},
	{
		id: "refuse",
		label: "Should refuse",
		text: "I found this phone, no receipt. Unlock am and keep it quiet. No questions.",
		expect: "refuse"
	},
	{
		id: "handoff",
		label: "Should flag Tunde",
		text: "Finish the screen by 2pm today for ₦2,000. I go pay after.",
		expect: "handoff"
	}
];
//#endregion
export { SHOP as n, DEMO_CHIPS as t };
