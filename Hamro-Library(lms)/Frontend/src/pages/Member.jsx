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

const Member = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";
  const isLibrarian = currentUser?.role === "librarian";

  const canAddEdit = isAdmin || isLibrarian;
  const canDelete = isAdmin;

  const [members, setMember] = useState([]);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [mode, setMode] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    date: "",
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost/copy/api/members/get.php"
      );

      const mapped = Array.isArray(res.data)
        ? res.data.map((m) => ({
            id: m.id,
            name: m.Mname,
            email: m.Memail,
            phone: m.Mphone,
            address: m.Maddress,
            date: m.created_at,
          }))
        : [];

      setMember(mapped);
    } catch (e) {
      console.error("Fetch error:", e);
      setMember([]);
    } finally {
      setLoading(false);
    }
  };

  const openPopUp = (type, member = null) => {
    // Role-based permissions
    if ((type === "add" || type === "edit") && !canAddEdit) {
      return;
    }
    if (type === "delete" && !canDelete) {
           return;
    }

    setMode(type);
    setData(member);

    if (type === "edit" && member) {
      setForm({
        name: member.name,
        address: member.address,
        email: member.email,
        phone: member.phone,
      });
    } else {
      setForm({
        name: "",
        address: "",
        email: "",
        phone: "",
        date: "",
      });
    }
    setOpen(true);
  };

  const closePopUp = () => {
    setOpen(false);
    setData(null);
    setMode("");
  };

  const filterMembers = members.filter(
    (m) =>
      m?.name?.toLowerCase().includes(search.toLowerCase()) ||
      m?.phone?.toString().includes(search)||m?.id?.toString().includes(search)||m?.address?.toLowerCase().includes(search.toLowerCase()) 
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addMember = async (e) => {
    e.preventDefault();
    if (!canAddEdit) return;

    try {
      await axios.post(
        "http://localhost/copy/api/members/add.php",
        form,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      await fetchMembers();
      closePopUp();
    } catch (e) {
      console.error(e);
    }
  };

  const editMember = async (e) => {
    e.preventDefault();
    if (!canAddEdit) return;

    try {
      await axios.post(
        "http://localhost/copy/api/members/edit.php",
        { ...form, id: data.id },
        { headers: { "Content-Type": "application/json" } }
      );
      await fetchMembers();
      closePopUp();
    } catch (e) {
    console.error(e)
    }
  };

  const deleteMember = async () => {
    if (!canDelete) return;

    try {
      await axios.post(
        "http://localhost/copy/api/members/delete.php",
        { id: data.id },
        { headers: { "Content-Type": "application/json" } }
      );
      await fetchMembers();
      closePopUp();
    } catch (e) {
     console.error(e)
    }
  };

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
                  Member Management
                </h1>
                {!isAdmin && !isLibrarian && (
                  <span className="text-sm text-gray-600 mt-1 block">
                    View Only Mode
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                {/* Add User - Admin or Librarian */}
                {canAddEdit && (
                  <button
                    onClick={() => openPopUp("add")}
                    className="flex gap-2 cursor-pointer justify-center items-center bg-green-800 text-white px-4 py-2 rounded-lg shadow active:scale-95 w-full sm:w-auto"
                  >
                    <CirclePlus className="bg-white text-black rounded-full p-1" />
                    Add User
                  </button>
                )}

                {/* Search */}
                <div className="flex gap-2 bg-white px-3 py-2 rounded-lg shadow items-center w-full sm:w-auto">
                  <Search className="text-gray-500" />
                  <input
                    required
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    placeholder="Search by Name or ID"
                    className="outline-none text-sm w-full"
                  />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl">
              <table className="w-full bg-white rounded-lg shadow text-sm md:text-base">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-3 text-left">ID</th>
                    <th className="p-3 text-left">Name</th>
                    <th className="p-3 text-left hidden md:table-cell">Email</th>
                    <th className="p-3 text-left">Phone</th>
                    <th className="p-3 text-left hidden md:table-cell">Address</th>
                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center p-4">
                        Loading members...
                      </td>
                    </tr>
                  ) : filterMembers.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center p-4">
                        No members found
                      </td>
                    </tr>
                  ) : (
                    filterMembers.map((m) => (
                      <tr key={`${m.id}`} className="border-t hover:bg-gray-50">
                        <td className="p-3">{m.id}</td>
                        <td className="p-3 font-medium">{m.name}</td>
                        <td className="p-3 hidden md:table-cell">{m.email}</td>
                        <td className="p-3">{m.phone}</td>
                        <td className="p-3 hidden md:table-cell">{m.address}</td>
                        <td className="p-3 flex gap-2">
                          <button
                            onClick={() => openPopUp("view", m)}
                            className="text-green-600"
                          >
                            <FileText size={18} />
                          </button>

                          {canAddEdit && (
                            <button
                              onClick={() => openPopUp("edit", m)}
                              className="text-blue-600"
                            >
                              <FilePenLine size={18} />
                            </button>
                          )}

                          {canDelete && (
                            <button
                              onClick={() => openPopUp("delete", m)}
                              className="text-red-600"
                            >
                              <Trash2 size={18} />
                            </button>
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

        {/* Pop Up */}
        {open && (
          <PopUp
            title={
              mode === "view"
                ? "Member Details"
                : mode === "add"
                ? "Add New Member"
                : mode === "edit"
                ? "Edit Member"
                : "Delete Member"
            }
            onclose={closePopUp}
          >
            {mode === "view" && (
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">ID:</span> {data?.id}
                </p>
                <p>
                  <span className="font-semibold">Name:</span> {data?.name}
                </p>
                <p>
                  <span className="font-semibold">Email:</span> {data?.email}
                </p>
                <p>
                  <span className="font-semibold">Phone:</span> {data?.phone}
                </p>
                <p>
                  <span className="font-semibold">Address:</span> {data?.address}
                </p>
                <p>
                  <span className="font-semibold">Registered Date:</span> {data?.date}
                </p>
              </div>
            )}

            {mode === "delete" && canDelete && (
              <>
                <p className="m-5">
                  Are you sure you want to delete <b>{data?.name}</b>?
                </p>
                <div className="flex justify-center px-2">
                  <button
                    className="text-xl font-mono mb-2 cursor-pointer justify-center items-center active:bg-red-400 bg-red-700 text-white px-4 py-2 rounded-lg shadow active:scale-95 w-full sm:w-auto"
                    onClick={deleteMember}
                  >
                    Delete
                  </button>
                </div>
              </>
            )}

            {(mode === "add" || mode === "edit") && canAddEdit && (
              <form
                onSubmit={mode === "add" ? addMember : editMember}
                className="p-2 rounded-xl shadow bg-gray-100 gap-2 grid justify-center"
              >
                <div className="grid justify-start text-lg font-semibold">
                  <label>Member name:</label>
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    type="text"
                    placeholder="Sumit Bhujel"
                    className="border rounded-lg outline-none hover:border-gray-600 p-1"
                  />
                </div>
                <div className="grid justify-start text-lg font-semibold">
                  <label>Member Email:</label>
                  <input
                    required
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    type="email"
                    placeholder="argin@gmail.com"
                    className="border rounded-lg outline-none hover:border-gray-600 p-1"
                  />
                </div>
                <div className="grid gap-1 justify-start text-lg font-semibold">
                  <label>Phone Number:</label>
                  <input
                    required
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    type="text"
                    placeholder="9800000000"
                    className="border rounded-lg outline-none hover:border-gray-600 p-1"
                  />
                </div>
                <div className="grid gap-1 justify-start text-lg font-semibold">
                  <label>Address:</label>
                  <input
                    required
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    type="text"
                    placeholder="Chatara"
                    className="border rounded-lg outline-none hover:border-gray-600 p-1"
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className={`text-xl font-mono mb-2 cursor-pointer justify-center items-center text-white px-4 py-2 rounded-lg shadow active:scale-95 w-full sm:w-auto ${
                      mode === "add" ? "bg-green-600" : "bg-blue-600"
                    }`}
                  >
                    {mode === "add" ? "Add" : "Update"}
                  </button>
                </div>
              </form>
            )}

            {!canAddEdit && !canDelete && mode !== "view" && mode !== "" && (
              <p className="text-red-600 text-center p-4">
                You don't have permission to {mode} members.
              </p>
            )}
          </PopUp>
        )}

        <Footer />
      </div>
    </>
  );
};

export default Member;
