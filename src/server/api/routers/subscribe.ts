// app/api/subscribe/route.ts
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"FETS — Food Expire Tracker" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Welcome to FETS Business Insights",
      html: `
        <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; padding: 0; background: #ffffff;">

          <!-- Header -->
          <div style="background: #f97316; padding: 32px 24px; border-radius: 12px 12px 0 0; text-align: center;">
            <img src="${process.env.NEXT_PUBLIC_BASE_URL}/logo.png" alt="FETS" style="width: 64px; height: 64px; border-radius: 14px; background: white; padding: 4px; margin-bottom: 12px;" />
            <h1 style="font-size: 22px; font-weight: 800; color: #ffffff; margin: 0;">Welcome to FETS!</h1>
            <p style="font-size: 13px; color: rgba(255,255,255,0.85); margin: 6px 0 0;">Food Expire Tracker System</p>
          </div>

          <!-- Card Body -->
          <div style="background: #fafaf8; border: 1px solid #e8e6e0; border-top: none; border-radius: 0 0 12px 12px; padding: 32px 24px;">

            <p style="font-size: 15px; color: #1a1814; font-weight: 700; margin: 0 0 8px;">You're officially subscribed 🎉</p>
            <p style="font-size: 14px; color: #4a4742; line-height: 1.7; margin: 0 0 24px;">
              Thank you for joining the FETS community. You'll now receive the latest tips, updates, and insights straight to your inbox.
            </p>

            <!-- Divider -->
            <hr style="border: none; border-top: 1px solid #e8e6e0; margin: 0 0 24px;" />

            <!-- What to expect -->
            <p style="font-size: 12px; font-weight: 700; color: #a0998a; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 14px;">What to expect</p>

            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 14px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 8px; margin-bottom: 8px; display: block; margin-bottom: 8px;">
                  <span style="font-size: 16px;"></span>
                  <strong style="font-size: 13px; color: #1a1814; display: block; margin-top: 4px;">Inventory Tips</strong>
                  <span style="font-size: 12px; color: #6b6560;">Smart ways to manage and organize your stock.</span>
                </td>
              </tr>
              <tr><td style="height: 8px;"></td></tr>
              <tr>
                <td style="padding: 10px 14px; background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; display: block; margin-bottom: 8px;">
                  <span style="font-size: 16px;"></span>
                  <strong style="font-size: 13px; color: #1a1814; display: block; margin-top: 4px;">Expiry Alerts & Insights</strong>
                  <span style="font-size: 12px; color: #6b6560;">Stay ahead of spoilage and reduce waste.</span>
                </td>
              </tr>
              <tr><td style="height: 8px;"></td></tr>
              <tr>
                <td style="padding: 10px 14px; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; display: block;">
                  <span style="font-size: 16px;"></span>
                  <strong style="font-size: 13px; color: #1a1814; display: block; margin-top: 4px;">Product Updates</strong>
                  <span style="font-size: 12px; color: #6b6560;">Be the first to know about new FETS features.</span>
                </td>
              </tr>
            </table>

            <!-- CTA -->
            <div style="text-align: center; margin-top: 28px;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}" style="display: inline-block; background: #f97316; color: #ffffff; font-size: 14px; font-weight: 700; padding: 12px 28px; border-radius: 8px; text-decoration: none;">
                Visit FETS →
              </a>
            </div>

            <!-- Footer -->
            <hr style="border: none; border-top: 1px solid #e8e6e0; margin: 28px 0 16px;" />
            <p style="font-size: 11px; color: #a0998a; text-align: center; margin: 0;">
              © ${new Date().getFullYear()} Food Expire Tracker System (FETS) · Built for a sustainable future.<br/>
              You're receiving this because you subscribed at fets.app
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ message: "You're subscribed! Check your inbox for a welcome email." });
  } catch (err) {
    console.error("Email send error:", err);
    return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 500 });
  }
}