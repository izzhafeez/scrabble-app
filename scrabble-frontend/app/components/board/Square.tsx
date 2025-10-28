"use client";
import { useEffect, useState } from "react";
import { getLetterPoints } from "./rules";

const Square = ({ 
        letter: initialLetter,
        onChange,
        onFocus,
        ref,
        id
    }: {
        letter: string,
        onChange: (letter: string) => void,
        onFocus: () => void,
        ref: any,
        id: any,
    }) => {
    const [letter, setLetter] = useState<string>(initialLetter);
    const [score, setScore] = useState<number>(0);

    useEffect(() => {
        setLetter(initialLetter);
    }, [initialLetter]);

    useEffect(() => {
        setScore(getLetterPoints(letter));
    }, [letter]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // check for left right arrow keys and move cursor accordingly
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            onChange('LEFT_ARROW');
            return;
        }
        
        if (e.key === 'ArrowRight') {
            e.preventDefault();
            onChange('RIGHT_ARROW');
            return;
        }

        // handle backspace
        if (e.key === 'Backspace') {
            e.preventDefault();
            setLetter('');
            setScore(0);
            onChange('');
            return;
        }

        // don't do anything if is a navigation key
        if (e.key.length > 1) {
            return;
        }

        // handle change
        setLetter(e.key.toUpperCase());
        onChange(e.key.toUpperCase());
    };

    return (
        <div className="relative w-12 h-12 xl:w-20 xl:h-20" id={`square-${id}`}>
            <input
                type="text"
                maxLength={1}
                value={letter}
                ref={ref}
                onChange={() => {}} // prevent React warning
                onKeyDown={handleKeyDown}
                onFocus={onFocus}
                className="w-full h-full border border-gray-400 text-center text-xl xl:text-3xl font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg"
            />

            {/* small circle for score */}
            <div className={`${score >= 0 ? "bg-green-700" : "bg-red-700"} absolute -bottom-3 -right-3 w-4 h-4 xl:w-8 xl:h-8 text-md xl:text-lg font-bold rounded-full flex items-center justify-center border border-gray-500 z-20`}>
                {score >= 0 ? score : "X"}
            </div>
        </div>
    );
}

export default Square;