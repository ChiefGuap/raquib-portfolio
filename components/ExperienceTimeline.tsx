"use client";

import { experienceData, Experience } from "@/data/experienceData";
import Image from "next/image";
import { useState } from "react";

// Group experiences by year
function groupByYear(experiences: Experience[]): Record<string, Experience[]> {
  return experiences.reduce((acc, exp) => {
    if (!acc[exp.year]) {
      acc[exp.year] = [];
    }
    acc[exp.year].push(exp);
    return acc;
  }, {} as Record<string, Experience[]>);
}

export default function ExperienceTimeline() {
  const groupedExperiences = groupByYear(experienceData);
  const years = Object.keys(groupedExperiences).sort((a, b) => Number(b) - Number(a));

  return (
    <section id="timeline" className="w-full max-w-3xl mx-auto py-12 px-4 bg-white">
      {/* Section Header */}
      <h2
        className="text-4xl font-bold mb-12 text-zinc-800"
        style={{ fontFamily: "var(--font-oswald)" }}
      >
        Timeline
      </h2>

      {/* Timeline Container */}
      <div className="relative">
        {/* Vertical Timeline Line - Black */}
        <div className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-black" />

        {/* Years and Experiences */}
        <div className="space-y-10">
          {years.map((year) => (
            <div key={year} className="relative">
              {/* Year Marker */}
              <div className="flex items-center gap-4 mb-6">
                {/* Year Dot - Black */}
                <div className="relative z-10 w-4 h-4 rounded-full bg-black border-[3px] border-white shadow-md" />
                
                {/* Year Text */}
                <h3
                  className="text-2xl font-bold text-zinc-800 tracking-wide"
                  style={{ fontFamily: "var(--font-oswald)" }}
                >
                  {year}
                </h3>
              </div>

              {/* Experience Cards for this Year */}
              <div className="space-y-5 ml-8">
                {groupedExperiences[year].map((experience, index) => (
                  <ExperienceCard key={`${year}-${index}`} experience={experience} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceCard({ experience }: { experience: Experience }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative group">
      {/* Connector Dot - Black */}
      <div className="absolute -left-[25px] top-2 w-2.5 h-2.5 rounded-full bg-black border-2 border-white shadow-sm" />

      {/* Card Content - White background */}
      <div className="bg-white rounded-xl p-5 border border-zinc-200 shadow-sm hover:shadow-md transition-all duration-300">
        {/* Header: Title + Company Badge */}
        <div className="flex flex-wrap items-center gap-3 mb-3">
          {/* Role Title */}
          <span
            className="text-zinc-700 text-sm"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {experience.title}
          </span>

          <span className="text-zinc-400">at</span>

          {/* Company Badge - Fixed layout with proper flex and gap */}
          <div className="inline-flex items-center gap-3 px-3 py-1.5 bg-zinc-100 rounded-full border border-zinc-200 shadow-sm">
            {/* Company Logo - Fixed: no absolute positioning, proper size */}
            <div className="w-6 h-6 rounded-md overflow-hidden bg-zinc-200 flex-shrink-0 flex items-center justify-center">
              {!imageError ? (
                <Image
                  src={experience.logo}
                  alt={`${experience.company} logo`}
                  width={24}
                  height={24}
                  className="object-cover w-full h-full"
                  onError={() => setImageError(true)}
                />
              ) : (
                <span className="text-xs font-bold text-zinc-500">
                  {experience.company.charAt(0)}
                </span>
              )}
            </div>
            {/* Company Name */}
            <span className="text-sm font-medium text-zinc-700">
              {experience.company}
            </span>
          </div>
        </div>

        {/* Description Bullets */}
        <ul className="space-y-2 mb-4">
          {experience.description.map((bullet, idx) => (
            <li
              key={idx}
              className="text-zinc-600 text-sm leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-zinc-400"
            >
              {bullet}
            </li>
          ))}
        </ul>

        {/* Tags - Minimal monochrome style */}
        <div className="flex flex-wrap gap-2">
          {experience.tags.map((tag, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 text-xs font-medium bg-zinc-200 text-zinc-700 rounded-full hover:bg-zinc-300 transition-colors"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
