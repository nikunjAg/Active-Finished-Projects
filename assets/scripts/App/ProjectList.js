class ProjectList {
	projects = [];
	constructor(type) {
		this.type = type;
		const prjItems = document.querySelectorAll(`#${this.type}-projects ul li`);
		for (const project of prjItems) {
			this.projects.push(
				new ProjectItem(project.id, this.switchProject.bind(this, project.id))
			);
		}
		this.connectDropable();
	}

	set switchHandler(switchProjectFunction) {
		this.switchProjectHandler = switchProjectFunction;
	}

	addProject(projectItem) {
		// The productItem should now point to currentList's switchProject method with 'this' binding
		// console.log(this);
		// console.log(projectItem);
		projectItem.update(
			this.switchProject.bind(this, projectItem.id),
			this.type
		);
		this.projects.push(projectItem);
		DOMHelper.moveElement(projectItem.id, `#${this.type}-projects ul`);
	}

	switchProject(projectId) {
		// console.log(projectId);
		// console.log(this);
		this.switchProjectHandler(
			this.projects.find((project) => project.id === projectId)
		);
		this.projects = this.projects.filter((project) => project.id !== projectId);
	}

	connectDropable() {
		const list = document.querySelector(`#${this.type}-projects ul`);
		// optional -> Fired only once when a draggable object enters a drop zone
		list.addEventListener("dragenter", (event) => {
			if (event.dataTransfer.types[0] === "text/plain") {
				event.preventDefault();
				list.parentElement.classList.add("dropzone");
				// console.log('DRAG ENTER');
			}
		});

		// mandatory -> fired every 100 millisecond
		list.addEventListener("dragover", (event) => {
			if (event.dataTransfer.types[0] === "text/plain") {
				// console.log('DRAG OVER');
				event.preventDefault();
			}
		});

		// optional -> needed for good styling
		// relatedTarget -> MDN says it is king of secondary property
		// target -> it is where the event actually occurs
		// currentTarget -> this is where we are handling the event current event Handler
		// relatedTarget -> this is a secondary property kind of opposite to target
		// e.g. mouseenter -> target -> EventTarget where mouse entered, relatedTarget -> EventTarget from where the mouse exited (EventTarget -> menas which is handling that event)

		// So for dragleave target -> from where we left and relatedTarget -> to where we left

		list.addEventListener("dragleave", (event) => {
			// Sometimes the relatedTraget is null example -> on some elements which do not have focus, and if you move the drag very fast it takes time for browser to detect the relatedTarget, or may be the relatedTarget is such an elemnt which does not has a closest method so running closest can give errors
			if (
				event.relatedTarget &&
				event.relatedTarget.closest &&
				event.relatedTarget.closest(`#${this.type}-projects ul`) !== list
			) {
				list.parentElement.classList.remove("dropzone");
			}
		});

		list.addEventListener("drop", (event) => {
			event.preventDefault(); // not required in CHROME but required in FIREFOX
			const projectId = event.dataTransfer.getData("text/plain");
			if (
				this.projects.findIndex((project) => project.id === projectId) !== -1
			) {
				list.parentElement.classList.remove("dropzone");
				return;
			}

			// now we someway need to call the connectSwitchButton of other list
			// 1. for that one option is similar to addProject method we pass the connectSwitchButton function reference around
			// 2. trigerring click event on button with this project (Better)
			document
				.querySelector(`#${projectId} .card-actions`)
				.lastElementChild.click();
			list.parentElement.classList.remove("dropzone");
		});
	}
}
