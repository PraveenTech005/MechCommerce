const mongoose = require("mongoose")

const VehicleSchema = new mongoose.Schema({
    brand: {
        type: "String",
        required: true,
        unique: true
    },
    model: {
        type: ["String"],
        required: true
    }
})


const Vehicle = mongoose.model("Vehicle", VehicleSchema)

module.exports = Vehicle