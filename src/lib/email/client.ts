import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (transporter) return transporter;

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  return transporter;
}

export async function sendMail(params: { to: string; subject: string; html: string }) {
  if (!process.env.SMTP_HOST) {
    console.warn(`[email] SMTP not configured, skipping email to ${params.to}: ${params.subject}`);
    return;
  }

  try {
    await getTransporter().sendMail({
      from: process.env.SMTP_FROM ?? "Hotel Nirvana Nest <no-reply@hotelnirvananest.com>",
      to: params.to,
      subject: params.subject,
      html: params.html,
    });
  } catch (error) {
    console.error("[email] failed to send", error);
  }
}
