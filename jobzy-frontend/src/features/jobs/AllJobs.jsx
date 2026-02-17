import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Pencil, Trash2, Bookmark } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;
const JOBS_PER_PAGE = 9;

const AllJobs = () => {
  const navigate = useNavigate();
  const [jobList, setJobList] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);

  const token = Cookies.get("token");
  const user = Cookies.get("user") ? JSON.parse(Cookies.get("user")) : null;
  const userRole = user?.role;

  /* ================= FETCH JOBS ================= */
  const getAllJobs = async () => {
    try {
      const res = await fetch(`${BASE_URL}/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch jobs");
      const data = await res.json();
      setJobList(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  /* ================= LOAD SAVED JOBS ================= */
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedJobs")) || [];
    setSavedJobs(stored);
    console.log(stored);
  }, []);

  /* ================= SAVE / UNSAVE JOB ================= */
  const handleSaveJob = (job) => {
    console.log(job);
    let updated = [...savedJobs];
    const exists = updated.find((item) => item.id === job.id);

    if (exists) {
      updated = updated.filter((item) => item.id !== job.id);
    } else {
      updated.push(job); // Save full object
    }

    localStorage.setItem("savedJobs", JSON.stringify(updated));
    setSavedJobs(updated);
  };

  /* ================= DELETE JOB ================= */
  const confirmDelete = (id) => {
    setJobToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!jobToDelete) return;

    const res = await fetch(`${BASE_URL}/jobs/delete/${jobToDelete}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      setJobList((prev) => prev.filter((job) => job.id !== jobToDelete));
      setShowDeleteModal(false);
      setJobToDelete(null);
    }
  };

  useEffect(() => {
    getAllJobs();
  }, []);

  /* ================= PAGINATION ================= */
  const totalPages = Math.ceil(jobList.length / JOBS_PER_PAGE);
  const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
  const currentJobs = jobList.slice(startIndex, startIndex + JOBS_PER_PAGE);

  return (
    <div className="min-h-[calc(100vh-60px)] bg-gray-50 p-6">
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {currentJobs.map((job) => {
          const isSaved = savedJobs.find((item) => item.id === job.id);
          return (
            <div
              key={job.id}
              className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition"
            >
              {/* HEADER */}
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
              {/* SKILLS */}
              {job.skills && (
                <p className="text-sm text-gray-700 mb-4">
                  <span className="font-bold">Skills:</span> {job.skills}
                </p>
              )}
              {/* FOOTER */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-black">
                  CTC: {job.package}
                </span>

                {userRole === "user" && (
                  <button
                    onClick={() => handleSaveJob(job)}
                    className={`p-2 border rounded-lg ${
                      isSaved ? "bg-black" : "hover:bg-gray-100"
                    }`}
                  >
                    <Bookmark size={16} color={isSaved ? "#fff" : "#000"} />
                  </button>
                )}

                {userRole === "admin" && (
                  <>
                    <div className="flex gap-2">
                      <button
                        className="p-2 border rounded-lg hover:bg-blue-50"
                        onClick={() => navigate(`/admin/edit/${job.id}`)}
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        className="p-2 border rounded-lg hover:bg-red-50"
                        onClick={() => confirmDelete(job.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </div>
              {/* VIEW JOB */}
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
          );
        })}
      </div>

      {/* PAGINATION */}
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

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-4">Are you sure you want to delete this job?</p>
            <div className="flex justify-end gap-3">
              <button
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllJobs;
