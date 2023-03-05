import React from 'react';
import axios from 'axios';
import {render, screen, waitFor, act} from '@testing-library/react';
import '@testing-library/jest-dom'
import SubscribePage from '../pages/SubscribePage/SubscribePage';
import AuthContext from '../context/AuthContext';
import {BrowserRouter as Router, MemoryRouter} from "react-router-dom";
import PopularPage from "../pages/PopularPage/PopularPage";

jest.mock('axios');

describe('SubscribePage component', () => {
    const mockContext = {
        userId: 'mockUserId',
    };

    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => {
        });
    });

    afterEach(() => {
        console.error.mockRestore();
    });

    it('renders SubscribePage without errors', () => {
        render(
            <AuthContext.Provider value={mockContext}>
                <SubscribePage/>
            </AuthContext.Provider>
        );
    });

    it('renders "loading" while waiting for API response', () => {
        render(
            <AuthContext.Provider value={mockContext}>
                <SubscribePage/>
            </AuthContext.Provider>
        );

        expect(screen.getByTestId('loader')).toBeInTheDocument();
    });

    it('renders error message on API error', async () => {
        const errorMessage = 'An error occurred';
        axios.mockRejectedValueOnce({
            response: {
                data: {
                    message: errorMessage,
                },
            },
        });
        render(
            <AuthContext.Provider value={mockContext}>
                <SubscribePage/>
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('An error occurred')).toBeInTheDocument();
        });
    });

    it('renders error message when API returns an error', async () => {
        const errorMessage = 'An error occurred';
        axios.mockRejectedValueOnce({
            response: {
                data: {
                    message: errorMessage,
                },
            },
        });

        await act(async () => {
            render(
                <AuthContext.Provider value={mockContext}>
                    <SubscribePage />
                </AuthContext.Provider>
            );
        });

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
        expect(screen.queryByTestId('no-posts-message')).not.toBeInTheDocument();
    });

    it('renders "Нет постов" message when API returns empty post array', async () => {
        axios.mockResolvedValueOnce({data: {returnedPosts: []}});

        render(
            <AuthContext.Provider value={mockContext}>
                <SubscribePage/>
            </AuthContext.Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Нет постов')).toBeInTheDocument();
        });
    });

    it('renders no-posts-message when API returns empty posts array', async () => {
        axios.mockResolvedValueOnce({ data: { returnedPosts: [] } });

        await act(async () => {
            render(
                <AuthContext.Provider value={mockContext}>
                    <SubscribePage />
                </AuthContext.Provider>
            );
        });

        expect(screen.getByText('Нет постов')).toBeInTheDocument();
    });

    it('renders posts when API returns a non-empty post array', async () => {
        const mockPosts = [
            {
                id: 'post1',
                title: 'pomodoro',
                author: 'Author 1',
                date: '2022-01-01T00:00:00.000Z',
                description: 'Description 1',
                imageUrl: 'https://example.com/image1.jpg',
            },
            {
                id: 'post2',
                title: 'testsuite',
                author: 'Author 2',
                date: '2022-01-02T00:00:00.000Z',
                description: 'Description 2',
                imageUrl: 'https://example.com/image2.jpg',
            },
        ];
        axios.mockResolvedValueOnce({ data: { returnedPosts: mockPosts } });

        render(
            <MemoryRouter>
                <AuthContext.Provider value={mockContext}>
                    <SubscribePage />
                </AuthContext.Provider>
            </MemoryRouter>
        );
        await act(async () => {
            await new Promise((resolve) => setTimeout(resolve, 0));
          });
            expect(screen.getByTestId(`post-${mockPosts[0].id}`)).toBeInTheDocument();
            expect(screen.getByTestId(`post-${mockPosts[1].id}`)).toBeInTheDocument();
    });
});