const nodemailer = require("nodemailer");
const getRupiahFormat = require("./getRupiahFormat");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "benpardede3@gmail.com",
    pass: "psrk vmni jida zkod",
  },
});

const sendCheckoutEmail = async (orderDetails, recipientEmail) => {
  const mailOptions = {
    from: "benpardede3@gmail.com",
    to: recipientEmail,
    subject: "Order Confirmation",
    html: `
      <h2>Order Confirmation</h2>
      <p><strong>Order ID:</strong> ${orderDetails.id}</p>
      <h3>Order Details:</h3>
      <ul>
        ${orderDetails.items.map((item) => `<li>${item.name} - ${item.quantity} x ${getRupiahFormat(item.price)}</li>`).join("")}
      </ul>
      <h3>Total: ${getRupiahFormat(orderDetails.totalPrice)}</h3>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Checkout email sent to: ", process.env.EMAIL_USER);
  } catch (error) {
    console.log("Error sending email: ", error);
  }
};

module.exports = { sendCheckoutEmail };
