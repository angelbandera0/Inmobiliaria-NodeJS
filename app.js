//envairoments var
require("dotenv").config();

//var
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const fileUpload = require("express-fileupload");
const compression = require("compression");

//import routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const buscarRouter = require("./routes/buscar");
const casasRouter = require("./routes/casas");
const authRouter = require("./routes/auth");
const solicitudRouter = require("./routes/solicitud");
const likesRouter = require("./routes/likes");
const citasRouter = require("./routes/cita");
const emailRouter = require("./routes/email");

//import db
const { dbConnection } = require("./database/config");
const { initRolesDB } = require("./controllers/roleController");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

//middlewares
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(compression()); // compress all responses
app.use(express.static(path.join(__dirname, "dist"))); //angular production

// Fileupload - Carga de archivos
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    createParentPath: true,
  })
);

//routes
app.use("/", indexRouter);
app.use("/api/users", usersRouter);
app.use("/api/casa", casasRouter);
app.use("/api/auth", authRouter);
app.use("/api/solicitud", solicitudRouter);
app.use("/api/buscar", buscarRouter);
app.use("/api/like", likesRouter);
app.use("/api/cita", citasRouter);
app.use("/api/email", emailRouter);

// Conectar a la DB
dbConnection();
//carga los roles a la DB
initRolesDB();

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/dist/index.html"));
});
/*// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send({error:err});
});*/

module.exports = app;
