import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const JOBS_PER_PAGE = 9;

const SavedJobs = () => {
  const navigate = useNavigate();
  const [jobList, setJobList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
  const userRole = user?.role;

  /* ================= LOAD SAVED JOBS FROM LOCAL ================= */
  useEffect(() => {
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
    setJobList(savedJobs);
  }, []);

  /* ================= REMOVE SAVED JOB ================= */
  const handleRemoveSaved = (jobId) => {
    const updatedJobs = jobList.filter((job) => job.id !== jobId);
    localStorage.setItem("savedJobs", JSON.stringify(updatedJobs));
    setJobList(updatedJobs);
  };

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(jobList.length / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const currentJobs = jobList.slice(startIndex, startIndex + JOBS_PER_PAGE);

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gray-50 p-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {currentJobs.length === 0 ? (
          <p className="text-gray-500 text-center col-span-3">
            No saved jobs yet.
          </p>
        ) : (
          currentJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden">
                  {job.icon?.startsWith("http") ? (
                    <img
                      src={job.icon}
                      alt={job.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-gray-600 uppercase">
                      {job.title?.charAt(0)}
                    </span>
                  )}
                </div>

                <div>
                  <p className="text-sm text-gray-500">
                    {job.company_name || "Company not specified"}
                  </p>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {job.title}
                  </h2>
                </div>
              </div>

              {job.skills && (
                <p className="text-sm text-gray-700 mb-4">
                  <span className="font-bold">Skills:</span> {job.skills}
                </p>
              )}

              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-black">
                  CTC: {job.package}
                </span>

                <button
                  onClick={() => handleRemoveSaved(job.id)}
                  className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded"
                >
                  Remove
                </button>
              </div>

              <button
                onClick={() =>
                  userRole === "admin"
                    ? navigate(`/admin/job/${job.id}`)
                    : navigate(`/jobs/job/${job.id}`)
                }
                className="bg-black rounded-md py-2 text-white font-bold text-xs px-3 mt-3 w-full"
              >
                View Job →
              </button>
            </div>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 border rounded ${
                  currentPage === page
                    ? "bg-black text-white"
                    : "hover:bg-gray-100"
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SavedJobs;
