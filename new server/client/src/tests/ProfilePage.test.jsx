import React from 'react';
import { render, screen } from '@testing-library/react';
import AuthContext from '../context/AuthContext';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import "@testing-library/jest-dom";

describe("ProfilePage", () => {
    test("should render with user id", () => {
        const userId = "test-user-id";
        render(
            <AuthContext.Provider value={{ userId }}>
                <ProfilePage />
            </AuthContext.Provider>
        );
        // add data-testid="another-page" to the div element that wraps the AnotherPage component in the ProfilePage component to be able to test it with getByTestId.
        expect(screen.getByTestId("another-page")).toBeInTheDocument();
    });
});