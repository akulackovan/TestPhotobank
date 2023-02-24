import React, {useContext} from "react";
import AnotherUserPage from "../pages/AnotherUserPage/AnotherUserPage";
import {AnotherPage} from "../components/AnotherPage/AnotherPage";
import AuthContext from "../context/AuthContext";
import { render, screen, waitFor, act } from "@testing-library/react";
import { MemoryRouter, Route, BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import '@testing-library/jest-dom';

describe('AnotherUserPage',  () => {
    test('renders AnotherPage', () => {
        const mockMatch = {
            params: {
                id: '123',
            },
        };
        const mockContextValue = {
            user: {
                _id: '456',
                username: 'anotheruser',
            },
            setUser: jest.fn(),
        };
        render(
            <MemoryRouter initialEntries={[`/users/${mockMatch.params.id}`]}>
                <Route path="/users/:id">
                    <AuthContext.Provider value={mockContextValue}>
                        <AnotherUserPage match={mockMatch}/>
                    </AuthContext.Provider>
                </Route>
            </MemoryRouter>
        );
        expect(screen.getByTestId('AnotherPage')).toBeInTheDocument();
        //expect(screen.getByTestId('AnotherPage')).toHaveAttribute('id', '123');
    });
});