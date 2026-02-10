import React from "react";
import SortBy from "../shared/sortBy.jsx";
import StatusFilter from "../shared/StatusFilter.jsx";
import FilterInput from "../shared/FilterInput.jsx";
import {componentStyle} from "../shared/Styles.jsx";

export default function TodoControls({
                                         sortBy,
                                         sortDirection,
                                         onSortByChange,
                                         onSortDirectionChange,
                                         filterTerm,
                                         onFilterChange,
                                         onResetFilters,
                                         error,
                                         filterError,
                                         onClearError,
                                         onClearFilterError,
                                     }) {
    const hasError = Boolean(error || filterError);
    const canReset = Boolean(filterTerm);

    return (
        <aside style={componentStyle.sidebar}>
            <div style={componentStyle.controlsGroup}>
                <SortBy
                    sortBy={sortBy}
                    sortDirection={sortDirection}
                    onSortByChange={onSortByChange}
                    onSortDirectionChange={onSortDirectionChange}
                />
                <StatusFilter/>
                <FilterInput filterTerm={filterTerm} onFilterChange={onFilterChange}/>
            </div>

            {canReset && (
                <button style={componentStyle.button} onClick={onResetFilters}>
                    Reset Filters
                </button>
            )}

            {hasError && (
                <div style={componentStyle.errorBox}>
                    {error && <p>{error}</p>}
                    {filterError && <p>{filterError}</p>}
                    {error && (
                        <button
                            style={{...componentStyle.button, ...componentStyle.buttonSecondary}}
                            onClick={onClearError}
                        >
                            Clear Error
                        </button>
                    )}
                    {filterError && (
                        <button
                            style={{...componentStyle.button, ...componentStyle.buttonSecondary}}
                            onClick={onClearFilterError}
                        >
                            Clear Filter Error
                        </button>
                    )}
                </div>
            )}
        </aside>
    );
}
