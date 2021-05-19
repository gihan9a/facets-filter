import { useState, useEffect } from "react";

import Tree from "./components/Tree";
import useResponse from "./hooks/useResponse";

import styles from "./App.module.css";

/**
 * Main app component
 *
 * @returns {ReactElement}
 */
function App() {
  const [tree, setTree] = useState();
  const [selected, setSelected] = useState([]);

  const load = useResponse();

  useEffect(() => {
    setTree(load());
  }, [load]);

  /**
   * Find current selection
   *
   * @param {object} state Current tree state
   * @returns {array} Selected nodes
   */
  const findSelection = (state, path = []) => {
    if (state.isChecked === true) {
      return [state.node, path];
    }

    let selection = [];
    state.children.forEach((child, idx) => {
      if (child.isChecked) {
        selection.push([child.node, [...path, idx]]);
      } else {
        selection = [...selection, ...findSelection(child, [...path, idx])];
      }
    });
    return selection;
  };

  /**
   * Toggle checkboxes
   *
   * @param {boolean} isChecked New state of checkbox
   * @param {array} path Path to the child node from root node
   */
  const onCheckToggle = (isChecked, path) => {
    setTree((state) => {
      const newState = { ...state };

      let toggled = newState;
      const parents = [];
      path.forEach((point) => {
        toggled = toggled.children[point];
        parents.push(toggled);
      });

      // remove last
      // because last node is the actual toggling node
      parents.pop();

      // travers the tree down
      const toggleAllChildren = (node) => {
        node.isChecked = isChecked;

        if (node.children.length === 0) {
          return;
        }

        node.children.forEach((child) => {
          toggleAllChildren(child);
        });
      };
      toggleAllChildren(toggled);

      // have not all siblings checked?
      if (parents.length > 0) {
        const allNotChecked = parents[parents.length - 1].children.some(
          (child) => {
            return child.isChecked === false;
          }
        );

        if (!allNotChecked) {
          parents[parents.length - 1].isChecked = true;
        } else {
          parents[parents.length - 1].isChecked = false;
        }
      }

      // again find final selection
      const selection_ = findSelection(newState);
      console.log("selection", selection_);
      setSelected(selection_);

      return newState;
    });
  };

  const dfsUnCheckAll = (parent) => {
    if (parent.isChecked !== undefined) {
      parent.isChecked = false;
    }

    parent.children.forEach((child) => {
      child.isChecked = false;
      dfsUnCheckAll(child);
    });
  };

  /**
   * Clear all selection
   */
  const clearAll = () => {
    setTree((state) => {
      const newState = { ...state };
      dfsUnCheckAll(newState);
      return newState;
    });
    setSelected([]);
  };

  /**
   * Clear selected category
   *
   * @param {object} category Category node
   * @param {array} path Path to the category from root node
   */
  const clearCategory = (category, path) => {
    console.log(path);
    setSelected((state) => state.filter((sel) => sel[0].id !== category.id));

    setTree((state) => {
      const newState = { ...state };
      let node = newState;
      path.forEach((idx) => {
        node = node.children[idx];
      });

      // set all children unchecked
      dfsUnCheckAll(node);

      return newState;
    });
  };

  // if tree is not ready yet
  // don't render
  if (tree === undefined) {
    return null;
  }

  return (
    <div className={styles.app}>
      <div className={styles.sidebar}>
        <Tree tree={tree} onCheckToggle={onCheckToggle} />
      </div>
      <div className={styles.content}>
        {selected.length > 0 && (
          <div className={styles.selectedContainer}>
            <div>
              <b>Selected categories: </b>
              <small role="button" tabIndex="0" onClick={clearAll}>
                (Clear All)
              </small>
            </div>
            <div>
              {selected.map(([category, path]) => {
                console.log("catg", category);
                return (
                  <span key={category.id} className={styles.selected}>
                    {category.name}
                    <button onClick={() => clearCategory(category, path)}>
                      X
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
