const { CONSTANTS } = require("@firebase/util");
const express = require("express");
const router = express.Router();
const { ref, set, push, get, update } = require("firebase/database");
const database = require("../firebase/config");

router.post("/addTodo", async function (request, response) {
  try {
    if (!request.body || !request.body.register_date)
      throw new Error("requset data is invalid");
    const todoRef = ref(database, "todos/" + request.body.register_date);
    const newTodoRef = push(todoRef);

    set(newTodoRef, request.body)
      .then((result) => {
        response.status(200).send({
          message: "request success!",
          body: request.body,
        });
      })
      .catch((error) => {
        throw new Error(error);
      });
  } catch (error) {
    response.status(404).send({
      message: "request is failed" + error,
      body: null,
    });
  }
});

router.get("/getTodos", async function (request, response) {
  try {
    const register_date = request.query.register_date;
    if (!register_date) throw new Error("register_date is required");
    const todoRef = ref(database, "todos/" + register_date);
    let todos = await get(todoRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          let todos = snapshot.val();
          return todos;
        } else {
          return [];
        }
      })
      .catch((error) => {
        throw new Error(error);
      });

    response.status(200).send({
      message: "Requset is success",
      body: todos,
    });
  } catch (error) {
    response.status(400).send({
      message: "here...request is failed" + error,
      body: null,
    });
  }
});

router.delete("/deleteTodo", async function (request, response) {
  try {
    if (!request.body.id || !request.body.register_date)
      throw new Error("id and register_date are required");

    const todoRef = ref(
      database,
      "todos/" + request.body.register_date + "/" + request.body.id
    );
    set(todoRef, null).then((result) => {
      response.send({
        message: "request success!",
        body: null,
      });
    });
    response.status(200).send({
      message: "Requset is success",
      body: todos,
    });
  } catch (error) {
    response.status(400).send({
      message: "request is failed" + error,
      body: null,
    });
  }
});
router.post("/update/checked", async function (request, response) {
  try {
    if (!request.body.id || !request.body.register_date)
      throw new Error("id and register_date are required");

    const todoRef = ref(
      database,
      "todos/" + request.body.register_date + "/" + request.body.id
    );
    console.log(request.body);
    await update(todoRef, { checked: request.body.checked });
    response.status(200).send({
      message: "Requset is success",
      body: request.body.id,
    });
  } catch (error) {
    console.log(error);
    response.status(200).send({
      message: "request is failed. " + error,
      body: null,
    });
  }
});

module.exports = router;
