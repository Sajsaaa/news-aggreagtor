import { useEffect, useState, useRef } from "react";
import axiosClient from "../axiosClient";
import { Pagination, TextField, Button, Autocomplete } from "@mui/material";
import FilterGroup from "./FilterGroup";
import { useStateContext } from "../context/ContextProvider";

export default function News({ type }) {
    const { currentUser } = useStateContext();
    const [currentPost, setCurrentPost] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [authorsFilter, setAuthorsFilter] = useState([]);
    const [categoriesFilter, setCategoriesFilter] = useState([]);
    const [sourcesFilter, setSourcesFilter] = useState([]);

    const [search, setSearch] = useState("");
    const searchRef = useRef(null);

    const perPage = 20;
    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const handleSearch = (event) => {
        event.preventDefault();
        const searchQuery = searchRef.current.value;
        setSearch(searchQuery);
    };

    const handleUpdatePreferences = () => {
        axiosClient
            .post(`/user-preferences`, {
                user_id: currentUser.id,
                categories: categoriesFilter,
                authors: authorsFilter,
                sources: sourcesFilter,
            })
            .then(({ data }) => {
                console.log(data);
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response);
                    const finalErrors = Object.values(
                        error.response.data.errors
                    ).reduce((accum, next) => [...accum, ...next], []);
                    console.log(finalErrors);
                    setError({ __html: finalErrors.join("<br>") });
                }
                console.error(error);
            });
    };
    const fetchData = () => {
        axiosClient
            .get(
                `/news?search=${search}&source=${sourcesFilter}&topic=${categoriesFilter}&author=${authorsFilter}&per_page=${perPage}&page=${currentPage}`
            )
            .then(({ data }) => {
                console.log(data);
                setCurrentPost(data?.data);
                setTotalPages(Math.ceil(data.total / data.per_page));
            })
            .catch((error) => {
                if (error.response) {
                    console.log(error.response);
                    const finalErrors = Object.values(
                        error.response.data.errors
                    ).reduce((accum, next) => [...accum, ...next], []);
                    console.log(finalErrors);
                    setError({ __html: finalErrors.join("<br>") });
                }
                console.error(error);
            });
    };
    const fetchUserPreference = () => {
        if (currentUser && type === "For you") {
            axiosClient
                .get(`/user-preferences/${currentUser?.id}`)
                .then(({ data }) => {
                    setCategoriesFilter(data.categories ?? []);
                    setAuthorsFilter(data.authors ?? []);

                    setSourcesFilter(data.sources ?? []);
                })
                .catch((error) => {
                    if (error.response) {
                        const finalErrors = Object.values(
                            error.response.data.errors
                        ).reduce((accum, next) => [...accum, ...next], []);
                        setError({ __html: finalErrors.join("<br>") });
                    }
                    console.error(error);
                });
        } else {
            setCategoriesFilter([]);
            setAuthorsFilter([]);
            setSourcesFilter([]);
        }
    };
    useEffect(() => {
        fetchData();
    }, [currentPage, search, authorsFilter, categoriesFilter, sourcesFilter]);
    useEffect(() => {
        fetchUserPreference();
    }, [type]);

    return (
        <>
            <FilterGroup
                type={type === "For you" ? "Preferences" : "Filters"}
                setAuthorsFilter={setAuthorsFilter}
                setCategoriesFilter={setCategoriesFilter}
                setSourcesFilter={setSourcesFilter}
                categoriesDefaultValues={categoriesFilter}
                authorsDefaultValues={authorsFilter}
                sourcesDefaultValues={sourcesFilter}
                updatePreferences={handleUpdatePreferences}
            />
            <form onSubmit={handleSearch}>
                <div className="flex items-center mt-5 space-x-4 pl-5 pr-5 my-5">
                    <TextField
                        type="search"
                        variant="outlined"
                        label="Search"
                        placeholder="Enter your search query"
                        fullWidth
                        inputRef={searchRef}
                    />
                    <Button type="submit" variant="contained" color="primary">
                        Search
                    </Button>
                </div>
            </form>
            <div className="mx-auto p-5 mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                {currentPost.map((post) => (
                    <article
                        key={post.id}
                        className="flex max-w-xl flex-col items-start justify-between"
                    >
                        <img
                            alt=""
                            className="object-cover w-full h-52 dark:bg-gray-500"
                            src={post.image_src}
                        />
                        <div className="flex items-center gap-x-4 text-xs">
                            <time
                                dateTime={post.published_at}
                                className="text-gray-500"
                            >
                                {post.published_at}
                            </time>
                            <a
                                href={post.url}
                                className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                            >
                                {post?.topic}
                            </a>
                        </div>
                        <div className="group relative">
                            <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                                <a href={post.url}>
                                    <span className="absolute inset-0" />
                                    {post.title}
                                </a>
                            </h3>
                            <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                                {post.description}
                            </p>
                        </div>
                        <div className="relative mt-8 flex items-center gap-x-4">
                            <div className="text-sm leading-6">
                                <p className="font-semibold text-gray-900">
                                    <a href={post.url}>
                                        <span className="absolute inset-0" />
                                        {post.author}
                                    </a>
                                </p>
                                <p className="text-gray-600">{post.source}</p>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
            <div className="flex justify-center mt-8 mb-8">
                <Pagination
                    variant="outlined"
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                />
            </div>
        </>
    );
}
