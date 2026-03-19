import {
  FileText,
  CirclePlus,
  FilePenLine,
  Search,
  Trash2,
  Package,
} from "lucide-react";
import Header from "../component/Header";
import Nav from "../component/Nav";
import { useEffect, useState } from "react";
import PopUp from "../component/PopUp";
import Footer from "../component/Footer";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Books = () => {
  // Role base permission
  const { currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";
  const isLibrarian = currentUser?.role === "librarian";

  const canAddEdit = isAdmin || isLibrarian;
  const canDelete = isAdmin;

  // useStates
  const [books, setBooks] = useState([]);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [mode, setMode] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    name: "",
    type: "",
    author: "",
    language: "",
    publisher: "",
    price: "",
    quantity: "1", // Add quantity field
  });

  // Fetch books with issue count to calculate availability
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const [booksRes, issuesRes] = await Promise.all([
        axios.get("http://localhost/copy/api/books/get.php"),
        axios.get("http://localhost/copy/api/issue/get.php"),
      ]);

      const issues = Array.isArray(issuesRes.data) ? issuesRes.data : [];

      // Count how many times each book is issued
      const issuedCount = {};
      issues.forEach(issue => {
        if (issue.status !== 'returned') {
          issuedCount[issue.bookid] = (issuedCount[issue.bookid] || 0) + parseInt(issue.books || 1);
        }
      });

      const mapped = Array.isArray(booksRes.data)
        ? booksRes.data.map((b) => {
            const totalQuantity = parseInt(b.quantity) || 1;
            const issued = issuedCount[b.id] || 0;
            const available = Math.max(0, totalQuantity - issued);
            
            return {
              id: b.id,
              name: b.Bname,
              type: b.Btype,
              author: b.Bauthor,
              publisher: b.Bpublisher,
              language: b.Blanguage,
              price: b.Bprice,
              quantity: totalQuantity,
              available: available,
              status: available > 0 ? "Available" : "Unavailable",
              date: new Date().toLocaleString(),
            };
          })
        : [];

      setBooks(mapped);
      setError("");
    } catch (e) {
      console.error("Fetch books error:", e);
      setError("Failed to fetch books");
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  // for popUp
  const openPopUp = (type, book = null) => {
    // Role-based permissions
    if ((type === "add" || type === "edit") && !canAddEdit) {
      return;
    }
    if (type === "delete" && !canDelete) {
      return;
    }

    setError("");
    setSuccess("");
    setMode(type);
    setData(book);

    if (type === "edit" && book) {
      setForm({
        name: book.name,
        type: book.type,
        author: book.author,
        publisher: book.publisher,
        language: book.language,
        price: book.price,
        quantity: book.quantity.toString(),
      });
    } else {
      setForm({
        name: "",
        type: "",
        author: "",
        publisher: "",
        language: "",
        price: "",
        quantity: "1",
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

  // for Search
  const filterBook = books.filter(
    (b) =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.type.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toString().includes(search)
  );

  // for submit
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  // Validation
  const validateForm = () => {
    if (!form.name.trim()) {
      setError("Book name is required");
      return false;
    }
    if (!form.type.trim()) {
      setError("Book type is required");
      return false;
    }
    if (!form.author.trim()) {
      setError("Author name is required");
      return false;
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      setError("Price must be greater than 0");
      return false;
    }
    if (!form.quantity || parseInt(form.quantity) < 1) {
      setError("Quantity must be at least 1");
      return false;
    }
    return true;
  };

  // for add
  const addBook = async (e) => {
    e.preventDefault();
    if (!canAddEdit) return;
    
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "http://localhost/copy/api/books/add.php",
        {
          ...form,
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity),
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.success || response.data.message) {
        setSuccess("Book added successfully!");
        await fetchBooks();
        setTimeout(() => {
          closePopUp();
        }, 1500);
      } else {
        setError(response.data.error || "Failed to add book");
      }
    } catch (err) {
      console.error("Add error:", err);
      setError("Error adding book. Please try again.");
    }
  };

  // 
  // Add this function to check book availability
const checkBookAvailability = async (bookId, requestedQuantity) => {
  try {
    const res = await axios.get(`http://localhost/copy/api/books/get.php?id=${bookId}`);
    const book = Array.isArray(res.data) ? res.data.find(b => b.id == bookId) : res.data;
    
    if (!book) {
      return { available: false, message: "Book not found" };
    }
    
    const available = book.available || 0;
    if (available < requestedQuantity) {
      return { 
        available: false, 
        message: `Only ${available} copy(s) available. You requested ${requestedQuantity}.` 
      };
    }
    
    return { available: true, book };
  } catch (err) {
    console.error("Error checking availability:", err);
    return { available: false, message: "Error checking book availability" };
  }
};

// Then in your addIssue function, add this check:
const addIssue = async (e) => {
  e.preventDefault();
  if (!isAdmin) return;
  
  setError("");
  setSuccess("");
  setLoading(true);

  // Check book availability
  const availabilityCheck = await checkBookAvailability(form.bookid, parseInt(form.books));
  if (!availabilityCheck.available) {
    setError(availabilityCheck.message);
    setLoading(false);
    return;
  }

  // Rest of your validation and submission code...
};
  // for edit
  const editBook = async (e) => {
    e.preventDefault();
    if (!canAddEdit) return;
    
    if (!validateForm()) return;

    try {
      const response = await axios.post(
        "http://localhost/copy/api/books/edit.php",
        { 
          id: data.id, 
          ...form, 
          price: parseFloat(form.price),
          quantity: parseInt(form.quantity),
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success || response.data.message) {
        setSuccess("Book updated successfully!");
        await fetchBooks();
        setTimeout(() => {
          closePopUp();
        }, 1500);
      } else {
        setError(response.data.error || "Failed to update book");
      }
    } catch (err) {
      console.error("Edit error:", err);
      setError("Error updating book. Please try again.");
    }
  };

  // for delete
  const deleteBook = async () => {
    if (!canDelete) return;

    try {
      const response = await axios.post(
        "http://localhost/copy/api/books/delete.php",
        { id: data.id },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success || response.data.message) {
        setSuccess("Book deleted successfully!");
        await fetchBooks();
        setTimeout(() => {
          closePopUp();
        }, 1500);
      } else {
        setError(response.data.error || "Failed to delete book");
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError("Error deleting book. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex pt-17 flex-row md:flex-row">
        <Nav />

        <div className="flex-1 p-4 md:p-6">
          {/* Top Bar */}
          <div className="flex flex-col md:flex-row bg-gray-200 gap-3 md:gap-0 justify-between items-start md:items-center p-4 rounded-lg mb-4">
            <div>
              <h1 className="font-semibold text-xl md:text-2xl">Book Management</h1>
              {!canAddEdit && !canDelete && (
                <span className="text-sm text-gray-600 mt-1 block">View Only Mode</span>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              {canAddEdit && (
                <button
                  onClick={() => openPopUp("add")}
                  className="flex gap-2 cursor-pointer justify-center items-center bg-black text-white px-4 py-2 rounded-lg shadow active:scale-95 w-full sm:w-auto"
                >
                  <CirclePlus className="bg-white text-black rounded-full p-1" />
                  Add Book
                </button>
              )}

              <div className="flex gap-2 bg-white px-3 py-2 rounded-lg shadow items-center w-full sm:w-auto">
                <Search className="text-gray-500" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Search by Name, Type or ID"
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

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-gray-600 text-sm">Total Books</h4>
              <p className="text-2xl font-bold text-blue-700">{books.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-gray-600 text-sm">Total Copies</h4>
              <p className="text-2xl font-bold text-green-700">
                {books.reduce((sum, book) => sum + (book.quantity || 1), 0)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-gray-600 text-sm">Available Copies</h4>
              <p className="text-2xl font-bold text-green-600">
                {books.reduce((sum, book) => sum + (book.available || 0), 0)}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
              <h4 className="text-gray-600 text-sm">Unavailable Books</h4>
              <p className="text-2xl font-bold text-red-600">
                {books.filter(book => book.available === 0).length}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full bg-white rounded-lg shadow text-sm md:text-base">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left hidden md:table-cell">Type</th>
                  <th className="p-3 text-left hidden lg:table-cell">Author</th>
                  <th className="p-3 text-left hidden md:table-cell">Language</th>
                  <th className="p-3 text-left">Total</th>
                  <th className="p-3 text-left">Available</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="9" className="text-center p-4">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                        <span className="ml-2">Loading Books...</span>
                      </div>
                    </td>
                  </tr>
                ) : filterBook.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center p-4">No Books found</td>
                  </tr>
                ) : (
                  filterBook.map((b) => (
                    <tr key={b.id} className="border-t hover:bg-gray-50">
                      <td className="p-3">{b.id}</td>
                      <td className="p-3 font-medium">{b.name}</td>
                      <td className="p-3 hidden md:table-cell">{b.type}</td>
                      <td className="p-3 hidden lg:table-cell">{b.author}</td>
                      <td className="p-3 hidden md:table-cell">{b.language}</td>
                      <td className="p-3">{b.quantity}</td>
                      <td className="p-3">
                        <span className={`font-semibold ${
                          b.available > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {b.available}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-semibold ${
                          b.available > 0 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {b.available > 0 ? 'Available' : 'Unavailable'}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => openPopUp("view", b)}
                            title="View"
                            className="text-green-600 cursor-pointer hover:scale-110"
                          >
                            <FileText size={18} />
                          </button>

                          {canAddEdit && (
                            <button
                              onClick={() => openPopUp("edit", b)}
                              title="Edit"
                              className="text-blue-600 cursor-pointer hover:scale-110"
                            >
                              <FilePenLine size={18} />
                            </button>
                          )}

                          {canDelete && (
                            <button
                              onClick={() => openPopUp("delete", b)}
                              title="Delete"
                              className="text-red-600 cursor-pointer hover:scale-110"
                            >
                              <Trash2 size={18} />
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
            mode === "view"
              ? "Book Details"
              : mode === "add"
              ? "Add New Book"
              : mode === "edit"
              ? "Edit Book"
              : "Delete Book"
          }
          onclose={closePopUp}
        >
          {mode === "view" && data && (
            <div className="space-y-2">
              <p><span className="font-semibold">ID:</span> {data.id}</p>
              <p><span className="font-semibold">Name:</span> {data.name}</p>
              <p><span className="font-semibold">Type:</span> {data.type}</p>
              <p><span className="font-semibold">Author:</span> {data.author}</p>
              <p><span className="font-semibold">Publisher:</span> {data.publisher}</p>
              <p><span className="font-semibold">Language:</span> {data.language}</p>
              <p><span className="font-semibold">Price:</span> Rs. {data.price}</p>
              <p><span className="font-semibold">Total Quantity:</span> {data.quantity}</p>
              <p><span className="font-semibold">Available:</span> {data.available}</p>
              <p><span className="font-semibold">Added Date:</span> {data.date}</p>
              <p><span className="font-semibold">Status:</span> 
                <span className={`ml-2 px-3 py-1 rounded-full text-xs ${
                  data.available > 0 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {data.status}
                </span>
              </p>
            </div>
          )}

          {(mode === "add" || mode === "edit") && canAddEdit && (
            <form
              onSubmit={mode === "add" ? addBook : editBook}
              className="p-2 rounded-xl bg-gray-100 gap-3 grid"
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

              <div className="grid gap-1">
                <label className="font-semibold">Book Name:</label>
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  type="text"
                  placeholder="C-Programming"
                  className="border rounded-lg outline-none hover:border-gray-600 p-2"
                />
              </div>

              <div className="grid gap-1">
                <label className="font-semibold">Book Type:</label>
                <input
                  required
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  type="text"
                  placeholder="Programming"
                  className="border rounded-lg outline-none hover:border-gray-600 p-2"
                />
              </div>

              <div className="grid gap-1">
                <label className="font-semibold">Author:</label>
                <input
                  required
                  name="author"
                  value={form.author}
                  onChange={handleChange}
                  type="text"
                  placeholder="Sumit Bhujel"
                  className="border rounded-lg outline-none hover:border-gray-600 p-2"
                />
              </div>

              <div className="grid gap-1">
                <label className="font-semibold">Publisher:</label>
                <input
                  required
                  name="publisher"
                  value={form.publisher}
                  onChange={handleChange}
                  type="text"
                  placeholder="Asmita publication"
                  className="border rounded-lg outline-none hover:border-gray-600 p-2"
                />
              </div>

              <div className="grid gap-1">
                <label className="font-semibold">Language:</label>
                <input
                  required
                  name="language"
                  value={form.language}
                  onChange={handleChange}
                  type="text"
                  placeholder="English"
                  className="border rounded-lg outline-none hover:border-gray-600 p-2"
                />
              </div>

              <div className="grid gap-1">
                <label className="font-semibold">Price (Rs.):</label>
                <input
                  required
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="400"
                  className="border rounded-lg outline-none hover:border-gray-600 p-2"
                />
              </div>

              <div className="grid gap-1">
                <label className="font-semibold">Quantity:</label>
                <input
                  required
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  type="number"
                  min="1"
                  step="1"
                  placeholder="1"
                  className="border rounded-lg outline-none hover:border-gray-600 p-2"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closePopUp}
                  className="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`flex-1 px-4 py-2 text-white rounded-lg cursor-pointer ${
                    mode === "add" ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {mode === "add" ? "Add Book" : "Update Book"}
                </button>
              </div>
            </form>
          )}

          {mode === "delete" && canDelete && data && (
            <>
              <p className="m-5">
                Are you sure you want to delete <b>{data.name}</b>?
              </p>
              {error && (
                <div className="bg-red-100 text-red-700 p-2 rounded-lg text-sm mx-5 mb-3">
                  {error}
                </div>
              )}
              <div className="flex justify-center px-2 gap-3">
                <button
                  onClick={closePopUp}
                  className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-700 text-white rounded-lg hover:bg-red-800 cursor-pointer"
                  onClick={deleteBook}
                >
                  Delete
                </button>
              </div>
            </>
          )}

          {!canAddEdit && !canDelete && mode !== "view" && mode !== "" && (
            <p className="text-red-600 text-center p-4">
              You don't have permission to {mode} books.
            </p>
          )}
        </PopUp>
      )}

      <Footer />
    </div>
  );
};

export default Books;