import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

interface JobApplicationData {
  job: {
    Title: string;
    Employment_type: string;
    Experience_level: string;
    Job_Location: string;
    Work_Mode: string;
    Questions?: string[];
    email?: string | string[];
  };
  answers: string[];
  file: {
    filename: string;
    content: string; // base64
    content_type: string;
    size: number;
  };
  recipientList: string[];
}

export async function POST(request: NextRequest) {
  try {
    const { job, answers, file, recipientList } =
      (await request.json()) as JobApplicationData;

    // Validation
    if (!job || !answers || !file || !recipientList.length) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Email configuration
    const EMAIL_HOST_USER = process.env.EMAIL_HOST_USE;
    const EMAIL_HOST_PASSWORD = process.env.EMAIL_HOST_PASSWORD;

    if (!EMAIL_HOST_USER || !EMAIL_HOST_PASSWORD) {
      return NextResponse.json(
        { error: "Email credentials not configured" },
        { status: 500 },
      );
    }

    // Create questions array
    const questions = [
      "What is your Name?",
      "What is Your Email?",
      ...(job.Questions || []),
    ];

    // Email template (moved to backend)
    const emailTemplate = `
    <!-- Root Wrapper -->
    <div style="max-width: 680px; margin: 0 auto; background: #fff; border-radius: 14px; font-family: 'Inter', 'Segoe UI', Arial, Helvetica, sans-serif; color: #222; box-shadow: 0 4px 32px 0 rgba(44,62,80,.07); overflow: hidden;">
      
      <!-- Header -->
      <div style="background: #0c2f56; padding: 32px 36px 20px 36px;">
        <h1 style="margin: 0; font-size: 2.1em; color: #fff; font-weight: 700; letter-spacing: -0.4px;">New Application for <span style="color: #47b6ff;">${job.Title}</span></h1>
        <p style="margin: 8px 0 0; color: #e9eef3; font-size: 1.08em;">${job.Employment_type} • ${job.Experience_level}</p>
        <p style="margin: 0; margin-top: 7px; color: #c9d5ee; font-size: 0.98em;">${job.Job_Location} • ${job.Work_Mode}</p>
        <p style="margin: 0; color: #54d2d2; font-size: 0.98em; margin-top: 10px;">
          <b style="opacity: .79">Received:</b> ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      <!-- Body/Summary -->
      <div style="padding: 36px; background: #f7fafd;">
        <div style="margin-bottom: 14px;">
          <p style="font-size: 1.11em; margin: 0 0 4px 0; color: #0c2f56;">👤 <b>Candidate</b>&nbsp; responses</p>
        </div>
        <table style="background: #fff; border-radius: 10px; width: 100%; border-collapse: separate; border-spacing: 0 14px;">
          <tbody>
            ${questions
              .map(
                (q, i) => `
                <tr style="box-shadow: 0 1.5px 12px 0 rgba(30,95,165,0.04);">
                  <td style="padding: 14px 22px 10px 0; min-width: 120px; font-weight: 500; color: #222; font-size: 1.06em;">${q}</td>
                  <td style="padding: 14px 0 10px 0; color: #414b65; font-size: 1.06em; line-height: 1.45; border-bottom: 1px solid #f1f5fa;">
                    ${answers[i]?.replace(/\n/g, "<br>") || '<span style="opacity:.64;">No answer provided</span>'}
                  </td>
                </tr>
              `,
              )
              .join("")}
          </tbody>
        </table>
        
        <div style="margin: 40px 0 22px 0;">
          <p style="font-size: 1.08em; color: #0c2f56; margin-bottom: 8px;"><b>Job Details</b></p>
          <table style="background: #f6fafd; border-radius: 10px; width: 100%; border-collapse: collapse;">
            <tbody style="font-size:1.05em;">
              ${Object.entries({
                Position: job.Title,
                "Experience Level": job.Experience_level,
                "Employment Type": job.Employment_type,
                "Work Mode": job.Work_Mode,
                Location: job.Job_Location,
              })
                .map(
                  ([label, value]) => `
                  <tr>
                    <td style="padding: 10px 18px 5px 0; color: #7d889e; min-width:170px;">${label}</td>
                    <td style="padding: 10px 0 5px 0; color: #24324b; font-weight: 500;">${value}</td>
                  </tr>
                `,
                )
                .join("")}
              <!-- CV -->
              <tr>
                <td style="padding: 10px 18px 10px 0; color: #7d889e; min-width:170px;">CV Attachment</td>
                <td style="padding: 10px 0 10px 0; color: #3267a8;">
                  <span style="display: inline-block; background: #e9f5fe; color: #2476e4; border-radius: 7px; padding: 7px 13px; font-family:monospace; font-size: 0.97em;">
                    ${file.filename} <span style="opacity:.7; font-size:0.92em;">(${(file.size / 1024).toFixed(2)} KB)</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Footer -->
      <div style="background:#f6fafd; padding: 18px 30px; text-align: center; font-size:1em; border-top:1px solid #e6eaf3;">
        <span style="color: #91a0ba;">Sent via <a href="https://getsetdeployed.com/" target="_blank" style="color:#258cff; text-decoration:none; font-weight:500;">GetSetDeployed</a>
        </span>
      </div>
    </div>
    `;

    // Prepare attachment
    const attachment = {
      filename: file.filename,
      content: Buffer.from(file.content, "base64"),
      contentType: file.content_type,
    };

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: EMAIL_HOST_USER,
        pass: EMAIL_HOST_PASSWORD,
      },
      debug: false,
      logger: false,
    });

    // Verify SMTP connection
    try {
      await transporter.verify();
      console.log("SMTP server is ready to send emails");
    } catch (error) {
      console.error("SMTP connection error:", error);
      return NextResponse.json(
        { error: "Email server connection failed" },
        { status: 500 },
      );
    }

    // Send email
    const info = await transporter.sendMail({
      from: `"GetSetDeployed Applications" <${EMAIL_HOST_USER}>`,
      to: recipientList.join(", "),
      subject: `New Application for ${job.Title} - ${job.Employment_type}`,
      html: emailTemplate,
      attachments: [attachment],
    });

    console.log("Message sent successfully:", info.messageId);

    return NextResponse.json({
      message: "Application submitted successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    console.error("Email sending error:", error);

    let errorMessage = "Failed to send email";

    if (error instanceof Error) {
      if (error.message.includes("Invalid login")) {
        errorMessage = "Email authentication failed. Please check credentials.";
      } else if (error.message.includes("Connection timeout")) {
        errorMessage = "Email server connection timeout. Please try again.";
      } else if (error.message.includes("Network")) {
        errorMessage = "Network error. Please check your connection.";
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
