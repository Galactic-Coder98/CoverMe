"use client";

import { useState } from "react";
import jsPDF from "jspdf";

export default function Home() {
  const [name, setName] = useState("");
  const [skills, setSkills] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setCoverLetter("");

    try {
      const response = await fetch("/api/generate-cover-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, skills, jobTitle, companyName }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate cover letter");
      }

      const data = await response.json();
      setCoverLetter(data.coverLetter);
      setShowForm(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!coverLetter) return;

    const doc = new jsPDF();
    doc.setFont("times", "normal");
    doc.setFontSize(11);

    const margin = 15;
    let cursorY = margin;

    const lines = doc.splitTextToSize(coverLetter, 180);

    const lineHeight = 8;
    const paragraphSpacing = 6;

    lines.forEach((line, index) => {
      if (line === "" && index > 0) {
        cursorY += paragraphSpacing;
      } else {
        doc.text(line, margin, cursorY);
        cursorY += lineHeight;
      }
    });

    doc.save("Cover_Letter.pdf");
  };

  const handleGenerateNew = () => {
    setName("");
    setSkills("");
    setJobTitle("");
    setCompanyName("");
    setCoverLetter("");
    setError("");
    setShowForm(true);
  };

  return (
    <div className="px-8 flex flex-col items-center justify-center font-sans">
      <h1 className="mt-4 text-md font-bold mb-6 italic text-center px-12">Please input your Full Name, Skills, Job Title, Company Name and click on 'Generate Cover Letter'</h1>

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              Name:
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border rounded-md p-2 text-black"
            />
          </div>

          <div>
            <label htmlFor="skills" className="block font-medium mb-1">
              Skills:
            </label>
            <input
              id="skills"
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              required
              className="w-full border rounded-md p-2 text-black"
            />
          </div>

          <div>
            <label htmlFor="jobTitle" className="block font-medium mb-1">
              Job Title:
            </label>
            <input
              id="jobTitle"
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              required
              className="w-full border rounded-md p-2 text-black"
            />
          </div>

          <div>
            <label htmlFor="companyName" className="block font-medium mb-1">
              Company Name:
            </label>
            <input
              id="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              required
              className="w-full border rounded-md p-2 text-black"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`px-6 py-2 rounded-md text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Generating..." : "Generate Cover Letter"}
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center justify-center mb-2">
          {error && (
            <div className="text-red-600 mb-4">Error: {error}</div>
          )}
          {coverLetter && (
            <div className="w-1/2">
              <h2 className="text-center text-xl font-semibold mb-4">Your Cover Letter</h2>

              <div className="mb-4 flex items-center justify-center">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
                  <button
                    onClick={handleDownloadPDF}
                    className="block px-2 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
                  >
                    Download as PDF
                  </button>

                  <button
                    onClick={handleGenerateNew}
                    className="block px-2 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md ml-4"
                  >
                    Generate New Cover Letter
                  </button>
                </div>
              </div>

              <p className="whitespace-pre-wrap border rounded-md p-4 bg-gray-50 text-black">
                {coverLetter}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
