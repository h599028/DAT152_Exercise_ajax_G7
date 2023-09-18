console.log("Testing")
import '../tasklist/tasklist.js';
import '../taskbox/taskbox.js';


const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" type="text/css" href="${import.meta.url.match(/.*\//)[0]}/taskview.css"/>

    <h1>Tasks</h1>

    <div id="message"><p>Waiting for server data.</p></div>
    <div id="newtask"><button type="button" disabled>New task</button></div>

    <!-- The task list -->
    <task-list></task-list>
            
    <!-- The Modal -->
    <task-box></task-box>`;

/**
  * TaskView
  * The full application view
  */


class TaskView extends HTMLElement {
	constructor() {
		super();


		this.view = document.querySelector('task-view');
		let templateContent = template.content;
		this.view.append(templateContent);

		this.messageUpdate();
		const tasklist = document.querySelector('task-list');
		const taskbox = document.querySelector('task-box');
		const button = document.querySelector('button');
		// Henter ut alle de mulige statusene som skal vises
		$.ajax({
			url: this.view.getAttribute("data-serviceurl") + "/allstatuses",
			type: 'GET',
			dataType: 'json',
			success: function(res) {
				tasklist.setStatuseslist(res.allstatuses)

				console.log(res);
			}
		});

		taskbox.setStatuseslist(["WATING", "ACTIVE", "DONE"]);
		taskbox.newtaskCallback((task) => {
			let server = this.addTask(task).then(function(res) {
				console.log(res)
			}).catch(function(err) {
				console.log(err)
			})
			console.log(server);
			if (server) {
				tasklist.showTask(task)
			}
			taskbox.close();
		})
		button.addEventListener("click", () => { taskbox.show() })
	}


	messageUpdate() {
		console.log("messageUpdate is run");
		// Locating the message div
		let view = document.querySelector('task-view');
		const tasklist = document.querySelector('task-list');
		let message = document.querySelector('#message')

		// Creating a pending paragraph element
		let para = document.createElement("p");
		let node = document.createTextNode("Waiting for server data.")
		para.append(node);

		// We replace the old message with the new one
		const child = document.querySelector("p");
		message.replaceChild(para, child);

		$.ajax({
			url: view.getAttribute("data-serviceurl") + "/tasklist",
			type: 'GET',
			dataType: 'json',
			success: function() {
				if (tasklist.getNumtasks() > 0) {
					console.log("if is run");
					node = document.createTextNode(`You have ${tasklist.getNumtasks()} task(s).`);
					para.innerHTML = '';
					para.append(node);
				} else {
					console.log("ifelse is run");
					node = document.createTextNode(`${tasklist.getNumtasks()} tasks were found. `);
					para.innerHTML = '';
					para.append(node);
				}
			}

		});
		// Updating message status, and making button available
		this.enableButton(true);
	}

	addTask(task) {
		let url = this.view;
		return new Promise(function(resolve, reject) {
			$.ajax({
				url: url.getAttribute("data-serviceurl") + "/task",
				type: 'POST',
				dataType: 'json',
				contentType: "application/json; charset=utf-8",
				data: JSON.stringify({ title: task.title, status: task.status }),
				success: function(res) {
					console.log("Task was added to server")
					resolve(res)
				},
				error: function(err) {
					reject(err)
				}
			})
		})
	}

	// Function to enable or disable the button for adding tasks
	enableButton(active) {
		let button = document.querySelector("button");
		if (active) {
			console.log("button enabled")
			button.removeAttribute("disabled")
		}
		else {
			button.setAttribute("disabled", "");
		}
	}
}

customElements.define('task-view', TaskView);
