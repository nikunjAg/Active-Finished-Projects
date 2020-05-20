import { ProjectList } from "./App/ProjectList.js";

// bind can be called only once on a single method second time calling will not make any effect
class App {
	static init() {
		const activeProjectsList = new ProjectList("active");
		const finishedProjectsList = new ProjectList("finished");

		/* activeProjectsList.setSwitchProjectHandler(
            finishedProjectsList.addProject.bind(finishedProjectsList)
        );
        finishedProjectsList.setSwitchProjectHandler(
            activeProjectsList.addProject.bind(activeProjectsList)
        );   OR BELOW   */

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
