const express = require(`express`)
const app = express()
app.use(express.json())
let canteenController = require("../controllers/canteenController")
const authorization = require("../middlewares/authorization")

app.get("/", [authorization.authorization], canteenController.getCanteen)
app.get("/:id_canteen", [authorization.authorization], canteenController.getCanteenById)
app.get("/feedback", [authorization.authorization], canteenController.getFeedback)
app.post("/feedback", [authorization.authorization], canteenController.addFeedback)
app.delete("/feedback/:id_feedback", [authorization.authorization], canteenController.deleteFeedback)

module.exports = app
