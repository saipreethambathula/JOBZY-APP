import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
const BASE_URL = import.meta.env.VITE_API_URL;

const FullJob = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchJob = async () => {
    const token = Cookies.get("token");

    try {
      const response = await fetch(`${BASE_URL}/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch job");
      }

      const data = await response.json();
      setJob(data);
    } catch (error) {
      console.error("Error fetching job:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJob();
  }, [id]);

  if (loading) {
    return (
      <p className="p-6 text-center text-gray-600">Loading job details...</p>
    );
  }

  if (!job) {
    return <p className="p-6 text-center text-red-600">Job not found.</p>;
  }

  return (
    <div className="min-h-screen lg:min-h-[calc(100vh-60px)] bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-gray-50 lg:bg-white rounded-2xl lg:p-8 lg:shadow-sm lg:border border-gray-200">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
            {job.icon?.startsWith("http") ? (
              <img
                src={job.icon}
                alt={job.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold text-gray-600 uppercase">
                {job.title?.charAt(0)}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black">{job.title}</h1>
            <p className="text-sm text-gray-500">
              {job.company_name || "Company not specified"}
            </p>
            {job.package && (
              <p className="text-sm text-blue-600 font-semibold">
                CTC: {job.package}
              </p>
            )}
          </div>
        </div>

        {/* Job Role */}
        {job.job_role && (
          <p className="text-sm text-gray-700 mb-2">
            <span className="font-medium">Role:</span> {job.job_role}
          </p>
        )}

        {/* Skills */}
        {job.skills && (
          <p className="text-sm text-gray-700 mb-4">
            <span className="font-medium">Skills:</span> {job.skills}
          </p>
        )}

        {/* Short Description */}
        {job.description && (
          <p className="text-gray-800 mb-4">{job.description}</p>
        )}

        {/* Long Description */}
        {job.long_description && (
          <div className="text-gray-700 whitespace-pre-line mb-4">
            {job.long_description}
          </div>
        )}

        {/* Apply Button */}
        {job.applyLink && (
          <a
            href={job.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-black text-white px-4 py-2 rounded-md font-semibold hover:bg-gray-900"
          >
            Apply Now →
          </a>
        )}
      </div>
    </div>
  );
};

export default FullJob;
