import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./features/auth/Auth";
import Layout from "./layouts/Layout";
import Hero from "./components/Hero";

import CustomerProtectedRoute from "./routes/CustomerProtectedRoute";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";

import EditJob from "./features/admin/EditJob";
import PostJobs from "./features/admin/PostJobs";

import AllJobs from "./features/jobs/AllJobs";
import FullJob from "./features/jobs/FullJob";
import SavedJobs from "./features/user/SavedJobs";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/signup" element={<Auth isTrue={true} />} />

        <Route element={<CustomerProtectedRoute />}>
          <Route path="/jobs" element={<Layout />}>
            <Route index element={<AllJobs />} />
            <Route path="job/:id" element={<FullJob />} />
            <Route path="saved-jobs" element={<SavedJobs />} />
          </Route>
        </Route>

        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<Layout />}>
            <Route index element={<AllJobs />} />
            <Route path="post-job" element={<PostJobs />} />
            <Route path="job/:id" element={<FullJob />} />
            <Route path="edit/:id" element={<EditJob />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
