import { useCallback } from "react";
import { response } from "../response";

export default function useResponse() {
  return useCallback(() => {
    // validate response
    if (
      !response ||
      !response.data ||
      !response.data.categories ||
      response.data.categories.length === 0
    ) {
      return [];
    }

    const nodes = {};

    // build intermediate flat tree
    // this tree contains all nodes who are parents
    // with their children as arrays
    const flatTree = response.data.categories.reduce((prev, curr) => {
      nodes[curr.id] = curr;

      if (prev[curr.parent]) {
        prev[curr.parent].push(curr.id);

        return prev;
      }

      prev[curr.parent] = [curr.id];

      return prev;
    }, {});

    // sort every intermediate child base on their name attribute
    Object.keys(flatTree).forEach((key) => {
      flatTree[key].sort((a, b) => nodes[a].name.localeCompare(nodes[b].name));
    });

    // Now it's time to build the complete tree

    /**
     * get children recursively
     */
    const getChildren = (parentId) => {
      const node = {
        id: parentId,
        isChecked: false,
        children: [],
        node: nodes[parentId], // add reference
      };
      if (!flatTree[parentId]) {
        return node;
      }

      node.children = flatTree[parentId].reduce((prev, childId) => {
        prev.push(getChildren(childId));
        return prev;
      }, []);
      return node;
    };

    // ok we are done
    // return the complete tree
    const subTrees = flatTree["0"].reduce((prev, parentId) => {
      prev.push(getChildren(parentId));

      return prev;
    }, []);

    const tree = {
      id: "0",
      children: subTrees,
    };

    return tree;
  }, []);
}
