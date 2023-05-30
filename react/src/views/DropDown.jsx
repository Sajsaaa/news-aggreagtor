import { TextField, Autocomplete } from "@mui/material";

export default function DropDown({ label, data, handler, defaultValue }) {
    return (
        <Autocomplete
            multiple
            options={data}
            onChange={handler}
            value={defaultValue}
            className="mr-5"
            sx={{ width: 400 }}
            renderInput={(params) => <TextField {...params} label={label} />}
        />
    );
}
