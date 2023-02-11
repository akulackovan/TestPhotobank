import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import NavBar from "../components/NavBar/NavBar";
import React from "react";
import "@testing-library/jest-dom";
import axios from "axios";
import AuthPage from "../pages/AuthPage/AuthPage";


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

    it("Checking the redirection after clicking the popular button ", async () => {
        render(<NavBar />);
        global.window = { location: {pathname: null}}
        fireEvent.click(screen.getByTitle("Популярное"));
        expect(global.window.location.pathname).toContain('/popular');
    });

    it("Check input password field", () => {
        const { login, logout, token, userId, isReady, isLogin } = jest.fn();
        render(<NavBar /> );
        const password = screen.getByPlaceholderText("ПОИСК");
        expect(password.value === "").toBe(true);
        fireEvent.change(password, { target: { value: "123" } });
        expect(password.value === "123").toBe(true);
    });
});