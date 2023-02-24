import { render, screen, fireEvent } from "@testing-library/react";
import NavBar from "../components/NavBar/NavBar";
import React from "react";
import "@testing-library/jest-dom";

describe("NavBar component", () => {
    it("Checking the presence navbar components", () => {
        render(<NavBar />);
        expect(screen.getByText("ФОТОБАНК")).toBeInTheDocument();
        expect(screen.getByText("Популярное")).toBeInTheDocument();
        expect(screen.getByText("Подписки")).toBeInTheDocument();
        expect(screen.getByText("Профиль")).toBeInTheDocument();
        expect(screen.getByText("Настройки")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("ПОИСК")).toBeInTheDocument();
    });

    it("Check input password field", () => {
        render(<NavBar /> );
        const password = screen.getByPlaceholderText("ПОИСК");
        expect(password.value === "").toBe(true);
        fireEvent.change(password, { target: { value: "123" } });
        expect(password.value === "123").toBe(true);
    });
});