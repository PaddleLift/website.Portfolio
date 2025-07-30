import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getJobs } from "@/lib/api";
import { JobApplication } from "@/components/job/JobApplication";
import { JobDetailsSkeleton } from "@/components/job/job-details-skeleton";
import Navbar from "@/components/Navbar";
import { SharePopup } from "@/components/job/SharePopup";
import { Metadata } from "next";
import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Utility function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/\(/g, "")
    .replace(/\)/g, "");
}

const { window } = new JSDOM("");
const purify = DOMPurify(window);

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const { job_listings } = await getJobs();
    const job = job_listings.find((job) => generateSlug(job.Title) === slug);
    if (!job) return { title: "Job Not Found" };
    return {
      title: `${job.Title} | Job Listing`,
      description: `Apply for ${job.Title} at ${job.Client_Name || "Company"} in ${job.Job_Location}`,
    };
  } catch (error) {
    console.error("Failed to fetch job for metadata:", error);
    return { title: "Job Not Found" };
  }
}

async function JobDetails({ params }: PageProps) {
  const { slug } = await params;
  let job;
  try {
    const { job_listings } = await getJobs();
    console.log(
      "Available slugs:",
      job_listings.map((job) => generateSlug(job.Title)),
    ); // Debugging
    job = job_listings.find((job) => generateSlug(job.Title) === slug);
    if (!job) {
      console.error(`Job not found for slug: ${slug}`);
      notFound();
    }
  } catch (error) {
    console.error("Failed to fetch job:", error);
    notFound();
  }

  // Normalize data
  const experienceRange = Array.isArray(job.Years_of_Experience_Required)
    ? job.Years_of_Experience_Required.join("-")
    : job.Years_of_Experience_Required || "N/A";

  const educationalQualifications = Array.isArray(
    job.Educational_Qualifications,
  )
    ? job.Educational_Qualifications.join(", ")
    : job.Educational_Qualifications || "None";

  const certifications = Array.isArray(job.Certifications)
    ? job.Certifications.join(", ")
    : job.Certifications || "None";

  const sanitizedDescription = purify.sanitize(job.Job_Description);

  return (
    <div className="min-h-screen bg-[#09090B]">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-32">
        <div className="py-8">
          <Link
            href="/jobs"
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
            aria-label="Back to job listings"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Jobs
          </Link>
          <div className="mt-4 overflow-hidden rounded-lg bg-white shadow">
            <div className="px-4 py-5 sm:p-6">
              <div className="md:flex md:items-center md:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                      {job.Title}
                    </h2>
                    <SharePopup jobTitle={job.Title} jobId={slug} />
                  </div>
                  <div className="mt-1 flex flex-col sm:mt-0 sm:flex-row sm:flex-wrap sm:space-x-6">
                    <div className="mt-2 flex items-center text-sm text-gray-500">
                      {job.Client_Name && (
                        <>
                          <span className="font-medium">{job.Client_Name}</span>
                          <span className="mx-2">•</span>
                        </>
                      )}
                      <span>{job.Client_Industry}</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex md:ml-4 md:mt-0">
                  {job.Salary_Range?.length === 2 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-blue-100 text-blue-800"
                      aria-label={`Salary range: ${job.Currency}${job.Salary_Range[0]} to ${job.Currency}${job.Salary_Range[1]}`}
                    >
                      {job.Currency}
                      {job.Salary_Range[0]} - {job.Currency}
                      {job.Salary_Range[1]}
                    </Badge>
                  )}
                </div>
              </div>
              <div className="mt-6 border-t border-gray-100">
                <dl className="divide-y divide-gray-100">
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Location
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {job.Job_Location}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Experience
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {job.Experience_level} • {experienceRange} years
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Work Type
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {job.Employment_type} • {job.Work_Mode}
                    </dd>
                  </div>
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Required Skills
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      <div className="flex flex-wrap gap-2">
                        {job.Required_skills?.map(
                          (skill: string, index: number) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="border-blue-200 text-blue-800"
                              aria-label={`Skill: ${skill}`}
                            >
                              {skill}
                            </Badge>
                          ),
                        )}
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Requirements
                </h3>
                <dl className="mt-2 divide-y divide-gray-100">
                  {educationalQualifications && (
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        Education
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {educationalQualifications}
                      </dd>
                    </div>
                  )}
                  {certifications && (
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        Certifications
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {certifications}
                      </dd>
                    </div>
                  )}
                  <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                    <dt className="text-sm font-medium leading-6 text-gray-900">
                      Industry
                    </dt>
                    <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                      {job.Client_Industry}
                    </dd>
                  </div>
                </dl>
              </div>
              <div className="">
                <dl className="mt-2 divide-y divide-gray-100">
                  {job.Other_Benefits && (
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        Other Benefits
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {job.Other_Benefits}
                      </dd>
                    </div>
                  )}
                  {typeof job.Number_of_Openings !== "undefined" && (
                    <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                      <dt className="text-sm font-medium leading-6 text-gray-900">
                        Open Positions
                      </dt>
                      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                        {job.Number_of_Openings}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Job Description
                </h3>
                <div
                  className="mt-2 prose prose-sm text-gray-500"
                  dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                />
              </div>
              {Array.isArray(job.Questions) && job.Questions.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Application Questions
                  </h3>
                  <ul className="mt-2 space-y-2" role="list">
                    {job.Questions.map((question: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700">
                        {question}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
          <JobApplication job={job} />
        </div>
      </div>
    </div>
  );
}

export default function JobPage({ params }: PageProps) {
  return (
    <Suspense fallback={<JobDetailsSkeleton />}>
      <JobDetails params={params} />
    </Suspense>
  );
}
