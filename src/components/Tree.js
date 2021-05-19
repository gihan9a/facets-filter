import React, { useState } from "react";

import styles from "./styles.module.css";

/**
 * Branch component
 *
 * @param {object} props
 * 
 * @returns {ReactElement}
 */
function Branch({ child, onCheckToggle, path }) {
  const [showChildren, setShowChildren] = useState(false);

  return (
    <li>
      <div>
        <input
          type="checkbox"
          data-testid={`chk-box-${child.node.id}`}
          checked={child.isChecked}
          onChange={(e) => {
            onCheckToggle(e.target.checked, path);
          }}
        />
        <span
          role="button"
          tabIndex="0"
          onClick={() => {
            setShowChildren((state) => !state);
          }}
        >
          {child.node.name}
        </span>
      </div>
      {showChildren === true && child.children.length > 0 && (
        <Tree tree={child} onCheckToggle={onCheckToggle} path={path} />
      )}
    </li>
  );
}

/**
 * Tree Component
 *
 * @param {object} props
 * 
 * @returns {ReactElement}
 */
export default function Tree({ tree, onCheckToggle, path = [] }) {
  return (
    <ul className={styles.tree}>
      {tree.children.map((child, idx) => (
        <Branch
          key={child.id}
          child={child}
          onCheckToggle={onCheckToggle}
          path={[...path, idx]}
        />
      ))}
    </ul>
  );
}
