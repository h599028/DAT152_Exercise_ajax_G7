const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" type="text/css" href="${import.meta.url.match(/.*\//)[0]}/tasklist.css"/>

    <div id="tasklist"></div>`;

const tasktable = document.createElement("template");
tasktable.innerHTML = `
    <table>
        <thead><tr><th>Task</th><th>Status</th></tr></thead>
        <tbody></tbody>
    </table>`;

const taskrow = document.createElement("template");
taskrow.innerHTML = `
    <tr>
        <td></td>
        <td></td>
        <td>
            <select>
                <option value="0" selected>&lt;Modify&gt;</option>
            </select>
        </td>
        <td><button type="button">Remove</button></td>
    </tr>`;

/**
  * TaskList
  * Manage view with list of tasks
  */
class TaskList extends HTMLElement {

	constructor() {
		super();

		/**
		 * Fill inn rest of code
		 */

		const tasklist = document.querySelector("task-list");

		tasklist.setStatuseslist(["WAITING", "ACTIVE", "DONE"]);
		this.tasks = [
			{
				id: 1,
				status: "WAITING",
				title: "Paint roof"
			},
			{
				id: 2,
				status: "ACTIVE",
				title: "Wash windows"
			},
			{
				id: 3,
				status: "DONE",
				title: "Wash floor"
			}
		];

		/* let taskTEST = {
			id: 3,
			newStatus: "ACTIVE"
		} */


		this.changeCallback = null;
		this.deleteCallback = null;
		let templatecontent = template.content;

		this.append(templatecontent);

		for (let t of this.tasks) {
			tasklist.showTask(t);
		}


		// this.updateTask(taskTEST);

	}

	/**
	 * @public
	 * @param {Array} list with all possible task statuses
	 */
	setStatuseslist(allstatuses) {

		this.statusesList = allstatuses;
	}

	/**
	 * Add callback to run on change on change of status of a task, i.e. on change in the SELECT element
	 * @public
	 * @param {function} callback
	 */
	changestatusCallback(callback) {

		this.changeCallback = callback;

		const selectElement = document.getElementById('statusSelect');
		if (selectElement) {

			selectElement.addEventListener('change', (event) => {

				if (this.changeCallback) {
					const newStatus = event.target.value;
					this.changeCallback(newStatus);
				}

			})

		}

	}

	/**
	 * Add callback to run on click on delete button of a task
	 * @public
	 * @param {function} callback
	 */
	deletetaskCallback(callback) {

		this.deleteCallback = callback;

		const taskListContainer = document.getElementById('taskListContainer');
		if (taskListContainer) {

			taskListContainer.addEventListener('clicker', (event) => {

				if (event.target.classList.contains('delete-button')) {
					const taskId = event.target.dataset.taskId;

					if (this.deleteCallback) {
						this.deleteCallback(taskId);
					}
				}

			})

		}

	}

	/**
	 * Add task at top in list of tasks in the view
	 * @public
	 * @param {Object} task - Object representing a task
	 */
	showTask(task) {

		const tablecontent = tasktable.content;
		this.append(tablecontent);
		const tbody = document.querySelector("tbody");

		const clone = taskrow.content.cloneNode(true);
		let tr = clone.querySelector("tr");
		tr.setAttribute("id", task.id);
		console.log(tr);

		let td = clone.querySelectorAll("td");

		// Attaching functionality to the button in the template
		let button = clone.querySelector("button");
		button.addEventListener("click", () => { this.removeTask(task.id) });

		let statusSelector = clone.querySelector("select");
		statusSelector.addEventListener("change", () => {
			this.updateTask({
				id: task.id,
				newStatus: this.getStatusSelected(task.id)
			})
		});


		td[0].textContent = task.title;
		td[1].textContent = task.status;

		let select = clone.querySelector("select");

		for (let status of this.statusesList) {
			let option = document.createElement("option");
			let node = document.createTextNode(status);
			option.appendChild(node);
			option.setAttribute("value", status);
			select.appendChild(option);
		}

		tbody.prepend(clone);

		console.log(this.statusesList);

	}

	/**
	 * Update the status of a task in the view
	 * @param {Object} task - Object with attributes {'id':taskId,'status':newStatus}
	 */
	updateTask(task) {

		if (confirm("Do you want to update task with id " + task.id + "?")) {
			const updatedT = this.tasks.findIndex((t) => t.id == task.id);

			if (updatedT !== -1) {

				this.tasks[updatedT].status = task.newStatus;

			}

			let tr = document.getElementById(task.id).getElementsByTagName("td")[1];
			tr.innerHTML = task.newStatus;
		} else { }

	}

	/**
	 * Remove a task from the view
	 * @param {Integer} task - ID of task to remove
	 */
	removeTask(id) {


		console.log("Removing " + id);
		if (confirm("Do you want to remove task?") == true) {
			// Run deletetaskCallback

			document.getElementById(id).remove();

		} else {
		}
	}

	/**
	 * @public
	 * @return {Number} - Number of tasks on display in view
	 */
	getNumtasks() {

		return this.tasks.length;

	}

	getStatusSelected(id) {
		return document.getElementById(id).querySelector("select").value;
	}

}
customElements.define('task-list', TaskList);
