const express = require(`express`)
const app = express()
app.use(express.json())
let userController = require("../controllers/userController")
const authorization = require("../middlewares/authorization")

app.get("/", [authorization.authorization], userController.getUser)
app.post("/search", [authorization.authorization], userController.findUser)
app.post("/users", userController.addUsers)
app.post("/owners", [authorization.authorization], userController.addOwners)
app.put("/users/:id_user", [authorization.authorization], userController.updateUsers)
app.put("/owners/:id_user", [authorization.authorization], userController.updateOwners)
app.delete("/users/:id_user", [authorization.authorization], userController.deleteUsers)
app.delete("/owners/:id_user", [authorization.authorization], userController.deleteOwners)
app.post("/login", userController.authentication)

module.exports = app
