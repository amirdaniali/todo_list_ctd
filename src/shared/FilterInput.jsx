import {componentStyle} from "./Styles.jsx"

export default function FilterInput({filterTerm, onFilterChange}) {
    return (
        <div>
            <label htmlFor="filterInput" style={componentStyle.label}>
                Search Todos:
            </label>
            <input
                type="text"
                id="filterInput"
                value={filterTerm}
                onChange={(e) => onFilterChange(e.target.value)}
                placeholder="Search by title..."
                style={componentStyle.input}
            />
        </div>
    );
}
