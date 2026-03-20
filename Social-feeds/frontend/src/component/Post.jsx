import React, { useEffect, useState } from "react";
import axios from "axios";

const Post = () => {
  const [post, setPost] = useState([
    {
      _id: "1",
      image:
        "https://www.bigfootdigital.co.uk/wp-content/uploads/2020/07/image-optimisation-scaled.jpg",
      caption: "Hello hi",
    },
  ]);

  useEffect(() => {
    axios.get("http://localhost:3000/posts").then((res) => {
      setPost(res.data.posts);
    });
  }, []);

  return (
    <section className="min-h-screen bg-stone-950 px-4 py-12">
      {/* Header */}
      <div className="max-w-xl mx-auto mb-10">
        <h1 className="text-white text-4xl font-bold tracking-tight font-serif">
          Feed
        </h1>
        <p className="text-stone-500 text-sm mt-1 tracking-widest uppercase">
          {post.length} {post.length === 1 ? "post" : "posts"}
        </p>
        <div className="mt-4 h-px bg-gradient-to-r from-amber-400 via-stone-600 to-transparent" />
      </div>

      {/* Posts */}
      <div className="max-w-xl mx-auto flex flex-col gap-8">
        {post.length > 0 ? (
          post.map((item, index) => (
            <article
              key={item._id}
              className="group relative bg-stone-900 rounded-2xl overflow-hidden shadow-lg shadow-black/50 border border-stone-800 hover:border-amber-400/40 transition-all duration-300"
            >
              {/* Post number badge */}
              <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-sm text-amber-400 text-xs font-mono px-2 py-1 rounded-full border border-amber-400/30">
                #{String(index + 1).padStart(2, "0")}
              </div>

              {/* Image */}
              <div className="relative overflow-hidden">
                <img
                  src={item.image}
                  alt="post"
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-transparent opacity-80" />
              </div>

              {/* Caption */}
              <div className="px-5 py-4">
                <p className="text-stone-200 text-base font-light leading-relaxed tracking-wide font-serif">
                  {item.caption}
                </p>

                {/* Footer row */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-stone-800">
                  <div className="flex gap-3">
                    {/* Like button */}
                    <button className="flex items-center gap-1.5 text-stone-500 hover:text-rose-400 transition-colors text-sm group/btn">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 group-hover/btn:scale-125 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                      </svg>
                      Like
                    </button>

                    {/* Comment button */}
                    <button className="flex items-center gap-1.5 text-stone-500 hover:text-sky-400 transition-colors text-sm">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      Comment
                    </button>
                  </div>

                  {/* Share */}
                  <button className="text-stone-600 hover:text-amber-400 transition-colors">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 rounded-full border-2 border-dashed border-stone-700 flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-7 h-7 text-stone-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-stone-500 font-serif text-lg">No posts yet</p>
            <p className="text-stone-700 text-sm mt-1">
              Posts will appear here once available
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Post;
