// bind can be called only once on a single method second time calling will not make any effect

class DOMHelper {
    static moveElement(elementId, newdestinationSelector) {
        const destinationElement = document.querySelector(
            newdestinationSelector
        );
        const element = document.getElementById(elementId);
        destinationElement.appendChild(element);
        setTimeout(() => {
            window.scroll({
                left: 0,
                top: destinationElement.parentElement.offsetTop - 10,
                behavior: "smooth"
            });
            setTimeout(() => {
                // ScrollTo just scroll by that amount
                destinationElement.scrollTo({
                    left: 0,
                    top: element.offsetTop - destinationElement.offsetTop - 16,
                    behavior: "smooth"
                });
            }, 500);
        }, 500);
    }
}

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

        const tooltipTemplate = document.getElementById('tooltip-template');
        const tooltipBody = document.importNode(tooltipTemplate.content, true);
        tooltipBody.querySelector('p').textContent = this.text;
        tooltipElement.appendChild(tooltipBody);

        const hostElement = document.getElementById(this.hostElementId);

        const hostElementTop = hostElement.offsetTop;
        const hostElementLeft = hostElement.offsetLeft;
        const hostElementHeight = hostElement.offsetHeight;
        const scrollHeight = hostElement.parentElement.scrollTop;

        const tooltipX = hostElementLeft + 16;
        const tooltipY = hostElementTop + hostElementHeight - scrollHeight - 10;

        tooltipElement.style.position = 'absolute'
        tooltipElement.style.left = tooltipX + 'px';
        tooltipElement.style.top = tooltipY + 'px';

        this.element = tooltipElement;
        tooltipElement.addEventListener("click", this.closeTooltip);
        hostElement.insertAdjacentElement('beforeend', tooltipElement);

    }
}

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
            console.log("Hello");
        });
    }

    connectDrag() {
        const project = document.getElementById(this.id);
        project.addEventListener('dragstart', event => {
            event.dataTransfer.setData('text/plain', this.id);
            event.dataTransfer.effectAllowed = 'move';
        });

        project.addEventListener('dragend', event => {
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

class ProjectList {
    projects = [];
    constructor(type) {
        this.type = type;
        const prjItems = document.querySelectorAll(
            `#${this.type}-projects ul li`
        );
        console.log(prjItems);
        for (const project of prjItems) {
            this.projects.push(
                new ProjectItem(
                    project.id,
                    this.switchProject.bind(this, project.id)
                )
            );
        }
        console.log(this.projects);
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
        this.projects = this.projects.filter(
            (project) => project.id !== projectId
        );
    }

    connectDropable() {
        const list = document.querySelector(`#${this.type}-projects ul`);
        // optional -> Fired only once when a draggable object enters a drop zone
        list.addEventListener('dragenter', (event) => {
            if (event.dataTransfer.types[0] === 'text/plain') {
                event.preventDefault();
                list.parentElement.classList.add('dropzone');
                // console.log('DRAG ENTER');
            }
        });

        // mandatory -> fired every 100 millisecond
        list.addEventListener('dragover', event => {
            if (event.dataTransfer.types[0] === 'text/plain') {
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

        list.addEventListener('dragleave', event => {
            // Sometimes the relatedTraget is null example -> on some elements which do not have focus, and if you move the drag very fast it takes time for browser to detect the relatedTarget, or may be the relatedTarget is such an elemnt which does not has a closest method so running closest can give errors
            if (event.relatedTarget && event.relatedTarget.closest && event.relatedTarget.closest(`#${this.type}-projects ul`) !== list) {
                list.parentElement.classList.remove('dropzone');
            }
        });

        list.addEventListener('drop', event => {
            event.preventDefault(); // not required in CHROME but required in FIREFOX
            const projectId = event.dataTransfer.getData('text/plain');
            if(this.projects.findIndex(project => project.id === projectId) !== -1) {
                list.parentElement.classList.remove('dropzone');
                return;
            }

            // now we someway need to call the connectSwitchButton of other list
            // 1. for that one option is similar to addProject method we pass the connectSwitchButton function reference around
            // 2. trigerring click event on button with this project (Better)
            document.querySelector(`#${projectId} .card-actions`).lastElementChild.click();
            list.parentElement.classList.remove('dropzone');

        });

    }

}

class App {
    static init() {
        const activeProjectsList = new ProjectList("active");
        const finishedProjectsList = new ProjectList("finished");

        /* activeProjectsList.setSwitchProjectHandler(
            finishedProjectsList.addProject.bind(finishedProjectsList)
        );
        finishedProjectsList.setSwitchProjectHandler(
            activeProjectsList.addProject.bind(activeProjectsList)
        );   ORR BELOW   */

        activeProjectsList.switchHandler = finishedProjectsList.addProject.bind(
            finishedProjectsList
        );
        finishedProjectsList.switchHandler = activeProjectsList.addProject.bind(
            activeProjectsList
        );
    }
}

App.init();
// This will initiate the creation of the active project List instance and finished project list instance.