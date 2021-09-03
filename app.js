require("dotenv").config();
const Express = require("express");
const app = Express();
const dbConnection = require("./db");

// const swaggerJsdoc = require("swagger-jsdoc");
// const swaggerUi = require("swagger-ui-express");
// // const swaggerDocument = require('./swagger.json');

// const swaggerFile = './swagger_output.json'

app.use(require("./middleware/headers"));

const controllers = require("./controllers");

app.use(Express.json());

app.use("/user", controllers.userController);
app.use(require("./middleware/validate-jwt"));
app.use("/journal", controllers.journalController);
app.use("/profile", controllers.profileController);

// app.use(
//   "/api-docs",
//   swaggerUi.serve,
//   swaggerUi.setup(swaggerDocument)
// );

dbConnection
  .authenticate()
  .then(() => dbConnection.sync())
  .then(() => {
    app.listen(3000, () => {
      console.log(`[Server]: App is listening on 3000.`);
    });
  })
  .catch((err) => {
    console.log(`[Server]: Server crashed. Error = ${err}`);
  });
