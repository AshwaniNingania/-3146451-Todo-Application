var express = require("express");
var app = express();
var body_parser = require("body-parser");
var todo_db = require("./seedDatabase");

app.use("/", function (req,res,next) {
    //console.log(req.url);
    next();
});
app.use("/",express.static(__dirname+"/public"));
app.use("/",body_parser.urlencoded({extended:false}));

app.get("/api/todos", function (req,res) {              // get all todo
    res.json(todo_db.todos);
});
app.delete("/api/todos/:id", function (req,res) {

    var del_id = req.params.id;
    var todo = todo_db.todos[del_id];

    if(!todo) {
        res.status(400).json({error: "Todo doesn't exist."})
    }
    else {
        todo.status = todo_db.StatusENUMS.DELETED;
        res.json(todo_db.todos);
    }

});
app.post("/api/todos", function (req,res) {

    var todo = req.body.todo_title;
    if(!todo || todo == "" || todo.trim() == "") {
        res.status(400).json({error: "Todo title can't be blank."})
    }
    else {
        var new_todo_object = {
            title : req.body.todo_title,
            status : todo_db.StatusENUMS.ACTIVE
        };
        todo_db.todos[todo_db.next_todo_id++] = new_todo_object;

        res.json(todo_db.todos);
    }
});
app.put("/api/todos/:id", function (req,res) {

    var mod_id = req.params.id;
    var todo = todo_db.todos[mod_id];

    if(!todo) {
        res.status(400).json({error: "Can't modify a todo that doesn't exist."})
    }
    else {

        var todo_title = req.body.todo_title;

        if(todo_title && todo_title != "" && todo_title.trim() != "") {
            todo.title = todo_title;
        }

        var todo_status = req.body.todo_status;

        if(todo_status &&
            (todo_status == todo_db.StatusENUMS.ACTIVE || todo_status == todo_db.StatusENUMS.COMPLETE)) {
            todo.status = todo_status;
        }
        // console.log(todo);
        todo_db.todos[mod_id] = todo;
        res.json(todo_db.todos);
    }

});
app.put("/api/todos/complete/:id", function (req,res) {
    var mod_id = req.params.id;
    var todo = todo_db.todos[mod_id];

    if(!todo) {
        res.status(400).json({error: "Can't modify a todo that doesn't exist."})
    }
    else {

        todo.status = todo_db.StatusENUMS.COMPLETE;

        todo_db.todos[mod_id] = todo;
        res.json(todo_db.todos);
    }

});
app.put("/api/todos/active/:id", function (req,res) {
    var mod_id = req.params.id;
    var todo = todo_db.todos[mod_id];

    if(!todo) {
        res.status(400).json({error: "Can't modify a todo that doesn't exist."})
    }
    else {

        todo.status = todo_db.StatusENUMS.ACTIVE;

        todo_db.todos[mod_id] = todo;
        res.json(todo_db.todos);
    }

});
app.get("/api/todos/active", function (req,res) {
    var db = {};
    for(var i in todo_db.todos)
    {
        if(todo_db.todos[i].status === todo_db.StatusENUMS.ACTIVE)
        {
            db[i] = todo_db.todos[i];
        }
    }
    res.send(db);
});
app.get("/api/todos/complete", function (req,res) {
    var db = {};
    for(var i in todo_db.todos)
    {
        if(todo_db.todos[i].status === todo_db.StatusENUMS.COMPLETE)
        {
            db[i] = todo_db.todos[i];
        }
    }
    res.send(db);

});
app.get("/api/todos/deleted", function (req,res) {
    var db = {};
    for(var i in todo_db.todos)
    {
        if(todo_db.todos[i].status === todo_db.StatusENUMS.DELETED)
        {
            db[i] = todo_db.todos[i];
        }
    }
    res.send(db);
});

app.listen(3000);