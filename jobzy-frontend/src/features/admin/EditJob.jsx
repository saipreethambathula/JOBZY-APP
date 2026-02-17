import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
const BASE_URL = import.meta.env.VITE_API_URL;

const EditJob = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    company_name: "",
    job_role: "",
    icon: "",
    description: "",
    long_description: "",
    skills: "",
    package: "",
    applyLink: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load existing job data
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const token = Cookies.get("token");

        const res = await fetch(`${BASE_URL}/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to load job");
        }

        setFormData({
          title: data.title || "",
          company_name: data.company_name || "",
          job_role: data.job_role || "",
          icon: data.icon || "",
          description: data.description || "",
          long_description: data.long_description || "",
          skills: data.skills || "",
          package: data.package || "",
          applyLink: data.applyLink || "",
        });
      } catch (err) {
        setMessage(err.message);
      }
    };

    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  //Update job
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await apiRequest(`/jobs/edit/${id}`, "PUT", formData);
      setMessage("Job updated successfully");

      setTimeout(() => navigate("/admin"), 1000);
    } catch (err) {
      setMessage(err.message || "Update failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-white lg:bg-gray-50 p-2 flex justify-center lg:items-center">
      <div className="w-full max-w-4xl bg-white rounded-xl p-8 lg:shadow-sm h-full">
        <h1 className="text-2xl font-semibold mb-6 text-black">Edit Job</h1>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2"
        >
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 text-gray-800">
              Job Title
            </label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full border border-gray-400 px-3 py-2 rounded-md text-black focus:border-black focus:border-2 outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 text-gray-800">
              Company Name
            </label>
            <input
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              required
              className="w-full border border-gray-400 px-3 py-2 rounded-md text-black focus:border-black focus:border-2 outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 text-gray-800">
              Job Role
            </label>
            <select
              name="job_role"
              value={formData.job_role}
              onChange={handleChange}
              className="w-full border border-gray-400 px-3 py-2 rounded-md text-black focus:border-black focus:border-2 outline-none"
            >
              <option value="">Select a role</option>
              <option value="frontend">Frontend</option>
              <option value="backend">Backend</option>
              <option value="full-stack">Full-Stack</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 text-gray-800">
              Icon
            </label>
            <input
              name="icon"
              value={formData.icon}
              onChange={handleChange}
              className="w-full border border-gray-400 px-3 py-2 rounded-md text-black focus:border-black focus:border-2 outline-none"
            />
          </div>

          <div className="flex flex-col col-span-full">
            <label className="text-sm font-medium mb-1 text-gray-800">
              Short Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full border border-gray-400 px-3 py-2 rounded-md text-black focus:border-black focus:border-2 outline-none"
            />
          </div>

          <div className="flex flex-col col-span-full">
            <label className="text-sm font-medium mb-1 text-gray-800">
              Detailed Description
            </label>
            <textarea
              name="long_description"
              value={formData.long_description}
              onChange={handleChange}
              className="w-full border border-gray-400 px-3 py-2 rounded-md text-black focus:border-black focus:border-2 outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 text-gray-800">
              Skills
            </label>
            <input
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full border border-gray-400 px-3 py-2 rounded-md text-black focus:border-black focus:border-2 outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1 text-gray-800">
              Package
            </label>
            <input
              name="package"
              value={formData.package}
              onChange={handleChange}
              required
              className="w-full border border-gray-400 px-3 py-2 rounded-md text-black focus:border-black focus:border-2 outline-none"
            />
          </div>

          <div className="flex flex-col col-span-full">
            <label className="text-sm font-medium mb-1 text-gray-800">
              Apply Link
            </label>
            <input
              name="applyLink"
              value={formData.applyLink}
              onChange={handleChange}
              required
              className="w-full border border-gray-400 px-3 py-2 rounded-md text-black focus:border-black focus:border-2 outline-none"
            />
          </div>

          {message && (
            <p className="text-sm text-green-600 col-span-full">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full col-span-full bg-black text-white py-2 rounded-md font-bold"
          >
            {loading ? "Updating..." : "Update Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditJob;
