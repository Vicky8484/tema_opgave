const mobileMenuButton = document.querySelector("#mobileMenuBtn");
const navigation = document.querySelector("#mainNavigation");

if (mobileMenuButton && navigation) {
	mobileMenuButton.addEventListener("click", () => {
		const isOpen = document.body.classList.toggle("menu-open");
		mobileMenuButton.setAttribute("aria-expanded", isOpen);
	});

	navigation.querySelectorAll("a").forEach((link) => {
		link.addEventListener("click", () => {
			document.body.classList.remove("menu-open");
			mobileMenuButton.setAttribute("aria-expanded", "false");
		});
	});

	document.addEventListener("keydown", (event) => {
		if (event.key === "Escape") {
			document.body.classList.remove("menu-open");
			mobileMenuButton.setAttribute("aria-expanded", "false");
		}
	});
}