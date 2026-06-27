"use client";

import { useState } from "react";
import Footer from "./components/shared/footer";
import Navbar from "./components/shared/navbar";

const highlights = [
  "Live classes for school and college prep",
  "Structured notes, quizzes, and revision plans",
  "Progress tracking for students and parents",
];

const programs = [
  { title: "Science Stream", description: "Physics, Chemistry, Biology, Math with expert mentors." },
  { title: "Commerce Track", description: "Accounting, Business studies, and exam-focused coaching." },
  { title: "English & Skills", description: "Communication, grammar, and confidence-building sessions." },
];

export default function Home() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const isDark = theme === "dark";

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-300 ${isDark ? "bg-[#081717] text-[#F3F7F6]" : "bg-[#F7FFF8] text-[#081717]"}`}>
      <Navbar
        theme={theme}
        toggleTheme={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
      />

      <main id="home" className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <section className="grid w-full gap-6 overflow-hidden rounded-[32px] border border-[#1D3E3E] bg-[linear-gradient(135deg,rgba(183,255,99,0.12),rgba(134,240,92,0.08),rgba(43,202,122,0.14))] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.2)] lg:grid-cols-[1.1fr_0.9fr] lg:p-10">
          <div className="flex flex-col justify-center">
            <div className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-sm font-medium ${isDark ? "border-[#1D3E3E] bg-[#0A2324]/80 text-[#86F05C]" : "border-[#D7ECE4] bg-[#E8FCEF] text-[#0E8B6E]"}`}>
              Trusted coaching center platform
            </div>
            <h1 className="mt-5 text-4xl font-semibold leading-tight sm:text-5xl">
              Learn smarter with a modern coaching experience.
            </h1>
            <p className={`mt-4 max-w-2xl text-base leading-7 sm:text-lg ${isDark ? "text-[#A9B7B4]" : "text-[#4B5A58]"}`}>
              Support every learner with live sessions, exam readiness, and performance insights in a single elegant platform.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href="/signup" className="rounded-full bg-[#86F05C] px-5 py-3 text-sm font-semibold text-[#081717] transition hover:bg-[#B7FF63]">
                Create Account
              </a>
              <a href="/login" className={`rounded-full border px-5 py-3 text-sm font-semibold transition ${isDark ? "border-[#1D3E3E] text-[#F3F7F6] hover:bg-[#0D2A2B]" : "border-[#D7ECE4] text-[#081717] hover:bg-[#E8FCEF]"}`}>
                Sign In
              </a>
            </div>
          </div>

          <div className={`rounded-[28px] border p-5 sm:p-6 ${isDark ? "border-[#1D3E3E] bg-[#0A2324]/90" : "border-[#D7ECE4] bg-white/80"}`}>
            <div className={`rounded-[24px] border p-4 ${isDark ? "border-[#1D3E3E] bg-[#0D2A2B]" : "border-[#D7ECE4] bg-[#F4FFF8]"}`}>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#86F05C]">This month</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-[#081717] p-4">
                  <p className={`text-3xl font-semibold ${isDark ? "text-[#F3F7F6]" : "text-[#081717]"}`}>1,240+</p>
                  <p className={`mt-1 text-sm ${isDark ? "text-[#A9B7B4]" : "text-[#4B5A58]"}`}>Active learners</p>
                </div>
                <div className="rounded-2xl bg-[#081717] p-4">
                  <p className={`text-3xl font-semibold ${isDark ? "text-[#F3F7F6]" : "text-[#081717]"}`}>96%</p>
                  <p className={`mt-1 text-sm ${isDark ? "text-[#A9B7B4]" : "text-[#4B5A58]"}`}>Attendance rate</p>
                </div>
              </div>
              <div className={`mt-4 rounded-2xl border p-4 ${isDark ? "border-[#1D3E3E] bg-[#081717]" : "border-[#D7ECE4] bg-white"}`}>
                <p className={`text-sm ${isDark ? "text-[#A9B7B4]" : "text-[#4B5A58]"}`}>Average improvement</p>
                <div className={`mt-3 h-2 overflow-hidden rounded-full ${isDark ? "bg-[#0D2A2B]" : "bg-[#E8FCEF]"}`}>
                  <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-[#B7FF63] via-[#86F05C] to-[#0E8B6E]" />
                </div>
                <p className="mt-2 text-sm font-semibold text-[#86F05C]">+18% in monthly test scores</p>
              </div>
            </div>
          </div>
        </section>

        <section id="programs" className="grid w-full gap-4 lg:grid-cols-[0.95fr_1.05fr]">
          <div className={`rounded-[28px] border p-6 sm:p-7 ${isDark ? "border-[#1D3E3E] bg-[#0A2324]" : "border-[#D7ECE4] bg-white"}`}>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#86F05C]">Why students choose us</p>
            <h2 className="mt-3 text-2xl font-semibold">Everything your coaching center needs in one place.</h2>
            <ul className="mt-5 space-y-3">
              {highlights.map((item) => (
                <li key={item} className={`flex items-start gap-3 text-sm leading-7 ${isDark ? "text-[#A9B7B4]" : "text-[#4B5A58]"}`}>
                  <span className="mt-2 h-2.5 w-2.5 rounded-full bg-[#86F05C]" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {programs.map((program) => (
              <div key={program.title} className={`rounded-[24px] border p-5 transition hover:-translate-y-1 ${isDark ? "border-[#1D3E3E] bg-[#0D2A2B] hover:border-[#86F05C]" : "border-[#D7ECE4] bg-[#F4FFF8] hover:border-[#2BCA7A]"}`}>
                <h3 className={`text-lg font-semibold ${isDark ? "text-[#F3F7F6]" : "text-[#081717]"}`}>{program.title}</h3>
                <p className={`mt-3 text-sm leading-7 ${isDark ? "text-[#A9B7B4]" : "text-[#4B5A58]"}`}>{program.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className={`w-full rounded-[28px] border p-6 sm:p-8 ${isDark ? "border-[#1D3E3E] bg-[#0A2324]" : "border-[#D7ECE4] bg-white"}`}>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#86F05C]">Ready to begin?</p>
              <h2 className="mt-2 text-2xl font-semibold">Join your next batch and grow with confidence.</h2>
            </div>
            <a href="mailto:admissions@edubranchpro.com" className="rounded-full bg-[#86F05C] px-5 py-3 text-sm font-semibold text-[#081717] transition hover:bg-[#B7FF63]">
              Book a Free Counseling Session
            </a>
          </div>
        </section>
      </main>

      <Footer theme={theme} />
    </div>
  );
}
