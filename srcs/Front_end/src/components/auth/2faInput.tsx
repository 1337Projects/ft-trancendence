import React, { useEffect, useRef, useReducer, ChangeEvent, KeyboardEvent, FocusEvent } from "react";

// Type for the submittedValues array in the doSubmit function
function doSubmit(submittedValues: string[]): Promise<void> {
console.log(`Submitted: ${submittedValues.join("")}`);

return new Promise((resolve) => {
    setTimeout(() => {
    resolve();
    }, 1500);
});
}

// Helper function to clamp the index to be between 0 and 6
function clampIndex(index: number): number {
if (index > 6) {
    return 6;
} else if (index < 0) {
    return 0;
} else {
    return index;
}
}

// Types for the reducer state and actions
interface State {
inputValues: string[];
focusedIndex: number;
status: "idle" | "pending";
}

type Action =
| { type: "INPUT"; payload: { index: number; value: string } }
| { type: "BACK" }
| { type: "PASTE"; payload: { pastedValue: string[] } }
| { type: "FOCUS"; payload: { focusedIndex: number } }
| { type: "VERIFY" }
| { type: "VERIFY_SUCCESS" };

// Reducer function to manage state
function reducer(state: State, action: Action): State {
switch (action.type) {
    case "INPUT":
    return {
        ...state,
        inputValues: [
        ...state.inputValues.slice(0, action.payload.index),
        action.payload.value,
        ...state.inputValues.slice(action.payload.index + 1),
        ],
        focusedIndex: clampIndex(state.focusedIndex + 1),
    };

    case "BACK":
    return {
        ...state,
        focusedIndex: clampIndex(state.focusedIndex - 1),
    };

    case "PASTE":
    return {
        ...state,
        inputValues: state.inputValues.map(
        (_, index) => action.payload.pastedValue[index] || ""
        ),
    };

    case "FOCUS":
    return {
        ...state,
        focusedIndex: action.payload.focusedIndex,
    };

    case "VERIFY":
    return {
        ...state,
        status: "pending",
    };

    case "VERIFY_SUCCESS":
    return {
        ...state,
        status: "idle",
    };

    default:
    throw new Error("unknown action");
}
}

// Initial state
const initialState: State = {
inputValues: Array(6).fill(""),
focusedIndex: 0,
status: "idle",
};

export default function TwoFaInput() {
const [{ inputValues, focusedIndex, status }, dispatch] = useReducer(reducer, initialState);

function handleInput(index: number, value: string) {
    dispatch({ type: "INPUT", payload: { index, value } });
}

function handleBack() {
    dispatch({ type: "BACK" });
}

function handlePaste(pastedValue: string[]) {
    dispatch({ type: "PASTE", payload: { pastedValue } });

    if (pastedValue.length === 6) {
    dispatch({ type: "VERIFY" });
    doSubmit(pastedValue).then(() => dispatch({ type: "VERIFY_SUCCESS" }));
    }
}

function handleFocus(focusedIndex: number) {
    dispatch({ type: "FOCUS", payload: { focusedIndex } });
}

function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    dispatch({ type: "VERIFY" });
    doSubmit(inputValues).then(() => dispatch({ type: "VERIFY_SUCCESS" }));
}

return (
    <form onSubmit={handleSubmit} className="border border-black p-5 w-[450px] md:w-[500px] flex flex-col items-center justify-around rounded-[5px] ">
    <div className="grid gap-2.5 grid-cols-6 mb-2.5">
        {inputValues.map((value, index) => {
        return (
            <Input
            key={index}
            index={index}
            value={value}
            onChange={handleInput}
            onBackspace={handleBack}
            onPaste={handlePaste}
            isFocused={index === focusedIndex}
            onFocus={handleFocus}
            isDisabled={status === "pending"}
            />
        );
        })}
    </div>
    <button disabled={status === "pending"} className="text-white bg-[#d23131] p-3 w-[100px] rounded-[10px]">
        {status === "pending" ? "Verifying..." : "Verify"}
    </button>
    </form>
);
}

interface InputProps {
index: number;
value: string;
onChange: (index: number, value: string) => void;
onPaste: (pastedValue: string[]) => void;
onBackspace: () => void;
isFocused: boolean;
onFocus: (index: number) => void;
isDisabled: boolean;
}

function Input({
index,
value,
onChange,
onPaste,
onBackspace,
isFocused,
onFocus,
isDisabled,
}: InputProps) {
const ref = useRef<HTMLInputElement | null>(null);

useEffect(() => {
    requestAnimationFrame(() => {
    if (ref.current !== document.activeElement && isFocused) {
        ref.current?.focus();
    }
    });
}, [isFocused]);

function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(index, e.target.value);
}

function handlePaste(e: React.ClipboardEvent) {
    onPaste(e.clipboardData.getData("text").split(""));
}

function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
    onBackspace();
    }
}

function handleFocus(e: FocusEvent<HTMLInputElement>) {
    e.target.setSelectionRange(0, 1);
    onFocus(index);
}

return (
    <input
    ref={ref}
    type="text"
    value={value}
    onChange={handleChange}
    onPaste={handlePaste}
    onKeyDown={handleKeyDown}
    maxLength='1'
    onFocus={handleFocus}
    disabled={isDisabled}
    className="border border-black w-full p-5 text-center text-xl leading-none rounded-[5px]"
    />
);
}
