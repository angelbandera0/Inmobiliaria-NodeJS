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
    to: "banderaangel971114@gmail.com",
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

module.exports = {
  send,
};

