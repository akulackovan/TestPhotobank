import {
    render,
    screen,
    fireEvent,
    cleanup,
    waitFor
  } from "@testing-library/react";
  import Cropper from "../components/Cropper/Cropper";
  import React from "react";
  import "@testing-library/jest-dom";
  import axios from "axios";
  import { act } from 'react-dom/test-utils';
  
  import userEvent from "@testing-library/user-event";


  
describe("Cropper component", () => {

    it("Should have components", async () => {
        render(<Cropper setData={(value) => {console.log(value)}}/>);
        const fileInput = (await screen.findByTitle("Выбрать изображение"));
        const canvas = document.createElement("canvas");
        canvas.width = 600;
        canvas.height = 400;
    
        // generate file for userEvent.upload method
        canvas.toBlob(async (blob) => {
          const file = new File([blob], "image.png", {
            type: "image/png"
          });
    
          userEvent.upload(fileInput, file);
    
          expect(uploadPhoto).toHaveBeenCalledTimes(1);
        });


  });
});