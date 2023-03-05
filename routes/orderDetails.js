var express = require("express");
var router = express.Router();
const { default: mongoose } = require("mongoose");
const { mongodb, dbName, dbUrl } = require("../config/dbConfig");
const { orderDetail } = require("../Schema/OrderedDetails");
mongoose.set("strictQuery", false);
mongoose.connect(dbUrl);
router.get("/details", async (req, res) => {
  try {
    let users = await orderDetail.find();
    res.send({ statusCode: 200, users });
  } catch (err) {
    res.send({ statusCode: 500, message: "Internal server in error" });
  }
});
router.post("/add_details", async (req, res) => {
  try {
    console.log(req.body);
    let newDetails = await orderDetail.create(req.body);
    res.send({ statusCode: 200, message: "Data added successfully" });
  } catch (error) {
    console.log("my error ", error);
    res.send({ statusCode: 400, message: "Error in adding" });
  }
});
router.put("/update-status/:id", async (req, res) => {
  try {
    console.log(req.body.orderedProducts);
    let userExist = await orderDetail.findOne({ _id: req.params.id });
    if (userExist) {
      let updateValues = await orderDetail.findByIdAndUpdate(req.params.id, {
        orderedProducts: req.body.orderedProducts,
      });
      res.send({ statusCode: 200, message: "Updated" });
    } else {
      res.send({ statusCode: 202, message: "Id mismatch" });
    }
  } catch (error) {
    res.send({ statusCode: 400, message: "Please try again" });
  }
});
module.exports = router;
