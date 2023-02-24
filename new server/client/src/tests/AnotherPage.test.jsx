import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import axios from "axios";
import {AnotherPage} from "../components/AnotherPage/AnotherPage";
import AuthContext from "../context/AuthContext";
import {MemoryRouter} from "react-router-dom";
import '@testing-library/jest-dom'

jest.mock('axios');

describe('AnotherPage', () => {
    const id = '123';
    const userId = '456';
    const contextValue = {userId};

    beforeEach(() => {
        axios.mockClear();
    });

    it('renders loader when profile is loading', async () => {
        axios.mockResolvedValueOnce({
            data: {
                user: {},
                subscibe: [],
                isSubscribe: false,
            },
        });

        render(
            <MemoryRouter>
                <AuthContext.Provider value={contextValue}>
                    <AnotherPage id={id}/>
                </AuthContext.Provider>
            </MemoryRouter>,
        );

        expect(screen.getByTestId('loader')).toBeInTheDocument();
        expect(axios).toHaveBeenCalledTimes(1);
        expect(axios).toHaveBeenCalledWith({
            method: 'get',
            url: '/auth/user',
            headers: {
                'x-auth-token': localStorage.getItem('auth-token'),
                'content-type': 'application/json',
            },
            params: {
                userId: id,
                myId: userId,
            },
        });
    });

    it('renders profile when profile has loaded', async () => {
        axios.mockResolvedValueOnce({
            data: {
                user: {
                    username: 'testuser',
                    text: 'test text',
                    image: 'testimage.png',
                    city: 'testcity',
                },
                subscibe: [],
                isSubscribe: false,
            },
        });

        render(
            <MemoryRouter>
                <AuthContext.Provider value={contextValue}>
                    <AnotherPage id={id}/>
                </AuthContext.Provider>
            </MemoryRouter>,
        );

        expect(await screen.findByText('testuser')).toBeInTheDocument();
        expect(screen.getByText('Количество подписчиков: 0')).toBeInTheDocument();
        expect(screen.getByTestId('post-user')).toBeInTheDocument();
        expect(axios).toHaveBeenCalledTimes(1);
        expect(axios).toHaveBeenCalledWith({
            method: 'get',
            url: '/auth/user',
            headers: {
                'x-auth-token': localStorage.getItem('auth-token'),
                'content-type': 'application/json',
            },
            params: {
                userId: id,
                myId: userId,
            },
        });
    });

    it('handles unsubscription', async () => {
        axios.mockResolvedValueOnce({
            data: {
                user: {
                    username: 'testuser',
                    text: 'test text',
                    image: 'testimage.png',
                    city: 'testcity',
                },
                subscibe: [],
                isSubscribe: false,
            },
        });

        axios.mockResolvedValueOnce({
            data: {
                isSubs: true,
            },
        });

        render(
            <MemoryRouter>
                <AuthContext.Provider value={contextValue}>
                    <AnotherPage id={id}/>
                </AuthContext.Provider>
            </MemoryRouter>,
        );

        await screen.findByText('testuser');

        // expect(screen.getByTitle('Подписаться')).not.toBeInTheDocument();
        expect(screen.queryByTitle('Отписаться')).toBeInTheDocument();

        fireEvent.click(screen.getByText('Отписаться'));

        expect(axios).toHaveBeenCalledTimes(2);
        expect(axios).toHaveBeenCalledWith({
            method: 'get',
            params: {
            myId: "456",
            userId: "123",
        },
            url: "/auth/user",
            headers: {
                'content-type': 'application/json',
                'x-auth-token':
                    localStorage.getItem('auth-token'),
            },
        });
        expect(await screen.findByText('Подписаться')).toBeInTheDocument();
        // expect(screen.queryByText('Подписаться')).not.toBeInTheDocument();

    });

    it('handles subscription', async () => {
        axios.mockResolvedValueOnce({
            data: {
                user: {
                    username: 'testuser',
                    text: 'test text',
                    image: 'testimage.png',
                    city: 'testcity',
                },
                subscibe: [],
                isSubscribe: true,
            },
        });
        axios.mockResolvedValueOnce({
            data: {
                isSubs: false,
            },
        });

        render(
            <MemoryRouter>
                <AuthContext.Provider value={contextValue}>
                    <AnotherPage id={id}/>
                </AuthContext.Provider>
            </MemoryRouter>,
        );

        await screen.findByText('testuser');

        expect(screen.queryByTitle('Подписаться')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Подписаться'));

        expect(axios).toHaveBeenCalledTimes(2);
        expect(axios).toHaveBeenCalledWith({
            method: 'get',
            params: {
                myId: "456",
                userId: "123",
            },
            url: `/auth/user`,
            headers: {
                'x-auth-token': localStorage.getItem('auth-token'),
                'content-type': 'application/json',
            },
        });

        expect(await screen.findByText('Отписаться')).toBeInTheDocument();
        expect(screen.queryByText('Подписаться')).not.toBeInTheDocument();

    });
});