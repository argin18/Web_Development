import React, { useEffect, useState } from "react";
import Header from "../component/Header";
import Nav from "../component/Nav";
import { CirclePlus, Search, SquareChartGantt, FilePenLine } from "lucide-react";
import PopUp from "../component/PopUp";
import Footer from "../component/Footer";
import NepaliDate from "nepali-date-converter";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Issue = () => {
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin" || currentUser?.role === "librarian";

  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [mode, setMode] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("issued");
  const [form, setForm] = useState({
    bookid: "",
    userId: "",
    books: "1",
    dueDate: "",
  });
  const [issues, setIssues] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [availabilityCheck, setAvailabilityCheck] = useState({ available: true, message: "", maxAvailable: 0 });

  const todayBS = new NepaliDate(new Date()).format("YYYY-MM-DD");
  const todayAD = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchIssues();
    fetchBooks();
    fetchMembers();
  }, []);

  // Check availability when bookid or books change
  useEffect(() => {
    if (form.bookid && form.books) {
      checkAvailability(form.bookid, parseInt(form.books));
    }
  }, [form.bookid, form.books]);

  const fetchBooks = async () => {
    try {
      const res = await axios.get("http://localhost/copy/api/books/get.php");
      if (Array.isArray(res.data)) setBooks(res.data);
    } catch (err) {
      console.error("Fetch books error:", err);
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await axios.get("http://localhost/copy/api/members/get.php");
      if (Array.isArray(res.data)) setMembers(res.data);
    } catch (err) {
      console.error("Fetch members error:", err);
    }
  };

  const fetchIssues = async () => {
    try {
      const res = await axios.get("http://localhost/copy/api/issue/get.php");
      if (Array.isArray(res.data)) setIssues(res.data);
    } catch (err) {
      console.error("Fetch issues error:", err);
    }
  };

  // Check book availability
  const checkAvailability = (bookId, requestedQuantity) => {
    const book = books.find(b => b.id == bookId);
    
    if (!book) {
      setAvailabilityCheck({
        available: false,
        message: "Book not found",
        maxAvailable: 0
      });
      return;
    }

    const available = parseInt(book.available) || 0;
    
    if (available < requestedQuantity) {
      setAvailabilityCheck({
        available: false,
        message: `Only ${available} copy(s) available. You requested ${requestedQuantity}.`,
        maxAvailable: available
      });
    } else {
      setAvailabilityCheck({
        available: true,
        message: `${available} copy(s) available`,
        maxAvailable: available
      });
    }
  };

  const openPopUp = (issue = null, type = "view") => {
    setError("");
    setSuccess("");
    setMode(issue ? type : "add");
    setData(issue);
    
    if (issue && type === "edit") {
      setForm({
        bookid: issue.bookid,
        userId: issue.userId,
        books: issue.books,
        dueDate: issue.dueDate,
      });
    } else if (!issue) {
      setForm({ bookid: "", userId: "", books: "1", dueDate: "" });
      setAvailabilityCheck({ available: true, message: "", maxAvailable: 0 });
    }
    setOpen(true);
  };

  const closePopUp = () => {
    setOpen(false);
    setData(null);
    setMode("");
    setError("");
    setSuccess("");
    setAvailabilityCheck({ available: true, message: "", maxAvailable: 0 });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // For bookid, reset availability check
    if (name === "bookid") {
      setAvailabilityCheck({ available: true, message: "", maxAvailable: 0 });
    }
    
    // For books, ensure it's at least 1
    if (name === "books") {
      const numValue = parseInt(value) || 1;
      setForm({ ...form, [name]: numValue < 1 ? "1" : value });
    } else {
      setForm({ ...form, [name]: value });
    }
    
    setError("");
  };

  const isOverdue = (d) => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const due = new NepaliDate(d).toJsDate();
      due.setHours(0, 0, 0, 0);
      return today > due;
    } catch {
      return false;
    }
  };

  const validateDueDate = (dueDate) => {
    if (!dueDate) return "Due date is required";
    
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const due = new NepaliDate(dueDate).toJsDate();
      due.setHours(0, 0, 0, 0);
      
      if (due < today) {
        return "Due date cannot be in the past";
      }
      return "";
    } catch (e) {
      return "Invalid date format";
    }
  };

  const validateBook = (bookId) => {
    if (!bookId) return "Book ID is required";
    
    const book = books.find(b => b.id == bookId);
    if (!book) return "Book not found";
    
    return "";
  };

  const validateMember = (memberId) => {
    if (!memberId) return "Member ID is required";
    
    const member = members.find(m => m.id == memberId);
    if (!member) return "Member not found";
    
    return "";
  };

  const addIssue = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate all fields
    const bookError = validateBook(form.bookid);
    if (bookError) {
      setError(bookError);
      setLoading(false);
      return;
    }

    const memberError = validateMember(form.userId);
    if (memberError) {
      setError(memberError);
      setLoading(false);
      return;
    }

    const dueDateError = validateDueDate(form.dueDate);
    if (dueDateError) {
      setError(dueDateError);
      setLoading(false);
      return;
    }

    if (!form.books || parseInt(form.books) < 1) {
      setError("Number of books must be at least 1");
      setLoading(false);
      return;
    }

    // Check availability
    if (!availabilityCheck.available) {
      setError(availabilityCheck.message);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost/copy/api/issue/add.php",
        { 
          bookid: form.bookid,
          userId: form.userId,
          books: form.books,
          dueDate: form.dueDate
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        // Insert report into DB
        await axios.post(
          "http://localhost/copy/api/reports/add.php",
          {
            report_type: "Issued Books",
            description: `Book ID ${form.bookid} (${form.books} copy) issued to User ${form.userId}`,
            report_date: new Date().toISOString().split("T")[0],
          }
        );

        setSuccess("Book issued successfully!");
        await fetchBooks(); // Refresh books to update availability
        await fetchIssues();
        setTimeout(() => {
          closePopUp();
        }, 1500);
      } else {
        setError(response.data.error || "Failed to issue book");
      }
    } catch (err) {
      console.error("Add issue error:", err);
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError("Error issuing book. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const editIssue = async (e) => {
    e.preventDefault();
    if (!isAdmin || !data) return;
    
    setError("");
    setSuccess("");
    setLoading(true);

    // Validate fields for edit
    const bookError = validateBook(form.bookid);
    if (bookError && form.bookid != data.bookid) {
      setError(bookError);
      setLoading(false);
      return;
    }

    const memberError = validateMember(form.userId);
    if (memberError && form.userId != data.userId) {
      setError(memberError);
      setLoading(false);
      return;
    }

    const dueDateError = validateDueDate(form.dueDate);
    if (dueDateError) {
      setError(dueDateError);
      setLoading(false);
      return;
    }

    // If book or quantity changed, check availability
    if (form.bookid != data.bookid || form.books != data.books) {
      if (!availabilityCheck.available) {
        setError(availabilityCheck.message);
        setLoading(false);
        return;
      }
    }

    try {
      const response = await axios.post(
        "http://localhost/copy/api/issue/edit.php",
        { id: data.id, ...form },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setSuccess("Issue updated successfully!");
        await fetchBooks();
        await fetchIssues();
        setTimeout(() => {
          closePopUp();
        }, 1500);
      } else {
        setError(response.data.error || "Failed to update issue");
      }
    } catch (err) {
      console.error("Edit issue error:", err);
      setError("Error updating issue. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = issues.filter((item) => {
    const match =
      (item.userId?.toString().toLowerCase().includes(search.toLowerCase()) ||
      item.bookid?.toString().includes(search));
    
    if (tab === "overdue") return match && isOverdue(item.dueDate);
    if (tab === "issued") return match && !isOverdue(item.dueDate);
    return match;
  });

  const getBookDetails = (bookId) => {
    const book = books.find(b => b.id == bookId);
    return book ? `${book.Bname} (Available: ${book.available || 0}/${book.quantity || 1})` : 'Unknown Book';
  };

  const getMemberDetails = (memberId) => {
    const member = members.find(m => m.id == memberId);
    return member ? member.Mname : 'Unknown Member';
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex pt-17">
        <Nav />
        <div className="flex-1 p-6">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row bg-gray-200 justify-between items-start md:items-center gap-4 p-4 rounded-lg mb-4">
            <div className="flex flex-wrap gap-2">
              {isAdmin && (
                <button
                  onClick={() => openPopUp(null, "add")}
                  className="flex gap-2 cursor-pointer justify-center items-center bg-red-600 text-white px-4 py-2 rounded-lg shadow active:scale-95 hover:bg-red-700"
                >
                  <CirclePlus size={18} />
                  Issue Book
                </button>
              )}
              <button
                onClick={() => setTab("issued")}
                className={`px-4 py-2 cursor-pointer active:scale-95 rounded-lg shadow transition-colors ${
                  tab === "issued" ? "bg-blue-700 text-white" : "bg-gray-300 hover:bg-gray-400"
                }`}
              >
                Issued ({issues.filter(i => !isOverdue(i.dueDate)).length})
              </button>
              <button
                onClick={() => setTab("overdue")}
                className={`px-4 py-2 cursor-pointer active:scale-95 rounded-lg shadow transition-colors ${
                  tab === "overdue" ? "bg-red-700 text-white" : "bg-gray-300 hover:bg-gray-400"
                }`}
              >
                Overdue ({issues.filter(i => isOverdue(i.dueDate)).length})
              </button>
            </div>

            <div className="flex gap-2 bg-white px-3 py-2 rounded-lg shadow items-center w-full md:w-auto">
              <Search className="text-gray-500" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by User ID or Book ID"
                className="outline-none text-sm w-full"
              />
            </div>
          </div>

          <div className="flex justify-between items-center mb-3">
            <p className="text-sm text-gray-600">
              Today (BS): <b>{todayBS}</b> | (AD): <b>{todayAD}</b>
            </p>
            <p className="text-sm text-gray-600">
              Total: <b>{filteredData.length}</b> records
            </p>
          </div>

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

          <div className="overflow-x-auto rounded-xl">
            <table className="w-full bg-white rounded-lg shadow">
              <thead className="bg-gray-100">
                <tr >
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Book ID</th>
                  <th className="p-3 text-left hidden md:table-cell">Book Details</th>
                  <th className="p-3 text-left">User ID</th>
                  <th className="p-3 text-left hidden md:table-cell">Member</th>
                  <th className="p-3 text-left">Total Books</th>
                  <th className="p-3 text-left">Due Date</th>
                  <th className="p-3 text-left">Issued Date</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center p-4 text-gray-500">
                      No records found
                    </td>
                  </tr>
                ) : (
                  filteredData.map((i) => (
                    <tr key={i.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{i.id}</td>
                      <td className="p-3 font-medium ">{i.bookid}</td>
                      <td className="p-3 hidden md:table-cell text-sm ">
                        {getBookDetails(i.bookid)}
                      </td>
                      
                      <td className="p-3">{i.userId}</td>
                      <td className="p-3 hidden md:table-cell text-sm ">
                        {getMemberDetails(i.userId)}
                      </td>
                      <td className="p-3">{i.books}</td>
                      <td className="p-3">{i.dueDate}</td>
                      <td className="p-3 text-sm">{i.issuedAt}</td>
                      <td className="p-3">
                        {isOverdue(i.dueDate) ? (
                          <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
                            Overdue
                          </span>
                        ) : (
                          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                            Issued
                          </span>
                        )}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => openPopUp(i, "view")}
                            title="View Details"
                            className="text-green-600 cursor-pointer hover:scale-110"
                          >
                            <SquareChartGantt size={18} />
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => openPopUp(i, "edit")}
                              title="Edit"
                              className="text-blue-600 cursor-pointer hover:scale-110"
                            >
                              <FilePenLine size={18} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* PopUp */}
      {open && (
        <PopUp
          title={
            mode === "add" ? "Issue New Book" : 
            mode === "view" ? "Issue Book Details" : 
            "Edit Issue"
          }
          onclose={closePopUp}
        >
          {mode === "view" && data && (
            <div className="space-y-3">
              <p><span className="font-semibold">Issue ID:</span> {data.id}</p>
              <p><span className="font-semibold">Book ID:</span> {data.bookid}</p>
              <p><span className="font-semibold">Book Details:</span> {getBookDetails(data.bookid)}</p>
              <p><span className="font-semibold">User ID:</span> {data.userId}</p>
              <p><span className="font-semibold">Member Name:</span> {getMemberDetails(data.userId)}</p>
              <p><span className="font-semibold">Number of Books:</span> {data.books}</p>
              <p><span className="font-semibold">Due Date (BS):</span> {data.dueDate}</p>
              <p><span className="font-semibold">Issued Date:</span> {data.issuedAt} {data.issueTime}</p>
              <p><span className="font-semibold">Status:</span> 
                <span className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${
                  isOverdue(data.dueDate) 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {isOverdue(data.dueDate) ? 'Overdue' : 'Issued'}
                </span>
              </p>
            </div>
          )}

          {(mode === "add" || mode === "edit") && isAdmin && (
            <form onSubmit={mode === "add" ? addIssue : editIssue} className="space-y-4">
              {error && (
                <div className="bg-red-100 text-red-700 p-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              {success && (
                <div className="bg-green-100 text-green-700 p-3 rounded-lg text-sm">
                  {success}
                </div>
              )}

              <div>
                <label className="block font-semibold mb-1">Book ID:</label>
                <input
                  name="bookid"
                  value={form.bookid}
                  onChange={handleChange}
                  placeholder="Enter Book ID"
                  required
                  className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  list="books"
                />
                <datalist id="books">
                  {books.map(book => (
                    <option key={book.id} value={book.id}>
                      ID: {book.id} - {book.Bname} (Available: {book.available}/{book.quantity})
                    </option>
                  ))}
                </datalist>
                {form.bookid && availabilityCheck.message && (
                  <p className={`text-sm mt-1 ${availabilityCheck.available ? 'text-green-600' : 'text-red-600'}`}>
                    {availabilityCheck.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-1">Member ID:</label>
                <input
                  name="userId"
                  value={form.userId}
                  onChange={handleChange}
                  placeholder="Enter Member ID"
                  required
                  className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                  list="members"
                />
                <datalist id="members">
                  {members.map(member => (
                    <option key={member.id} value={member.id}>
                      ID: {member.id} - {member.Mname}
                    </option>
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block font-semibold mb-1">Number of Books:</label>
                <input
                  name="books"
                  type="number"
                  min="1"
                  max={availabilityCheck.maxAvailable || undefined}
                  value={form.books}
                  onChange={handleChange}
                  required
                  className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Due Date (BS): <span className="text-sm font-normal text-gray-600">(Today: {todayBS})</span>
                </label>
                <input
                  name="dueDate"
                  value={form.dueDate}
                  onChange={handleChange}
                  placeholder="YYYY-MM-DD"
                  required
                  className="w-full border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <p className="text-xs text-gray-500 mt-1">Format: YYYY-MM-DD (Nepali Date)</p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closePopUp}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 cursor-pointer transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || (form.bookid && !availabilityCheck.available)}
                  className={`flex-1 px-4 py-2 text-white rounded-lg cursor-pointer transition-colors ${
                    mode === "add" 
                      ? "bg-green-600 hover:bg-green-700" 
                      : "bg-blue-600 hover:bg-blue-700"
                  } ${(loading || (form.bookid && !availabilityCheck.available)) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? 'Processing...' : (mode === "add" ? "Issue Book" : "Update Issue")}
                </button>
              </div>
            </form>
          )}
        </PopUp>
      )}

      <Footer />
    </div>
  );
};

export default Issue;