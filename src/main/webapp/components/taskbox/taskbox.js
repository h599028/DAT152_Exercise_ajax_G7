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
         * Fill inn rest of code
         */
        }

        /**
         * Opens the modal box of view
         * @public
         */
        show() {
        /**
         * Fill inn rest of code
         */
        }

        /**
         * Set the list of possible task states
         * @public
         * @param{Array<Object>} statuslist
         */
        setStatuseslist(statuslist) {
        /**
         * Fill inn rest of code
         */
        }

        /**
         * Add callback to run at click on the "Add task" button
         * @public
         * @param {function} callback
         */
        newtaskCallback(callback) {
        /**
         * Fill inn rest of code
         */
        }

        /**
         * Closes the modal box
         * @public
         */
        close() {
        /**
         * Fill inn rest of code
         */
        }
}

customElements.define('task-box', TaskBox);
