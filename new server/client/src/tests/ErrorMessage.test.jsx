import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";

import ErrorMessage from "../components/ErrorMessage/ErrorMessage";

describe("Error message component", () => {
    it("Checking the error message component", () => {
        render( <ErrorMessage msg={"Заполнены не все поля"} /> );
        const errorMessage = screen.getByTestId("errorMessage");
        expect(errorMessage).toBeInTheDocument();
        expect(screen.getByText("Заполнены не все поля")).toBeInTheDocument();
        expect(errorMessage.style.height).toBe("300px");
        expect(errorMessage.style.width).toBe("400px");
        expect(errorMessage.style.zIndex).toBe("999999");
    });
});