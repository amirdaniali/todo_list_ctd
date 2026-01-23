export default function SortBy({sortBy, sortDirection, onSortByChange, onSortDirectionChange}) {
    let isLoading = true;

    let sortDropdown = <> <label htmlFor={'sortDropdown'}>Sort By: {' '}    </label>
        <select defaultValue={sortBy} id={"sortDropdown"} name={'sortDropdown'}
                onChange={(event) => onSortByChange(event.target.value)}>
            <option value="creationDate">Creation Date</option>
            <option value="title">Title</option>
        </select></>

    let orderDropdown = <> <label htmlFor={'orderDropdown'}>Order By: {' '}    </label>
        <select defaultValue={sortDirection} id={"orderDropdown"} name={'orderDropdown'}
                onChange={(event) => onSortDirectionChange(event.target.value)}>
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
        </select></>
    return <>{sortDropdown}{orderDropdown}</>;

}