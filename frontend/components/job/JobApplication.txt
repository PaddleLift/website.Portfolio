"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { JobListing } from "@/lib/types";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

export function JobApplication({ job }: { job: JobListing }) {
  const [answers, setAnswers] = useState<string[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB.");
        e.target.value = "";
        return;
      }
      setFile(selectedFile);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate form inputs
      if (!file) throw new Error("Please attach your CV");
      if (answers.length !== (job.Questions?.length || 0) + 2) {
        throw new Error("Please answer all screening questions");
      }
      if (answers.some((answer) => !answer.trim())) {
        throw new Error("All questions must be answered");
      }

      // Convert CV to base64
      const base64CV = await fileToBase64(file);

      // Extract the email from the answers array
      const userEmail = answers[1]; // Assuming the email is the second answer

      // Create email template
      const questions = [
        "What is your Name?",
        "What is Your Email?",
        ...(job.Questions || []),
      ];

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
                ${file.name} <span style="opacity:.7; font-size:0.92em;">(${(file.size / 1024).toFixed(2)} KB)</span>
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

      // // Prepare email data
      // const recipientList = JSON.parse(
      //   process.env.NEXT_PUBLIC_RECIPIENT_LIST || "[]",
      // );
      // recipientList.push(userEmail); // Add the user's email to the recipient list
      const recipientList = JSON.parse(
        process.env.NEXT_PUBLIC_RECIPIENT_LIST || "[]",
      );

      recipientList.push(userEmail);

      if (job.email) {
        let jobEmails: string[] = [];

        if (typeof job.email === "string") {
          jobEmails = job.email
            .split(",")
            .map((email) => email.trim())
            .filter((email) => email);
        } else if (Array.isArray(job.email)) {
          jobEmails = job.email.filter((email) => email && email.trim());
        }

        jobEmails.forEach((email) => {
          if (email && !recipientList.includes(email)) {
            recipientList.push(email);
          }
        });
      }
      console.log(recipientList);

      const emailData = {
        id: process.env.NEXT_PUBLIC_EMAIL_ID,
        subject: `New Application for ${job.Title} - ${job.Employment_type}`,
        body: emailTemplate,
        recipient_list: recipientList,
        smtp_host: "smtp.gmail.com",
        smtp_port: 465,
        use_tls: false,
        use_ssl: true,
        email_host_user: process.env.NEXT_PUBLIC_EMAIL_HOST_USER,
        email_host_password: process.env.NEXT_PUBLIC_EMAIL_HOST_PASSWORD,
        attachments: [
          {
            filename: file.name,
            content: base64CV.split(",")[1],
            content_type: file.type,
          },
        ],
      };

      // Send email
      await axios.post(
        "https://email-client-backend.onrender.com/send/",
        emailData,
      );

      // Show success toast
      toast.success("Application submitted successfully!", {
        duration: 5000,
        position: "bottom-center",
        style: {
          background: "#4BB543",
          color: "#fff",
        },
      });

      // Reset form
      setAnswers([]);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      setTimeout(() => {
        router.push("/jobs");
      }, 800);
    } catch (error) {
      console.error("Submission error:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to submit application";
      setError(errorMessage);
      toast.error(errorMessage, {
        duration: 4000,
        position: "bottom-center",
        style: {
          background: "#ff4444",
          color: "#fff",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const questions = [
    "What is your Name?",
    "What is Your Email?",
    ...(job.Questions || []),
  ];

  return (
    <Card className="mt-8 bg-white text-black">
      <form onSubmit={handleSubmit} className="space-y-6 p-6">
        <h2 className="text-xl font-semibold">
          Apply for {job.Employment_type} at {job.Title}
        </h2>

        {questions.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Screening Questions</h3>
            {questions.map((question, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-lg border p-4"
              >
                <p className="mb-2 font-medium">{question}</p>
                <Textarea
                  placeholder="Your answer"
                  value={answers[index] || ""}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="mt-2 bg-gray-100 min-h-[100px]"
                  required
                />
              </motion.div>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Attach Your CV</h3>
            <p className="text-sm text-gray-500">
              Please upload your CV in PDF format (max 5MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="block w-full text-sm text-slate-500
                file:mr-4 file:rounded-full file:border-0
                file:bg-violet-50 file:px-4 file:py-2
                file:text-sm file:font-semibold file:text-violet-700
                hover:file:bg-violet-100"
              required
              onChange={handleFileChange}
            />
          </div>
        </motion.div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Submitting...
              </div>
            ) : (
              "Submit Application"
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}
