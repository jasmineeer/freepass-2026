const express = require(`express`)
const app = express()
app.use(express.json())
let walletController = require("../controllers/walletController")
const authorization = require("../middlewares/authorization")

app.post("/balance", [authorization.authorization], walletController.showBalance)
app.post("/topup", [authorization.authorization], walletController.topUp)
app.post("/payment", [authorization.authorization], walletController.payment)

module.exports = app
