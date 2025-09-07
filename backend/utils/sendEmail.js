import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, 
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html, attachments = []) => {
  try {
    await transporter.sendMail({
      from: `"CampusPass System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
      attachments,
    });
  } catch (err) {
    console.error("Error sending email:", err.message);
  }
};

