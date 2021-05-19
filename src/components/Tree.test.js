import { render, screen } from "@testing-library/react";
import Tree from "./Tree";

const getNode = (name, parent, count) => ({
  name,
  parent,
  count,
});

test("renders the tree", () => {
  const tree = {
    id: "0",
    children: [
      {
        id: "1234",
        children: [],
        node: getNode("First", "0", 2),
      },
    ],
  };
  render(<Tree tree={tree} />);
  const firstChild = screen.getByText(/first/i);
  expect(firstChild).toBeInTheDocument();
});

const tree1 = {
  id: "0",
  children: [
    {
      id: "1234",
      children: [
        {
          id: "4567",
          children: [],
          node: getNode("First Second", "2345", 3),
        },
      ],
      node: getNode("first", "0", 4),
    },
    {
      id: "1235",
      children: [
        {
          id: "4567",
          children: [],
          node: getNode("Second Second", "2346", 3),
        },
      ],
      node: getNode("Second", "2", 3),
    },
  ],
};

test("renders only the top level of tree", () => {
  render(<Tree tree={tree1} />);
  const secondChild = screen.getByText(/second/i)
  expect(secondChild).toBeInTheDocument();

  const firstSecondChild = screen.queryByText(/first second/i);
  expect(firstSecondChild).not.toBeInTheDocument();

});

test('show subtree once clicked on label', () => {
  render(<Tree tree={tree1} />);
  const first = screen.getByText(/first/i);
  first.click();
  const firstSecond = screen.getByText(/first second/i)
  expect(firstSecond).toBeInTheDocument();
})
