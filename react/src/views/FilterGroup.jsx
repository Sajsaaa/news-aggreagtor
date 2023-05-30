import { useEffect, useState } from "react";
import axiosClient from "../axiosClient";
import DropDown from "./DropDown";
import { Button } from "@mui/material";

export default function FilterGroup({
    type,
    setCategoriesFilter,
    setAuthorsFilter,
    setSourcesFilter,
    categoriesDefaultValues,
    authorsDefaultValues,
    sourcesDefaultValues,
    updatePreferences,
}) {
    console.log(categoriesDefaultValues);
    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [sources, setSources] = useState([]);
    const fetchDropDowns = () => {
        axiosClient
            .get(`/news/metadata`)
            .then(({ data }) => {
                setAuthors(data.authors);
                setCategories(data.topics);
                setSources(data.sources);
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
    };
    useEffect(() => {
        fetchDropDowns();
    }, []);
    const handleUpdatedCategories = (event, values) => {
        setCategoriesFilter(values);
    };
    const handleUpdatedAuthors = (event, values) => {
        setAuthorsFilter(values);
    };
    const handleUpdatedSources = (event, values) => {
        setSourcesFilter(values);
    };
    return (
        <>
            <h1 className="pl-5 py-6 text-2xl font-bold tracking-tight">
                {type}
            </h1>
            <div className="flex items-center flex-col md:flex-row">
                <DropDown
                    label={"Categories"}
                    data={categories}
                    handler={handleUpdatedCategories}
                    defaultValue={categoriesDefaultValues}
                />
                <DropDown
                    label={"Sources"}
                    data={sources}
                    handler={handleUpdatedSources}
                    defaultValue={sourcesDefaultValues}
                />
                <DropDown
                    label={"Authors"}
                    data={authors}
                    handler={handleUpdatedAuthors}
                    defaultValue={authorsDefaultValues}
                />
            </div>
            <div className="flex items-center flex-col m-5">
                {type === "Preferences" && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={updatePreferences}
                    >
                        Update Preferences
                    </Button>
                )}
            </div>
        </>
    );
}
