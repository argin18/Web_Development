import { Edit, Trash2 } from "lucide-react";
import React from "react";

const List = ({ list, onDelete, onEdit }) => {
  return (
    <div>
      <ul>
        {list.map((item, index) => (
          <li className="list" key={index}>
            {item}
            <button className="delete" onClick={() => onDelete(index)}>
              {" "}
              <Trash2 size={16} />
            </button>
            <button className="edit" onClick={() => onEdit(index)}>
              <Edit size={16} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default List;
