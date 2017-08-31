console.log("Is script is loading..");

const RESPONSE_DONE = 4;
const STATUS_OK = 200;
const TODO_LIST_ID = "todos_list_div";
const TODO_COMPLETED_LIST_ID = "todos_complete_list__div";
const TODO_DELETED_LIST_ID = "todos_deleted_list__div";
const NEW_TODO_INPUT = "new_todo_input";


document.onload = getTodosAJAX();

function addTodoElements(todos_data_json) {

    var todos = JSON.parse(todos_data_json);
    var parentActive = document.getElementById(TODO_LIST_ID);
    var parentComplete = document.getElementById(TODO_COMPLETED_LIST_ID);
    var parentDeleted = document.getElementById(TODO_DELETED_LIST_ID);

    parentActive.innerHTML = "";
    parentComplete.innerHTML = "";
    parentDeleted.innerHTML = "";

    if(parentActive || parentComplete || parentDeleted) {

        Object.keys(todos).forEach(
            function (key) {
                var todo_element = createTodoElement(key,todos[key]);
                if(todos[key].status == "ACTIVE") {
                    parentActive.appendChild(todo_element);
                }
                else if(todos[key].status == "COMPLETE") {
                    parentComplete.appendChild(todo_element);
                }
                else if(todos[key].status == "DELETED") {
                    parentDeleted.appendChild(todo_element);
                }
            }
        )
    }
}

function createTodoElement(id,todo_object) {

    var todo_element = document.createElement("div");

    todo_element.setAttribute("data-id",id);
    todo_element.setAttribute("class","todoStatus"+todo_object.status + " " + "breathVertical");


    if(todo_object.status == "ACTIVE") {

        var complete_button = document.createElement("input");
          complete_button.setAttribute("onclick","completeTodoAJAX("+id+")");
        complete_button.setAttribute("type","checkbox");
        complete_button.setAttribute("name","delete");
        complete_button.setAttribute("class","breathHorizontal");
        todo_element.appendChild(complete_button);
        var label = document.createElement("label");
        label.innerText = todo_object.title;
        label.style.marginLeft = "5px";
        todo_element.appendChild(label);
    }
    if(todo_object.status == "COMPLETE") {

        var complete_button = document.createElement("input");
        complete_button.setAttribute("onclick","activeTodoAJAX("+id+")");
        complete_button.setAttribute("type","checkbox");
        complete_button.setAttribute("name","complete");
        complete_button.setAttribute("class","breathHorizontal");
        todo_element.appendChild(complete_button);
        var label = document.createElement("label");
        label.innerText = todo_object.title;
        label.style.marginLeft = "5px";
        todo_element.appendChild(label);
    }

    if(todo_object.status != "DELETED") {
        var complete_button = document.createElement("button");
        complete_button.innerText = "X";
        complete_button.style.marginRight = "30%";
        complete_button.style.float = "right";
        complete_button.setAttribute("onclick","deleteTodoAJAX("+id+")");
        complete_button.setAttribute("class","breathHorizontal");
        todo_element.appendChild(complete_button);
    }
    else
    {
        todo_element.innerText = todo_object.title;
    }

    return todo_element;
}

function deleteTodoAJAX(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("DELETE","/api/todos/"+id, true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var data = "todo_status=DELETED";
    xhr.onreadystatechange = function () {
        if(xhr.readyState == RESPONSE_DONE) {
            if(xhr.status == STATUS_OK) {
                addTodoElements(xhr.responseText);
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(data);
}

function completeTodoAJAX(id) {

    var xhr = new XMLHttpRequest();
    xhr.open("PUT","/api/todos/"+id, true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var data = "todo_status=COMPLETE";
    xhr.onreadystatechange = function () {
        if(xhr.readyState == RESPONSE_DONE) {
            if(xhr.status == STATUS_OK) {

                addTodoElements(xhr.responseText);
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(data);
}

function activeTodoAJAX(id) {
    var xhr = new XMLHttpRequest();
    xhr.open("PUT","/api/todos/"+id, true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
    var data = "todo_status=ACTIVE";
    xhr.onreadystatechange = function () {
        if(xhr.readyState == RESPONSE_DONE) {
            if(xhr.status == STATUS_OK) {

                addTodoElements(xhr.responseText);
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(data);
}

function getTodosAJAX() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET","/api/todos",true);
    xhr.onreadystatechange = function() {
        if(xhr.readyState == RESPONSE_DONE){
            if(xhr.status == STATUS_OK) {
                addTodoElements(xhr.responseText);
            }
        }
    }
    xhr.send(data=null);
}

function addTodoAJAX() {

    var title = document.getElementById(NEW_TODO_INPUT).value;
    var xhr = new XMLHttpRequest();
    xhr.open("POST","/api/todos", true);
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");

    var data = "todo_title=" + encodeURI(title);

    xhr.onreadystatechange = function () {
        if(xhr.readyState == RESPONSE_DONE) {
            if(xhr.status == STATUS_OK) {
                addTodoElements(xhr.responseText);
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }
    xhr.send(data);
}

function hideCompletedItems() {

   document.getElementById(TODO_COMPLETED_LIST_ID).style.visibility = "hidden";

}

function hideDeletedItems() {

}
