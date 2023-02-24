import React, { useContext } from 'react';
import axios from 'axios';
import { BrowserRouter as Router } from "react-router-dom";
import { render, screen, act, waitForElementToBeRemoved, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom'
import PopularPage from "../pages/PopularPage/PopularPage";
import AuthContext from '../context/AuthContext';
import "@testing-library/jest-dom";
import SubscribePage from "../pages/SubscribePage/SubscribePage";

jest.mock("axios");

describe("PopularPage", () => {
    beforeEach(() => {
        axios.mockClear();
    });

    it("renders posts when API call is successful", async () => {
        const value = {
            userId: "123",
        };
        const responseData = {
            popular: [
                {
                    date: "2022-01-01",
                    posts: [
                        {
                            _id: "1",
                            image: "https://example.com/image1.jpg",
                        },
                        {
                            _id: "2",
                            image: "https://example.com/image2.jpg",
                        },
                    ],
                },
            ],
        };
        axios.mockResolvedValueOnce({ data: responseData });

        render(
            <Router> {/* wrap the component in a Router */}
                <AuthContext.Provider value={value}>
                    <PopularPage />
                </AuthContext.Provider>
            </Router>
        );

        await screen.findAllByTitle("Открыть пост");
        expect(screen.getAllByTitle("Открыть пост")).toHaveLength(2);
        expect(screen.getByText("Фотографии закончились")).toBeInTheDocument();
    });

    it("renders error message when API call fails", async () => {
        const mockErrorMessage = "Something went wrong!";
        axios.mockRejectedValueOnce({ response: { data: { message: mockErrorMessage } } });

        render(
            <AuthContext.Provider value={[]}>
                <PopularPage />
            </AuthContext.Provider>
        );

        await screen.findByText(mockErrorMessage);
        expect(screen.getByText(mockErrorMessage)).toBeInTheDocument();
        expect(screen.queryByAltText("Открыть пост")).not.toBeInTheDocument();
    });

    it("renders 'Нет постов' message when post array is empty", async () => {
        const value = {
            userId: "123",
        };
        const responseData = {
            popular: [],
        };
        axios.mockResolvedValueOnce({ data: responseData });

        render(
            <AuthContext.Provider value={value}>
                <PopularPage />
            </AuthContext.Provider>
        );

        await screen.findByText("Нет постов");
        expect(screen.getByText("Нет постов")).toBeInTheDocument();
        expect(screen.queryByText("Фотографии закончились")).not.toBeInTheDocument();
    });
});
