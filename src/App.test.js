import { render, screen } from "@testing-library/react";
import App from "./App";

test("render the app", () => {
  render(<App />);
  const element = screen.getByText(/dames/i);
  expect(element).toBeInTheDocument();
});

test("click on tree render checkbox", () => {
  render(<App />);
  const dames = screen.queryByTestId("chk-box-14100");
  expect(dames).toBeInTheDocument();

  // click on checkbox should check the checkbox
  dames.click();
  expect(dames).toBeChecked();
});

test("click on node should show selected categories", () => {
  render(<App />);
  const dames = screen.queryByTestId("chk-box-14100");
  dames.click();

  // click on checkbox should show selected category
  const selectedCat = screen.getByText(/selected categories:/i);
  expect(selectedCat).toBeInTheDocument();

  // should add clear all button
  const clearAll = screen.getByText(/clear all/i);
  expect(clearAll).toBeInTheDocument();

  // dames should be in the selection
  const damesAll = screen.getAllByText(/dames/i)
  expect(damesAll).toHaveLength(2);
});

test("click on clear all should clear all selection", () => {
  render(<App />);
  const dames = screen.queryByTestId("chk-box-14100");
  dames.click();
  const kids = screen.queryByTestId("chk-box-14126");
  kids.click();

  // there should be 2 selected categories
  const selection = screen.getByTestId('selection');
  expect(selection.children).toHaveLength(2)

  const clearAll = screen.getByText(/clear all/i);
  clearAll.click();

  // clear all should remove the selection from dom
  const selection2 = screen.queryByTestId('selection');
  expect(selection2).not.toBeInTheDocument();

  // the tree should reflect the update
  expect(dames).not.toBeChecked();
  expect(kids).not.toBeChecked();
});

test('clear individual category', () => {
  render(<App />);
  const dames = screen.queryByTestId("chk-box-14100");
  dames.click();
  const kids = screen.queryByTestId("chk-box-14126");
  kids.click();

  // clear the dames from selection
  const btnClear = screen.queryByTestId("clear-14100")
  btnClear.click();

  // now selection should only contain 1 category
  const selection = screen.getByTestId('selection');
  expect(selection.children).toHaveLength(1)

  // selection clear should reflect on tree
  expect(dames).not.toBeChecked();
  expect(kids).toBeChecked();
})
