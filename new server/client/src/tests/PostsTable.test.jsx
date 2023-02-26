import PostTable from "../components/PostsTable/PostsTable";
import React from "react";
import {getByText, screen, queryByText, render, queryByTestId} from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import {MemoryRouter} from "react-router-dom";

describe("PostTable component", () => {
    it("renders without crashing", () => {
        render(<PostTable/>);
    });

    it("renders the correct number of images", () => {
        const posts = [{_id: "1", image: "https://example.com/image1.jpg",},
            {_id: "2", image: "https://example.com/image2.jpg",},
            {_id: "3", image: "https://example.com/image3.jpg",},
        ];
        const {getAllByTitle} = render(
            <MemoryRouter>
                <PostTable post={posts}/>
            </MemoryRouter>
        );
        const images = getAllByTitle("Открыть пост");
        expect(images.length).toBe(posts.length);
    });

    it("renders the correct number of posts", () => {
        const post = [{_id: 1, image: "image1.jpg"}, {_id: 2, image: "image2.jpg"}];
        const {getAllByRole} = render(<PostTable post={post}/>, {wrapper: MemoryRouter});
        expect(getAllByRole("link").length).toBe(2);
    });

    it("renders a list of posts", () => {
        const posts = [{_id: "1", image: "image1.jpg"}, {_id: "2", image: "image2.jpg"}];
        const {container} = render(<MemoryRouter><PostTable post={posts}/></MemoryRouter>);
        const images = container.querySelectorAll("img");
        expect(images.length).toBe(posts.length);
    });

    it("renders a link for each post", () => {
        const posts = [{_id: "1", image: "image1.jpg"}, {_id: "2", image: "image2.jpg"}];
        const {container} = render(<MemoryRouter><PostTable post={posts}/></MemoryRouter>);
        const links = container.querySelectorAll("a");
        expect(links.length).toBe(posts.length);
        posts.forEach((post, index) => {
            const link = links[index];
            expect(link.href).toContain(`/post/${post._id}`);
            expect(link.title).toBe("Открыть пост");
        });
    });

    it("renders the 'Нет постов' message when there are no posts", () => {
        const { getByTestId } = render(
            <MemoryRouter>
                <PostTable post={null} />
            </MemoryRouter>
        );
        expect(getByTestId('no-posts-message')).toBeInTheDocument();
    });

    it("renders the 'Фотографии закончились' message at the end of the posts", () => {
        const posts = [{ _id: "1", image: "image1.jpg" }, { _id: "2", image: "image2.jpg" }];
        const { getByText } = render(
            <MemoryRouter>
                <PostTable post={posts} end={true} />
            </MemoryRouter>
        );
        expect(getByText("Фотографии закончились")).toBeInTheDocument();
    });

    it("does not render the 'Фотографии закончились' message when end is false", () => {
        const posts = [{ _id: "1", image: "image1.jpg" }, { _id: "2", image: "image2.jpg" }];
        const { queryByText } = render(
            <MemoryRouter>
                <PostTable post={posts} end={false} />
            </MemoryRouter>
        );
        expect(queryByText("Фотографии закончились")).toBeNull();
    });


    it("renders the 'Фотографии закончились' message if 'end' prop is true", () => {
        const {queryByText} = render(<MemoryRouter><PostTable post={[]} end={true}/></MemoryRouter>);
        expect(queryByText("Фотографии закончились")).toBeInTheDocument();
    });

});