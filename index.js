// Reloads all tasks from localStorage on page load and displays them
(function reloadMyTasksFromLocalStorage() {
  let locallyStoredTasks = retrieveTasksFromLocalStorage();
  if (locallyStoredTasks) {
    locallyStoredTasks.forEach(item => {
      createTaskNote(item);
    });
  }
})();

/**
 * Submits the form values while preventing the default unwanted event of the form
 * @param {Object} event - Object that contains the information about the action that just happened
 */
function onSubmitTaskForm(event) {
  event.preventDefault();

  let userTaskElement = document.getElementById("userTask");
  let userFinalDateElement = document.getElementById("userFinalDate");
  let userTimePeriod = document.getElementById("userTimePeriod").value;

  performValidations(userTaskElement, userFinalDateElement);
  let taskObject = processTaskObject(
    userTaskElement.value,
    userFinalDateElement.value,
    userTimePeriod
  );
  createTaskNote(taskObject);
}

/**
 * Function which manages all validations
 * @param {Object} userTaskElement - Object that contains the description input element for the task and its value
 * @param {Object} userFinalDateElement - Object that contains the date input element for the task and its value
 */
function performValidations(userTaskElement, userFinalDateElement) {
  validateTaskDescription(userTaskElement);
  validateDatePattern(userFinalDateElement);
}

/**
 * Performs validation on the task's description
 * @param {Object} userTaskElement - Object that contains the description input element for the task and its value
 */
function validateTaskDescription(userTaskElement) {
  if (userTaskElement.value.trim() == "") {
    userTaskElement.classList.add("errorClass");
    displayErrorMessage("Please enter a task");
    throw new Error("Invalid Task Description");
  } else {
    userTaskElement.classList.remove("errorClass");
    displayErrorMessage("");
  }
}

/**
 * Validates the pattern of the given date - Year/Month/Day
 * @param {Object} userFinalDateElement - Object that contains the date input element for the task and its value
 */
function validateDatePattern(userFinalDateElement) {
  // Regex pattern
  let pattern = /^(20)[1-4][0-9][\/](?:(?:0[1-9]|1[0-2])[\/](?:0[1-9]|1[0-9]|2[0-9])|(?:(?!02)(?:0[1-9]|1[0-2])[\/](?:30))|(?:(?:0[13578]|1[02])-31))$/;
  if (!pattern.test(userFinalDateElement.value)) {
    userFinalDateElement.classList.add("errorClass");
    displayErrorMessage("Invalid Date (2010-2040)");
    throw new Error("Invalid Date, must be between the years 2010-2040");
  } else {
    userFinalDateElement.classList.remove("errorClass");
    displayErrorMessage("");
  }
}

/**
 * Function which manages the display of all errors
 * @param {String} errorMessage - Contains an error message regarding the issue
 */
function displayErrorMessage(errorMessage) {
  let errorMessagesSpan = document.getElementById("errorMessagesSpan");
  if (errorMessage != "") {
    errorMessagesSpan.innerText = errorMessage;
    errorMessagesSpan.classList.remove("noErrorPadding");
  } else {
    errorMessagesSpan.innerText = "";
    errorMessagesSpan.classList.add("noErrorPadding");
    console.clear();
  }
}

/**
 * On reset, clear all existing errors in the form
 */
function onResetFormClearErrors() {
  document.getElementById("userTask").classList.remove("errorClass");
  document.getElementById("userFinalDate").classList.remove("errorClass");
  displayErrorMessage("");
}

/**
 * Turns the first letter of the parameter's (task's) value to a capital letter
 * @param {String} value - Any kind of string, in this case the user's description for the task
 * @returns {String} - An edited string version of the given parameter
 */
function capitalizeFirstLetter(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Generates a new ID for each note for better accessibility
 * @returns {String} - newly created ID
 */
function generateNewID() {
  let index = localStorage.getItem("id");
  if (!index) {
    index = 0;
  }
  index++;
  localStorage.setItem("id", index);
  return index;
}

/**
 * Function which manages the process of the object
 * @param {String} userTaskValue - User's description for the task
 * @param {String} userFinalDate - User's final date for the task
 * @param {Object} userTimePeriod - Object that contains the user's time period for the task
 * @returns {Object} - Object that contains all the task's information
 */
function processTaskObject(userTaskValue, userFinalDate, userTimePeriod) {
  let taskObject = createTaskObject(
    capitalizeFirstLetter(userTaskValue),
    userFinalDate,
    userTimePeriod
  );
  saveTaskInLocalStorage(taskObject);
  return taskObject;
}

/**
 * Saves all the given parameters in one object
 * @param {String} userTaskValue - User's description for the task
 * @param {String} userFinalDate - User's final date for the task
 * @param {Object} userTimePeriod - Object that contains the user's time period for the task
 * @returns {Object} - Object that contains all the task's information
 */
function createTaskObject(userTaskValue, userFinalDate, userTimePeriod) {
  return {
    task: userTaskValue,
    date: userFinalDate,
    time: userTimePeriod,
    id: generateNewID()
  };
}

/**
 * Declaring an array to contain my tasks to save them in localStorage - "tasks"
 * @param {Object} taskObject - Object that contains all the task's information
 */
function saveTaskInLocalStorage(taskObject) {
  let myTasks = retrieveTasksFromLocalStorage();
  myTasks.push(taskObject);
  localStorage.setItem("tasks", JSON.stringify(myTasks));
}

/**
 * Resets the form input values on submit
 */
function onSubmitClearForm() {
  document.getElementById("taskForm").reset();
}

/**
 * Retrieves all tasks from the localStorage, if none returns false
 * @returns {Array} - Empty array if nothing is stored in localStorage
 * @returns {Object} - JSON object of an array that contains all taskObjects from localStorage
 */
function retrieveTasksFromLocalStorage() {
  let locallyStoredTasks = localStorage.getItem("tasks");
  if (!locallyStoredTasks) {
    return [];
  }
  return JSON.parse(locallyStoredTasks);
}

/**
 * This function manages the creation of the note with the sent parameter which contains the task details
 * @param {Object} taskObject - Object that contains all the task's information
 */
function createTaskNote(taskObject) {
  let taskNoteDiv = document.createElement("div");
  taskNoteDiv.classList.add("noteClass", "fadeIn");

  let taskDescriptionDiv = createTaskDescriptionDiv(taskObject);
  let taskDateDiv = createTaskDateDiv(taskObject);
  let taskTimeDiv = createTaskTimeDiv(taskObject);
  let removeButton = createRemoveButton(taskObject, taskNoteDiv);
  let removeButtonSpan = createRemoveButtonSpan(taskObject);

  removeButton.appendChild(removeButtonSpan);
  taskNoteDiv.appendChild(taskDescriptionDiv);
  taskNoteDiv.appendChild(taskDateDiv);
  taskNoteDiv.appendChild(taskTimeDiv);
  taskNoteDiv.appendChild(removeButton);

  // Inserts the content before the previous child / beginning of the element
  document.getElementById("myNotes").prepend(taskNoteDiv);
}

/**
 * Creates a div for the description of the task
 * @param {Object} taskObject - Object that contains all the task's information
 * @returns {Object} - An object which contains the div for the task's description and its value
 */
function createTaskDescriptionDiv(taskObject) {
  let taskDescriptionDiv = document.createElement("div");
  taskDescriptionDiv.className = "taskDescriptionClass";
  taskDescriptionDiv.innerHTML = taskObject.task;
  taskDescriptionDiv.id = taskObject.id;
  return taskDescriptionDiv;
}

/**
 * Creates a div for the date of the task
 * @param {Object} taskObject - Object that contains all the task's information
 * @returns {Object} - An object which contains the div for the task's due date and its value
 */
function createTaskDateDiv(taskObject) {
  let taskDateDiv = document.createElement("div");
  taskDateDiv.className = "taskDateClass";
  taskDateDiv.innerHTML = taskObject.date;
  taskDateDiv.id = taskObject.id;
  return taskDateDiv;
}

/**
 * Creates a div for the time of the task
 * @param {Object} taskObject - Object that contains all the task's information
 * @returns {Object} - An object which contains the div for the task's time period and its value
 */
function createTaskTimeDiv(taskObject) {
  let taskTimeDiv = document.createElement("div");
  taskTimeDiv.className = "taskTimeClass";
  taskTimeDiv.innerHTML = taskObject.time;
  taskTimeDiv.id = taskObject.id;
  return taskTimeDiv;
}

/**
 * Creates the remove button (X symbol) for the note
 * @param {Object} taskObject - Object that contains all the task's information
 * @param {Object} taskNoteDiv - Object that contains all elements related to the task note
 * @returns {Object} - An object which contains the remove button for the note
 */
function createRemoveButton(taskObject, taskNoteDiv) {
  let removeButton = document.createElement("button");
  removeButton.className = "removeButtonClass";
  removeButton.id = taskObject.id;

  if (!taskObject.time) {
    removeButton.style.bottom = "170px";
  }

  /**
   * Setting an onclick event with arrow function which uses the map() method to iterate through the array items
   * by index, and delete the specific note (item) clicked on if it matches an ID inside our task object
   */
  removeButton.onclick = () => {
    let myTasks = retrieveTasksFromLocalStorage();

    myTasks.map((item, index) => {
      if (item.id == removeButton.id) {
        // Removes the item from the array myTasks
        myTasks.splice(index, 1);
        taskNoteDiv.classList.remove("fadeIn");
        taskNoteDiv.classList.add("fadeOut");

        setTimeout(() => {
          taskNoteDiv.parentNode.removeChild(taskNoteDiv);
        }, 1500);
      }
    });

    // Upon removal, update the localStorage
    uponRemovalUpdateLocalStorage(myTasks);
  };
  return removeButton;
}

/**
 * Creates a span for the remove button with glyphicon (X symbol)
 * @param {Object} taskObject - Object that contains all the task's information
 * @returns {Object} - An object which contains a span used for the remove button
 */
function createRemoveButtonSpan(taskObject) {
  let removeButtonSpan = document.createElement("span");
  removeButtonSpan.className = "glyphicon glyphicon-remove";
  removeButtonSpan.id = taskObject.id;
  return removeButtonSpan;
}

/**
 * Updates the localStorage with every change
 * @param {Array} myTasks - Array of saved tasks(objects)
 */
function uponRemovalUpdateLocalStorage(myTasks) {
  localStorage.setItem("tasks", JSON.stringify(myTasks));
}
