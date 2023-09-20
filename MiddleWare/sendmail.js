const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

function Otpcreator() {
  let r = Math.random();
  r = Math.round(r * 1000 + 1000);
  return r;
}
const Client_ID = process.env.Client_string;
const Client_SECRET = process.env.Client_secret_string;
const Redirect_URI = process.env.Redirect_string;
const Refresh_TOKEN = process.env.Refresh_string_token;

const oAuth2CLient = new google.auth.OAuth2(
  Client_ID,
  Client_SECRET,
  Redirect_URI
);

oAuth2CLient.setCredentials({
  refresh_token: Refresh_TOKEN,
});

const SendMail = async (clientMail, otp) => {
  try {
    const accessToken = await oAuth2CLient.getAccessToken();
    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAUTH2",
        user: "swiftrentalsofficial@gmail.com",
        clientId: Client_ID,
        clientSecret: Client_SECRET,
        refreshToken: Refresh_TOKEN,
        accessToken: accessToken,
      },
    });
    if (otp !== undefined) {
      const mailoptions = {
        from: "SwiftRentals 🚗 <swiftrentalsofficial@gmail.com> ",
        to: clientMail,
        subject: "SwiftRentals",
        text: `Your code is ${otp}`,
        html: `<h1>SwiftRentals</h1> <h2>Code:</h2><h3>Your code is ${otp}</h3>`,
      };
      const result = await transport.sendMail(mailoptions);
      return result;
    } else {
      const mailoptions = {
        from: "SwiftRentals 🚗 <swiftrentalsofficial@gmail.com> ",
        to: clientMail,
        subject: "SwiftRentals - Thank You for Your Reservation Request",
        text: `Your Reservation Has bee`,
        html: `<h1>SwiftRentals</h1><br>
          <p>I hope this message finds you <b> well</b>. I wanted to express my sincere gratitude for your interest in SwiftRentals and for considering us for your car rental needs.</p>
          <p>To clarify, SwiftRentals is primarily a platform designed for showcasing my portfolio as a web developer and designer. It is not a real car rental service. Your reservation request, while not applicable in this context, is genuinely appreciated as it allows me to demonstrate the user experience and functionality of the website.</p>
          <p>Your interest means a lot to me, and I'm here to answer any questions you might have about the website, its features, or any other inquiries related to my portfolio .Please feel free to reach out with any queries, and I'll be more than happy to assist you.</p>
          <h2>Best regards,</h2>
          <h1>swiftrentalsofficial@gmail.com</h1>
        `,
      };
      const result = await transport.sendMail(mailoptions);
    }
  } catch (error) {
    return "Enter a valid Email", error;
  }
};

module.exports = {
  SendMail: SendMail,
  otp: Otpcreator,
};
