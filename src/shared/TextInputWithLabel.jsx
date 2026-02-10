const componentStyle = {
    label: {
        fontWeight: "bold",
        marginBottom: "5px",
        textAlign: "center",
    },
    input: {
        padding: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        outline: "none",
    },
}


function TextInputWithLabel({
                                elementId,
                                labelText,
                                onChange,
                                ref,
                                value,
                            }) {
    return (
        <>
            <label htmlFor={elementId} style={componentStyle.label}>{labelText}</label>
            <input
                type="text"
                id={elementId}
                ref={ref}
                value={value}
                onChange={onChange}
                style={componentStyle.input}
            />
        </>
    );
}

export default TextInputWithLabel;