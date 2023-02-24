import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from "@testing-library/react";
import Cropper from "../components/Cropper/Cropper";
import React from "react";
import "@testing-library/jest-dom";
import axios from "axios";
import { act } from "react-dom/test-utils";

import userEvent from "@testing-library/user-event";

describe("Cropper component", () => {
  it("Should have components", async () => {
    window.URL.createObjectURL = function () {};
    const file = new File(["test file content"], "test.jpg", {
      type: "image/jpeg",
    });
    render(
      <Cropper
        setData={(value) => {
          console.log(value);
        }}
      />
    );
    let uploader = screen.getByTestId("input");

    fireEvent.change(uploader, { target: { files: [file] } });

    uploader = await screen.getByTestId("photo");
  });
});
