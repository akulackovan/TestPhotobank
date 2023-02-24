import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import axios from "axios";
import {AnotherPage} from "../components/AnotherPage/AnotherPage";
import AuthContext from "../context/AuthContext";
import {MemoryRouter} from "react-router-dom";
import '@testing-library/jest-dom'

// jest.mock("axios");
//
// describe("AnotherPage", () => {
//     const authContextValue = {userId: "123"};
//
//     afterEach(() => {
//         jest.clearAllMocks();
//     });
//
//     it("renders loader when page is loading", async () => {
//         axios.mockResolvedValueOnce({data: {}});
//
//         render(
//             <AuthContext.Provider value={authContextValue}>
//                 <MemoryRouter initialEntries={["/another-page/456"]}>
//                     <AnotherPage id="456"/>
//                 </MemoryRouter>
//             </AuthContext.Provider>
//         );
//
//         expect(screen.getByTestId("loader")).toBeInTheDocument();
//
//         await act(async () => {
//             await new Promise((resolve) => setTimeout(resolve, 0));
//         });
//
//         expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
//     });
//
//     it("renders user profile when page is loaded", async () => {
//         const user = {
//             username: "John",
//             text: "Hello, world!",
//             userProfileImage: "https://example.com/profile.jpg",
//             subscriptions: 10,
//             city: "Moscow",
//         };
//
//         axios.mockResolvedValueOnce({data: {user, subscibe: []}});
//
//         render(
//             <AuthContext.Provider value={authContextValue}>
//                 <MemoryRouter initialEntries={["/another-page/456"]}>
//                     <AnotherPage id="456"/>
//                 </MemoryRouter>
//             </AuthContext.Provider>
//         );
//
//         expect(screen.getByTestId("loader")).toBeInTheDocument();
//
//         await act(async () => {
//             await new Promise((resolve) => setTimeout(resolve, 0));
//         });
//
//         expect(screen.queryByTestId("loader")).not.toBeInTheDocument();
//
//         expect(screen.getByText(user.username)).toBeInTheDocument();
//         expect(screen.getByText(user.text)).toBeInTheDocument();
//         expect(screen.getByText(user.city)).toBeInTheDocument();
//         expect(screen.getByText(`Количество подписчиков: ${user.subscriptions}`)).toBeInTheDocument();
//     });
//
//     it("shows 'Нет описания' when user has no description", async () => {
//         const user = {
//             username: "John",
//             text: "",
//             userProfileImage: "https://example.com/profile.jpg",
//             subscriptions: 10,
//             city: "Moscow",
//         };
//
//         axios.mockResolvedValueOnce({data: {user, subscibe: []}});
//
//         render(
//             <AuthContext.Provider value={authContextValue}>
//                 <MemoryRouter initialEntries={["/another-page/456"]}>
//                     <AnotherPage id="456"/>
//                 </MemoryRouter>
//             </AuthContext.Provider>
//         );
//
//         await act(async () => {
//             await new Promise((resolve) => setTimeout(resolve, 0));
//         });
//
//         expect(screen.getByText("Нет описания")).toBeInTheDocument();
//     });
// });

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

        expect(screen.getByText('Подписаться')).toBeInTheDocument();
        expect(screen.queryByText('Отписаться')).not.toBeInTheDocument();

        fireEvent.click(screen.getByText('Подписаться'));

        expect(axios).toHaveBeenCalledTimes(2);
        expect(axios).toHaveBeenCalledWith({
            method: 'post',
            url: '/auth/${id}/subscribe',
            headers: {
                'x-auth-token':
                    localStorage.getItem('auth-token'),
                'content-type':
                    'application/json',
            },
        });
        expect(await screen.findByText('Отписаться')).toBeInTheDocument();
        expect(screen.queryByText('Подписаться')).not.toBeInTheDocument();

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

        expect(screen.getByText('Отписаться')).toBeInTheDocument();
        expect(screen.queryByText('Подписаться')).not.toBeInTheDocument();

        fireEvent.click(screen.getByText('Отписаться'));

        expect(axios).toHaveBeenCalledTimes(2);
        expect(axios).toHaveBeenCalledWith({
            method: 'post',
            url: `/auth/${id}/unsubscribe`,
            headers: {
                'x-auth-token': localStorage.getItem('auth-token'),
                'content-type': 'application/json',
            },
        });

        expect(await screen.findByText('Подписаться')).toBeInTheDocument();
        expect(screen.queryByText('Отписаться')).not.toBeInTheDocument();

    });
});