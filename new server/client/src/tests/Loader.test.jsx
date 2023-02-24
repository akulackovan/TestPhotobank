import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";

import Loader from "../components/Loader/Loader";

describe("Loader component", () => {
    it("Checking the loader component", () => {
        render( <Loader /> );
        expect(screen.getByTitle("Загрузка")).toBeInTheDocument();
    });
});