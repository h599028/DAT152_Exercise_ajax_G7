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
		
		this.statusesList = ["WAITING", "ACTIVE", "DONE"];
		const tasklist = document.querySelector("task-list");

		this.changeCallback = null;
		this.deleteCallback = null;
		const tablecontent = tasktable.content;
		let templatecontent = template.content;
		templatecontent.append(tablecontent);
		this.append(templatecontent);
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
	 * @param taskID
	 */
	changestatusCallback(callback, taskID) {
		const selectElement = document.getElementById(taskID).querySelector("select");
		selectElement.addEventListener("change", () => {
			callback(taskID);
			})	
		
		
		

	}

	/**
	 * Add callback to run on click on delete button of a task
	 * @public
	 * @param {function} callback
	 */
	deletetaskCallback(callback, taskID) {
		console.log(taskID)
		document.getElementById(taskID).querySelector("button").addEventListener('click', () => {
            callback(taskID);
        })
	}

	/**
	 * Add task at top in list of tasks in the view
	 * @public
	 * @param {Object} task - Object representing a task
	 */
	showTask(task) {
		
		console.log(task.title)
		const tbody = document.querySelector("tbody");

		const clone = taskrow.content.cloneNode(true);
		let tr = clone.querySelector("tr");
		tr.setAttribute("id", task.id);
		console.log(tr);

		let td = clone.querySelectorAll("td");

		/*let statusSelector = clone.querySelector("select");
		statusSelector.addEventListener("change", () => {
			this.updateTask({
				id: task.id,
				newStatus: this.getStatusSelected(task.id)
			})
		});*/


		td[0].textContent = task.title;
		td[1].textContent = task.status;

		let select = clone.querySelector("select");
		let list = this.statusesList

		for (let status of list) {
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

			let tr = document.getElementById(task.id).getElementsByTagName("td")[1];
			console.log(tr);
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

			document.getElementById(id).remove();

		} else {
		}
		
	}

	/**
	 * @public
	 * @return {Number} - Number of tasks on display in view
	 */
	getNumtasks() {
		
		return document.querySelector("table").rows.length-1;

	}

	getStatusSelected(id) {
		return document.getElementById(id).querySelector("select").value;
	}

}
customElements.define('task-list', TaskList);
