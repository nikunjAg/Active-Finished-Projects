class DOMHelper {
	static moveElement(elementId, newdestinationSelector) {
		const destinationElement = document.querySelector(newdestinationSelector);
		const element = document.getElementById(elementId);
		destinationElement.appendChild(element);
		setTimeout(() => {
			window.scroll({
				left: 0,
				top: destinationElement.parentElement.offsetTop - 10,
				behavior: "smooth",
			});
			setTimeout(() => {
				// ScrollTo just scroll by that amount
				destinationElement.scrollTo({
					left: 0,
					top: element.offsetTop - destinationElement.offsetTop - 16,
					behavior: "smooth",
				});
			}, 500);
		}, 500);
	}
}
