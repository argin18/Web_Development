import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import Nav from "../component/Nav";
import {
  FileText,
  CirclePlus,
  FilePenLine,
  Search,
  Trash2,
} from "lucide-react";
import PopUp from "../component/PopUp";
import Footer from "../component/Footer";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const UserManage = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";

  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [mode, setMode] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    username: "",
    fullname: "",
    email: "",
    password: "",
    role: "librarian",
  });

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost/copy/api/users/get.php"
      );

      const mapped = Array.isArray(res.data)
        ? res.data.map((u) => ({
            id: u.id,
            username: u.username,
            fullname: u.fullname,
            email: u.email,
            role: u.role,
            created_at: u.created_at,
          }))
        : [];

      setUsers(mapped);
      setError("");
    } catch (e) {
      console.error("Fetch users error:", e);
      setError("Failed to fetch users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const openPopUp = (type, user = null) => {
    if (!isAdmin) return;
    
    setError("");
    setSuccess("");
    setMode(type);
    setData(user);

    if (type === "edit" && user) {
      setForm({
        username: user.username,
        fullname: user.fullname,
        email: user.email,
        password: "",
        role: user.role,
      });
    } else {
      setForm({
        username: "",
        fullname: "",
        email: "",
        password: "",
        role: "librarian",
      });
    }
    setOpen(true);
  };

  const closePopUp = () => {
    setOpen(false);
    setData(null);
    setMode("");
    setError("");
    setSuccess("");
  };

  const filterUsers = users.filter(
    (u) =>
      u?.username?.toLowerCase().includes(search.toLowerCase()) ||
      u?.fullname?.toLowerCase().includes(search.toLowerCase()) ||
      u?.email?.toLowerCase().includes(search.toLowerCase()) ||
      u?.id?.toString().includes(search)
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const validateForm = () => {
    if (!form.username.trim()) {
      setError("Username is required");
      return false;
    }
    if (!form.fullname.trim()) {
      setError("Full name is required");
      return false;
    }
    if (!form.email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (mode === "add" && !form.password) {
      setError("Password is required for new users");
      return false;
    }
    if (form.password && form.password.length < 4) {
      setError("Password must be at least 4 characters long");
      return false;
    }
    return true;
  };

  const addUser = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    
    if (!validateForm()) return;

    try {
      setError("");
      const response = await axios.post(
        "http://localhost/copy/api/users/add.php",
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setSuccess("Librarian added successfully!");
        await fetchUsers(); // Refresh the list
        setTimeout(() => {
          closePopUp();
        }, 1500);
      } else {
        setError(response.data.error || "Failed to add librarian");
      }
    } catch (e) {
      console.error("Add user error:", e);
      if (e.response?.data?.error) {
        setError(e.response.data.error);
      } else {
        setError("Error adding user. Please try again.");
      }
    }
  };

  const editUser = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    
    if (!validateForm()) return;

    try {
      setError("");
      const updateData = { ...form, id: data.id };
      
      const response = await axios.post(
        "http://localhost/copy/api/users/edit.php",
        updateData,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setSuccess("Librarian updated successfully!");
        await fetchUsers();
        setTimeout(() => {
          closePopUp();
        }, 1500);
      } else {
        setError(response.data.error || "Failed to update librarian");
      }
    } catch (e) {
      console.error("Edit user error:", e);
      if (e.response?.data?.error) {
        setError(e.response.data.error);
      } else {
        setError("Error updating user. Please try again.");
      }
    }
  };

  const deleteUser = async () => {
    if (!isAdmin) return;

    try {
      setError("");
      const response = await axios.post(
        "http://localhost/copy/api/users/delete.php",
        { id: data.id },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setSuccess("Librarian deleted successfully!");
        await fetchUsers();
        setTimeout(() => {
          closePopUp();
        }, 1500);
      } else {
        setError(response.data.error || "Failed to delete librarian");
      }
    } catch (e) {
      console.error("Delete user error:", e);
      if (e.response?.data?.error) {
        setError(e.response.data.error);
      } else {
        setError("Error deleting user. Please try again.");
      }
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex pt-17">
          <Nav />
          <div className="flex-1 p-6">
            <div className="bg-red-100 text-red-700 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p>You don't have permission to access this page.</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="flex pt-17 flex-row md:flex-row">
          <Nav />
          <div className="flex-1 p-4 md:p-6">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row bg-gray-200 gap-3 md:gap-0 justify-between items-start md:items-center p-4 rounded-lg mb-4">
              <div>
                <h1 className="font-semibold text-xl md:text-2xl">
                  Librarian Management
                </h1>
                {/* <span className="text-sm text-gray-600 mt-1 block">
                  Manage librarian accounts
                </span> */}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {/* Add Librarian - Admin Only */}
                <button
                  onClick={() => openPopUp("add")}
                  className="flex gap-2 cursor-pointer justify-center items-center bg-green-700 text-white px-4 py-2 rounded-lg shadow active:scale-95 w-full sm:w-auto"
                >
                  <CirclePlus className="bg-white text-black rounded-full p-1" />
                  Add Librarian
                </button>

                {/* Search */}
                <div className="flex gap-2 bg-white px-3 py-2 rounded-lg shadow items-center w-full sm:w-auto">
                  <Search className="text-gray-500" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    placeholder="Search by Username or Name"
                    className="outline-none text-sm w-full"
                  />
                </div>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-100 text-green-700 p-3 rounded-lg mb-4">
                {success}
              </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto rounded-xl">
              <table className="w-full bg-white rounded-lg shadow text-sm md:text-base">
                <thead className="bg-gray-100">
                  <tr>
                    {/* <th className="p-3 text-left">ID</th> */}
                    <th className="p-3 text-left">Username</th>
                    <th className="p-3 text-left">Full Name</th>
                    <th className="p-3 text-left hidden md:table-cell">Email</th>
                    <th className="p-3 text-left">Role</th>
                    <th className="p-3 text-left hidden md:table-cell">Created</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="text-center p-4">
                        Loading users...
                      </td>
                    </tr>
                  ) : filterUsers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center p-4">
                        No librarians found
                      </td>
                    </tr>
                  ) : (
                    filterUsers.map((u) => (
                      <tr key={`${u.id}`} className="border-t hover:bg-gray-50">
                        {/* <td className="p-3">{u.id}</td> */}
                        <td className="p-3 font-medium">{u.username}</td>
                        <td className="p-3">{u.fullname}</td>
                        <td className="p-3 hidden md:table-cell">{u.email}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            u.role === 'admin' 
                              ? 'bg-purple-200 text-purple-800' 
                              : 'bg-green-200 text-green-800'
                          }`}>
                            {u.role}
                          </span>
                        </td>
                        <td className="p-3 hidden md:table-cell">{u.created_at}</td>
                        <td className="p-3 flex gap-2">
                          <button
                            onClick={() => openPopUp("view", u)}
                            className="text-green-600 hover:scale-110"
                            title="View Details"
                          >
                            <FileText size={18} />
                          </button>

                          {u.role !== 'admin' && (
                            <>
                              <button
                                onClick={() => openPopUp("edit", u)}
                                className="text-blue-600 hover:scale-110"
                                title="Edit"
                              >
                                <FilePenLine size={18} />
                              </button>

                              <button
                                onClick={() => openPopUp("delete", u)}
                                className="text-red-600 hover:scale-110"
                                title="Delete"
                              >
                                <Trash2 size={18} />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pop Up for Add/Edit/View/Delete */}
        {open && (
          <PopUp
            title={
              mode === "view"
                ? "User Details"
                : mode === "add"
                ? "Add New Librarian"
                : mode === "edit"
                ? "Edit Librarian"
                : "Delete User"
            }
            onclose={closePopUp}
          >
            {mode === "view" && (
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">ID:</span> {data?.id}
                </p>
                <p>
                  <span className="font-semibold">Username:</span> {data?.username}
                </p>
                <p>
                  <span className="font-semibold">Full Name:</span> {data?.fullname}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {data?.email}
                </p>
                <p>
                  <span className="font-semibold">Role:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    data?.role === 'admin' 
                      ? 'bg-purple-200 text-purple-800' 
                      : 'bg-green-200 text-green-800'
                  }`}>
                    {data?.role}
                  </span>
                </p>
                <p>
                  <span className="font-semibold">Created Date:</span> {data?.created_at}
                </p>
              </div>
            )}

            {mode === "delete" && (
              <>
                <p className="m-5">
                  Are you sure you want to delete <b>{data?.fullname}</b>?
                </p>
                <div className="flex justify-center px-2 gap-3">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 cursor-pointer"
                    onClick={closePopUp}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 cursor-pointer"
                    onClick={deleteUser}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}

            {(mode === "add" || mode === "edit") && (
              <form
                onSubmit={mode === "add" ? addUser : editUser}
                className="p-2 rounded-xl shadow bg-gray-100 gap-2 grid justify-center"
              >
                {error && (
                  <div className="bg-red-100 text-red-700 p-2 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="bg-green-100 text-green-700 p-2 rounded-lg text-sm">
                    {success}
                  </div>
                )}

                <div className="grid justify-start text-lg font-semibold">
                  <label>Username:</label>
                  <input
                    required
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    type="text"
                    placeholder="johndoe"
                    className="border rounded-lg outline-none hover:border-gray-600 p-1"
                  />
                </div>

                <div className="grid justify-start text-lg font-semibold">
                  <label>Full Name:</label>
                  <input
                    required
                    name="fullname"
                    value={form.fullname}
                    onChange={handleChange}
                    type="text"
                    placeholder="John Doe"
                    className="border rounded-lg outline-none hover:border-gray-600 p-1"
                  />
                </div>

                <div className="grid justify-start text-lg font-semibold">
                  <label>Email:</label>
                  <input
                    required
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="john@example.com"
                    className="border rounded-lg outline-none hover:border-gray-600 p-1"
                  />
                </div>

                {mode === "add" && (
                  <div className="grid justify-start text-lg font-semibold">
                    <label>Password:</label>
                    <input
                      required
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      type="password"
                      placeholder="********"
                      className="border rounded-lg outline-none hover:border-gray-600 p-1"
                    />
                  </div>
                )}

                {mode === "edit" && (
                  <div className="grid justify-start text-lg font-semibold">
                    <label>New Password (leave blank to keep current):</label>
                    <input
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      type="password"
                      placeholder="Enter new password"
                      className="border rounded-lg outline-none hover:border-gray-600 p-1"
                    />
                  </div>
                )}

                <input type="hidden" name="role" value="librarian" />

                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={closePopUp}
                    className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 text-white rounded-lg cursor-pointer ${
                      mode === "add" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {mode === "add" ? "Add Librarian" : "Update"}
                  </button>
                </div>
              </form>
            )}
          </PopUp>
        )}

        <Footer />
      </div>
    </>
  );
};

export default UserManage;