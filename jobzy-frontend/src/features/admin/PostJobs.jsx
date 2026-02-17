import React, { useState } from "react";
import Cookies from "js-cookie";
const BASE_URL = import.meta.env.VITE_API_URL;

const PostJobs = () => {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const token = Cookies.get("token");

    const response = await fetch(`${BASE_URL}/jobs/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage("Job added successfully");
      setFormData({
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
    } else {
      setMessage(data.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-60px)]  bg-white lg:bg-gray-50 p-2 flex justify-center lg:items-center">
      <div className="w-full max-w-4xl bg-white  rounded-xl p-8 lg:shadow-sm h-full">
        <h1 className="text-2xl font-semibold mb-6 text-black">Post New Job</h1>

        <form
          onSubmit={handleSubmit}
          className="grid gap-4 sm:grid-cols-1 lg:grid-cols-2"
        >
          {/* Title */}
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

          {/* Company Name */}
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

          {/* Job Role */}
          {/* Job Role */}
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

          {/* Icon */}
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

          {/* Description */}
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

          {/* Long Description */}
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

          {/* Skills */}
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

          {/* Package */}
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

          {/* Apply Link */}
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

          {/* Message */}
          {message && (
            <p className="text-sm text-green-600 col-span-full">{message}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full col-span-full bg-black text-white py-2 rounded-md font-bold"
          >
            {loading ? "Posting..." : "Post Job"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostJobs;
