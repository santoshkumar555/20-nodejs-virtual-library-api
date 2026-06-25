import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (options) => {
  try {
    await resend.emails.send({
      from: "Library Support <onboarding@resend.dev>",
      to: options.to || options.email,
      subject: options.subject,
      text: options.text || options.message,
      html: options.html,
    });
    console.log(`Email sent to: ${options.to || options.email}`);
  } catch (error) {
    console.error("Email failed:", error.message);
    throw error;
  }
};

export default sendEmail;
``