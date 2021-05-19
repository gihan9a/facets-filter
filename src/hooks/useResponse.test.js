import { renderHook, act } from "@testing-library/react-hooks";

import useResponse from "./useResponse";

test("should get response", () => {
  const { result } = renderHook(() => useResponse());

  act(() => {
    const tree = result.current();
    expect(tree).not.toBeUndefined();
    expect(tree.id).toEqual("0");
    expect(tree.children).toHaveLength(3);
    expect(tree.children[1].children).toHaveLength(2);
  });
});
