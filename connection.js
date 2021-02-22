const mongo = require("mongodb");
const mongoose = require("mongoose");

const uri = process.env.MONGO_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
});

const stablishConnection = () => {
  const connection = mongoose.connection;
  connection.on("error", console.error.bind(console, "error in connection"));
  connection.once("open", () => {
    console.log("connect sucessfully");
  });
  return connection;
};

const createSchema = () => {
  const Schema = mongoose.Schema;
  const urlSchema = new Schema({
    original_url: { type: String, unique: true },
    short_url: { type: String, unique: true },
  });
  return urlSchema;
};

const connection = stablishConnection();
const urlSchema = createSchema();
const URL = mongoose.model("URL", urlSchema);

const createModel = (object) => new URL(object);
const findOne = async (obj) => await URL.findOne(obj).exec();
const save = async (model) => {
  try {
    return await model.save();
  } catch (err) {
    console.error("Problem to insert data");
  }
};

module.exports = { findOne, save, createModel };
