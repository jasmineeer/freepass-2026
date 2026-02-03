const express = require(`express`)
const app = express()
app.use(express.json())
let menuController = require("../controllers/menuController")
const authorization = require("../middlewares/authorization")

app.post("/", [authorization.authorization], menuController.addMenu)
app.put("/:id_menu", [authorization.authorization], menuController.updateMenu)
app.delete("/:id_menu", [authorization.authorization], menuController.deleteMenu)

module.exports = app
