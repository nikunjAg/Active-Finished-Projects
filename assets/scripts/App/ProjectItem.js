class ProjectItem {
	hasActiveTooltip = false;
	constructor(id, switchProjectFunction) {
		this.id = id;
		this.switchProjectHandler = switchProjectFunction;
		this.connectMoreInfoButton();
		this.connectSwitchButton();
		this.connectDrag();
	}

	showInfoHandler() {
		if (this.hasActiveTooltip) return;
		const element = document.getElementById(this.id);
		const tooltip = new Tooltip(this.id, element.dataset.extraInfo, () => {
			this.hasActiveTooltip = false;
		});
		tooltip.attach(this);
		this.hasActiveTooltip = true;
	}

	connectMoreInfoButton() {
		const moreInfoBtn = document.querySelector(`#${this.id} .card-actions`)
			.firstElementChild;
		moreInfoBtn.addEventListener("click", this.showInfoHandler.bind(this));
	}

	connectSwitchButton() {
		const switchBtn = document.querySelector(`#${this.id} .card-actions`)
			.lastElementChild;
		switchBtn.addEventListener("click", () => {
			this.switchProjectHandler();
		});
	}

	connectDrag() {
		const project = document.getElementById(this.id);
		project.addEventListener("dragstart", (event) => {
			event.dataTransfer.setData("text/plain", this.id);
			event.dataTransfer.effectAllowed = "move";
		});

		project.addEventListener("dragend", (event) => {
			// console.log(event);
			// We run here any logic to updat the UI may be if drop succedded or fails by checking the property event.dataTransfer.dropEffect
		});
	}

	update(switchProjectFn, type) {
		this.switchProjectHandler = switchProjectFn;
		const switchBtn = document.querySelector(`#${this.id} .card-actions`)
			.lastElementChild;
		switchBtn.textContent = type === "active" ? "Finish" : "Activate";
	}
}
