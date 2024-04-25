//send email package
const sgMail = require('@sendgrid/mail');

//Add API KEY to config.env file
sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
const sendEmail = async (from, to, subject, title, html) => {
  const msg = {
    to: to,
    from: from,
    subject: subject,
    text: title, //use as title
    html: html,
  };
  try {
    await sgMail.send(msg);
    console.log(msg);
  } catch (error) {
    console.error(error);
    if (error.response) {
      throw new Error(error.response.body);
      //   console.error(error.response.body);
    }
  }
};

module.exports = sendEmail;
