import React, { useState } from "react";
import List from "./List";
const Todo = () => {
  const [item, setItem] = useState("");
  const [list, setList] = useState([]);
  const [editIndex, setEditIndex] = useState(null);

  const add = () => {
    if (item.trim() === "") return alert("Please enter something..! ");
    if (editIndex !== null) {
      const updateList = [...list];
      updateList[editIndex] = item;
      setList(updateList);
      setEditIndex(null);
    } else {
      setList([...list, item]);
    }
    setItem("");
  };

  const hDelete = (e) => {
    const updateList = list.filter((_, i) => i !== e);
    setList(updateList);

    if (editIndex === e) setEditIndex(null);
  };

  const hEdit = (e) => {
    setItem(list[e]);
    setEditIndex(e);
  };
  return (
    <div className="sec">
      <input
        type="text"
        placeholder="add item"
        value={item}
        onChange={(e) => {
          setItem(e.target.value);
        }}
      />
      <button className="add" onClick={add}>{editIndex !== null ? "update " : "Add"}</button>
      <div>
        <List list={list} onDelete={hDelete} onEdit={hEdit} />
      </div>
    </div>
  );
};

export default Todo;
