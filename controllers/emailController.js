const { response } = require("express");
var nodemailer = require("nodemailer");

const send = (req, res = response) => {
  // Definimos el transporter
  var transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });
  // Definimos el email
  var mailOptions = {
    from: process.env.GMAIL_USER,
    to: "jorgedelatorredelarosa@gmail.com",
    subject: "Asunto",
    text: "Contenido del email",
  };
  // Enviamos el email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      res.status(500).send(error.message);
    } else {
      console.log("Email sent");
      res.status(200).jsonp(req.body);
    }
  });
};
//recive el email destinatario y el objeto token
const sendConfirm = (req,user, token) => {
  // Definimos el transporter
  var transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  });
  // Definimos el email
  var mailOptions = {
    from: process.env.GMAIL_USER,
    to: user.email,
    subject: "Token de Verificación de Cuenta",
    text:
      "Hola "+user.name+",\n\n" +
      "Por favor verifica tu cuenta dondo haciendo click sobre este link: \nhttp://" +
      req.headers.host +
      "/api/auth/confirmation/" +
      token.token +
      ".\n",
  };
  // Enviamos el email
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      throw "No se ha podido enviar el email.";
    } else {
      console.log("Email enviado satisfactoriamente.");
      return token;
    }
  });
};

module.exports = {
  send,
  sendConfirm,
};