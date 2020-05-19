class Tooltip {
	constructor(hostElementId, text, closeNotifierFunction) {
		this.hostElementId = hostElementId;
		this.text = text;
		this.closeNotifierFunction = closeNotifierFunction;
	}

	closeTooltip = () => {
		this.detach();
		this.closeNotifierFunction();
	};

	detach() {
		this.element.parentElement.removeChild(this.element);
	}

	attach() {
		let tooltipElement = document.createElement("div");
		tooltipElement.className = "tooltip-card";

		const tooltipTemplate = document.getElementById("tooltip-template");
		const tooltipBody = document.importNode(tooltipTemplate.content, true);
		tooltipBody.querySelector("p").textContent = this.text;
		tooltipElement.appendChild(tooltipBody);

		const hostElement = document.getElementById(this.hostElementId);

		const hostElementTop = hostElement.offsetTop;
		const hostElementLeft = hostElement.offsetLeft;
		const hostElementHeight = hostElement.offsetHeight;
		const scrollHeight = hostElement.parentElement.scrollTop;

		const tooltipX = hostElementLeft + 16;
		const tooltipY = hostElementTop + hostElementHeight - scrollHeight - 10;

		tooltipElement.style.position = "absolute";
		tooltipElement.style.left = tooltipX + "px";
		tooltipElement.style.top = tooltipY + "px";

		this.element = tooltipElement;
		tooltipElement.addEventListener("click", this.closeTooltip);
		hostElement.insertAdjacentElement("beforeend", tooltipElement);
	}
}
