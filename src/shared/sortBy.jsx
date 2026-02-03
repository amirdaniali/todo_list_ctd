import {componentStyle} from "./Styles.jsx"

export default function SortBy({sortBy, sortDirection, onSortByChange, onSortDirectionChange}) {

    return (
        <>
            <label htmlFor="sortDropdown" style={componentStyle.label}>Sort By:</label>
            <select
                id="sortDropdown"
                defaultValue={sortBy}
                onChange={(e) => onSortByChange(e.target.value)}
                style={componentStyle.select}
            >
                <option value="creationDate">Creation Date</option>
                <option value="title">Title</option>
            </select>

            <label htmlFor="orderDropdown" style={componentStyle.label}>Order:</label>
            <select
                id="orderDropdown"
                defaultValue={sortDirection}
                onChange={(e) => onSortDirectionChange(e.target.value)}
                style={componentStyle.select}
            >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
            </select>
        </>
    );
}
