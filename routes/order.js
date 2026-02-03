const express = require(`express`)
const app = express()
app.use(express.json())
let orderController = require("../controllers/orderController")
const authorization = require("../middlewares/authorization")

app.get("/", [authorization.authorization], orderController.getOrders)
app.post("/", [authorization.authorization], orderController.addOrder)
app.put("/:id_order", [authorization.authorization], orderController.updateStatus)

module.exports = app
