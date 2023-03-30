const mongoose = require("mongoose");
const validadeMongoDbId = (id) => {

    const isValid = mongoose.Types.ObjectId.isValid(id);
    if (!isValid) throw new Error("This Id is not Valid or Found")
}

module.exports = validadeMongoDbId;