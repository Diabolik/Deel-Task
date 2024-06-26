const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./model");
const { getProfile } = require("./middleware/getProfile");
const app = express();
app.use(bodyParser.json());
app.set("sequelize", sequelize);
app.set("models", sequelize.models);

const adminRoutes = require("./routes/admin.routes");
const contractRoutes = require("./routes/contract.routes");
const jobRoutes = require("./routes/job.routes");
const balanceRoutes = require("./routes/balance.routes");

app.use("/admin", adminRoutes);
app.use("/contracts", contractRoutes);
app.use("/jobs", jobRoutes);
app.use("/balances", balanceRoutes);

module.exports = app;
    