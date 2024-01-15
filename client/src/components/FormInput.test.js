import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import FormInput from "./FormInput";

describe("FormInput", () => {
  test("updates on change", () => {
    const mockHandleChange = jest.fn();
    const testValue = "Test Input";

    render(
      <FormInput
        labelName="用戶名稱"
        id="name"
        type="text"
        inputName="roomPassword"
        value={testValue}
        handleChange={mockHandleChange}
      />
    );

    const input = screen.getByLabelText("用戶名稱 :");

    fireEvent.change(input, { target: { value: testValue } });

    expect(input.value).toEqual(testValue);
  });
});
