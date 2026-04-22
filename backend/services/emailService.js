const nodemailer = require("nodemailer");
require("dotenv").config();

// Configure the transporter
// Using Gmail as the default provider based on user request "yes"
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // This should be an App Password
    },
});

/**
 * Sends a general email
 */
async function sendEmail(to, subject, html) {
    try {
        const info = await transporter.sendMail({
            from: `"LearnOdys AI" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log(`Email sent to ${to}: ${info.messageId}`);
    } catch (error) {
        console.error("Error sending email:", error);
    }
}

/**
 * Sends a welcome email to a new user
 */
async function sendWelcomeEmail(to, name) {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h2 style="color: #2563eb;">Welcome to LearnOdys! 🚀</h2>
            <p>Hi <strong>${name}</strong>,</p>
            <p>Thank you for joining LearnOdys. We're excited to help you on your learning journey!</p>
            <p>Starting tomorrow, you'll receive a **Daily AI Quiz** based on the courses you select to help keep your skills sharp.</p>
            <p>Let's get started!</p>
            <div style="text-align: center; margin-top: 30px;">
                <a href="http://localhost:5000" style="background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Start Learning</a>
            </div>
        </div>
    `;
    return sendEmail(to, "Welcome to LearnOdys!", html);
}

module.exports = { sendEmail, sendWelcomeEmail };
