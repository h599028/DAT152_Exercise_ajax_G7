const template = document.createElement("template");
template.innerHTML = `
    <link rel="stylesheet" type="text/css" href="${import.meta.url.match(/.*\//)[0]}/taskbox.css"/>

    <dialog>
       <!-- Modal content -->
        <span>&times;</span>
        <div>
            <div>Title:</div><div><input type="text" size="25" maxlength="80" placeholder="Task title" autofocus/></div>
            <div>Status:</div><div><select></select></div>
        </div>
        <p><button type="submit">Add task</button></p>
     </dialog>`;

/**
  * TaskBox
  * Manage view to add a new task
  */
class TaskBox extends HTMLElement {

	constructor() {
		super();

		/**
		 * Fill in the rest of the code for the constructor
		 */
		const shadowRoot = this.attachShadow({ mode: 'open' });
		shadowRoot.appendChild(template.content.cloneNode(true));

		this.dialog = shadowRoot.querySelector('dialog');
		this.closeButton = shadowRoot.querySelector('span');
		this.addButton = shadowRoot.querySelector('button[type="submit"]');
		this.titleInput = shadowRoot.querySelector('input[type="text"]');
		this.statusSelect = shadowRoot.querySelector('select');
		this.statusesList = [];

		this.closeButton.addEventListener('click', () => this.close());
		this.dialog.addEventListener('keydown', (event) => {
			if (event.key === 'Escape') {
				this.close();
			}
		});
		this.addButton.addEventListener('click', () => this.addTask());
	}

	/**
	 * Opens the modal box of view
	 * @public
	 */
	show() {
		this.dialog.showModal();
	}

	/**
	 * Set the list of possible task states
	 * @public
	 * @param{Array<Object>} statuslist
	 */
	setStatuseslist(statuslist) {
		this.statusesList = statuslist;
		const select = this.shadowRoot.querySelector('select');
		select.innerHTML = '';
		for (const status of statuslist) {
			const option = document.createElement('option');
			option.value = status;
			option.textContent = status;
			select.appendChild(option);
		}
	}

	/**
	 * Add callback to run at click on the "Add task" button
	 * @public
	 * @param {function} callback
	 */
	newtaskCallback(callback) {
		
        this.addButton.addEventListener('click', () => {
            const title = this.titleInput.value;
            const status = this.statusSelect.value;
            const newTask = { title, status };
            callback(newTask);
        });
	}

	/**
	 * Closes the modal box
	 * @public
	 */
	close() {
		this.dialog.close();
	}
}

customElements.define('task-box', TaskBox);
