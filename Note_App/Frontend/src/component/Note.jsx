import React, { useEffect, useState } from "react";
import { Pencil, X, Plus, StickyNote } from "lucide-react";
import axios from "axios";

const BASE_URL = "http://localhost:3000/api/note";

const Note = () => {
  const [list, setList] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(BASE_URL);
      setList(response.data.notes);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const submitHandle = async (e) => {
    e.preventDefault();
    if (title.trim() === "" || description.trim() === "") {
      return alert("All fields are required.");
    }
    try {
      if (editId) {
        await axios.patch(`${BASE_URL}/${editId}`, { title, description });
        setEditId(null);
      } else {
        await axios.post(BASE_URL, { title, description });
      }
      setTitle("");
      setDescription("");
      fetchNotes();
    } catch (error) {
      console.error("Failed to save note:", error);
    }
  };

  const deletebtn = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      fetchNotes();
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  const editbtn = (item) => {
    setTitle(item.title);
    setDescription(item.description);
    setEditId(item._id);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 flex flex-col md:flex-row gap-8 font-sans">
      
      {/* LEFT SIDE: Form */}
      <div className="md:w-1/3 lg:w-1/4">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 sticky top-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <StickyNote size={20} />
            </div>
            <h2 className="text-xl font-bold text-slate-800">
              {editId ? "Edit Note" : "New Note"}
            </h2>
          </div>
          
          <form onSubmit={submitHandle} className="flex flex-col gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all text-slate-800"
                type="text"
                placeholder="Meeting notes..."
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-500 uppercase ml-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/5 transition-all min-h-[120px] text-slate-700"
                placeholder="Details go here..."
              ></textarea>
            </div>

            <button
              type="submit"
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold transition-all active:scale-[0.98] shadow-lg ${
                editId 
                ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200" 
                : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200"
              }`}
            >
              {editId ? <Pencil size={18} /> : <Plus size={18} />}
              {editId ? "Update Note" : "Create Note"}
            </button>
            
            {editId && (
              <button 
                type="button" 
                onClick={() => {setEditId(null); setTitle(""); setDescription("");}}
                className="text-slate-400 text-sm hover:text-slate-600 transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </form>
        </div>
      </div>

      {/* RIGHT SIDE: Notes Grid */}
      <div className="flex-1">
        <h1 className="text-3xl font-black text-slate-900 mb-6 flex items-center gap-3">
          Your Collection
          <span className="text-sm font-medium bg-slate-200 px-3 py-1 rounded-full text-slate-600">
            {list.length}
          </span>
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {list.length > 0 ? (
            list.map((item) => (
              <div
                key={item._id}
                className="group relative bg-white border border-slate-200 rounded-3xl p-6 transition-all hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              >
                {/* Action Buttons */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => editbtn(item)}
                    className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => deletebtn(item._id)}
                    className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                  >
                    <X size={16} />
                  </button>
                </div>

                <h2 className="text-xl font-bold text-slate-800 pr-16 mb-3 line-clamp-1">
                  {item.title}
                </h2>
                <p className="text-slate-600 leading-relaxed line-clamp-4 text-sm">
                  {item.description}
                </p>
                
                {/* Decorative bottom bar */}
                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-3xl">
              <p className="text-slate-400 font-medium">No notes found. Start by creating one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Note;
