import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [captionText, setCaptionText] = useState("");
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select an image");
      return;
    }

    const data = new FormData();
    data.append("image", selectedFile);
    data.append("caption", captionText);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/create-post", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/");
      console.log(res.data);
    } catch (error) {
      console.error(error.response?.data || error.message);
      alert("Error creating post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen bg-stone-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-white text-4xl font-bold tracking-tight font-serif">
            New Post
          </h1>
          <p className="text-stone-500 text-sm mt-1 tracking-widest uppercase">
            Share a moment
          </p>
          <div className="mt-4 h-px bg-gradient-to-r from-amber-400 via-stone-600 to-transparent" />
        </div>

        {/* Card */}
        <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden shadow-xl shadow-black/50">

          {/* Image Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            className="relative"
          >
            {preview ? (
              <div className="relative group">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <label className="cursor-pointer text-white text-sm font-mono tracking-widest uppercase border border-white/40 px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
                    Change Image
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-60 pointer-events-none" />
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-56 cursor-pointer border-b border-stone-800 bg-stone-950/60 hover:bg-stone-800/40 transition-colors">
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-stone-600 flex items-center justify-center mb-3 group-hover:border-amber-400 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-6 h-6 text-stone-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    />
                  </svg>
                </div>
                <p className="text-stone-400 text-sm font-serif">
                  Drop image here or{" "}
                  <span className="text-amber-400 underline underline-offset-2">
                    browse
                  </span>
                </p>
                <p className="text-stone-600 text-xs mt-1 font-mono">
                  PNG, JPG, WEBP supported
                </p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
            )}
          </div>

          {/* Form Fields */}
          <div className="p-5 flex flex-col gap-4">
            {/* Caption input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-stone-500 text-xs font-mono tracking-widest uppercase">
                Caption
              </label>
              <textarea
                placeholder="Write something about this post..."
                required
                rows={3}
                className="bg-stone-950 text-stone-200 placeholder-stone-600 border border-stone-800 rounded-xl px-4 py-3 text-sm font-serif resize-none focus:outline-none focus:border-amber-400/60 transition-colors"
                value={captionText}
                onChange={(e) => setCaptionText(e.target.value)}
              />
            </div>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-amber-400 hover:bg-amber-300 disabled:bg-stone-700 disabled:text-stone-500 text-stone-950 font-bold font-mono tracking-widest uppercase text-sm py-3 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    />
                  </svg>
                  Posting...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                  Publish Post
                </>
              )}
            </button>

            {/* Back link */}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-stone-600 hover:text-stone-400 text-xs font-mono tracking-widest uppercase text-center transition-colors"
            >
              ← Back to feed
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Upload;
