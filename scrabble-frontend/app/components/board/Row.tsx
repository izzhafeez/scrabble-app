"use client";
import { useEffect, useRef, useState } from "react";
import Square from "./Square";
import { getLetterPoints } from "./rules";
import { submitScore } from "@/app/service/scoreSubmission";
import Swal from "sweetalert2";
import toast from "../common/toast";
import { LETTER_POINTS } from "./rules";

const Row = ({ loadedWord, refreshLeaderboard }: { loadedWord: string, refreshLeaderboard: () => void }) => {
    const [letters, setLetters] = useState<string[]>(Array(10).fill(""));
    const [currentIndex, setCurrentIndex] = useState<number>(0);
    const [totalScore, setTotalScore] = useState<number>(0);

    // create refs for each square
    const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

    useEffect(() => {
        // focus the current square
        inputRefs.current[currentIndex]?.focus();
    }, [currentIndex]);

    useEffect(() => {
        setTotalScore(letters.reduce((acc, letter) => acc + getLetterPoints(letter), 0));
    }, [letters]);

    useEffect(() => {
        if (loadedWord) {
            const newLetters = loadedWord.split('').slice(0, 10);
            const paddedLetters = [...newLetters, ...Array(10 - newLetters.length).fill("")];
            setLetters(paddedLetters);
            setCurrentIndex(newLetters.length < 10 ? newLetters.length : 9);
        }
    }, [loadedWord]);

    const onChange = (index: number) => (newLetter: string) => {
        if (newLetter === 'LEFT_ARROW') {
            if (index > 0) setCurrentIndex(index - 1);
            return;
        } else if (newLetter === 'RIGHT_ARROW') {
            if (index < letters.length - 1) setCurrentIndex(index + 1);
            return;
        }

        // update letter at index
        const updated = [...letters];
        updated[index] = newLetter;
        setLetters(updated);

        // move focus to next square
        if (newLetter && index < letters.length - 1) {
            setCurrentIndex(index + 1);
        }

        // if letter is deleted, move focus to previous square
        if (!newLetter && index > 0) {
            setCurrentIndex(index - 1);
        }
    }

    const handleReset = () => {
        setLetters(Array(10).fill(""));
        setCurrentIndex(0);
        toast.fire({
            icon: 'info',
            title: 'Tiles Reset'
        });
    };

    const findStartEndIndex = () => {
        let start = -1;
        let end = -1;

        for (let i = 0; i < letters.length; i++) {
            if (letters[i] !== "" && start === -1) {
                start = i;
            }
            if (letters[i] !== "") {
                end = i;
            }
        }

        return { start, end };
    }

    const isValid = () => {
        // a valid word has at least one letter
        if (letters.every(letter => letter === "")) return false;

        // should not contain gaps in between letters
        const { start, end } = findStartEndIndex();
        for (let i = start; i <= end; i++) {
            if (letters[i] === "") {
                return false;
            }
        }

        return true;
    }

    const handleSave = () => {
        if (!isValid()) {
            Swal.fire({
                icon: 'error',
                title: 'Invalid Word',
                text: 'Please ensure the word has no gaps and contains at least one letter.',
            });

            // set gaps to space for user to see error
            const { start, end } = findStartEndIndex();
            const updated = [...letters];
            for (let i = start; i <= end; i++) {
                if (updated[i] === "") {
                    updated[i] = " ";
                }
            }
            setLetters(updated);

            return;
        }

        // save the word and score to leaderboard
        const word = letters.join('');
        const score = totalScore;

        submitScore(word, score).then(() => {
            Swal.fire({
                icon: 'success',
                title: 'Score Submitted',
                text: `The word "${word}" with score ${score} has been submitted successfully!`,
            });

            handleReset();
            refreshLeaderboard();
        }).catch((error) => {
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: `An error occurred: ${error.message}`,
            });
        });
    };

    const showLetterScores = () => {
        const toShow = `<div class="grid grid-cols-5 gap-2">` +
            Object.entries(LETTER_POINTS).map(([letter, score]: any) => {
                return `<div class="p-2 border border-gray-400 rounded-lg">
                    <p class="text-xl font-bold">${letter || "-"}</p>
                    <p class="${score >= 0 ? "text-green-500" : "text-red-500"} font-bold">${score >= 0 ? score : "Invalid"}</p>
                </div>`;
            }).join('') +
            `</div>`;

        Swal.fire({
            title: 'Letter Scores',
            html: toShow,
            showCloseButton: true,
            focusConfirm: false,
            confirmButtonText: 'Close',
        });
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <div className="flex flex-wrap gap-4">
                {letters.map((letter, index) => (
                    <Square
                        key={index}
                        id={index}
                        letter={letter}
                        ref={(el: any) => inputRefs.current[index] = el}
                        onFocus={() => setCurrentIndex(index)}
                        onChange={onChange(index)}
                    />
                ))}
            </div>

            <div className="flex w-full my-4 gap-2">
                <p className="text-lg font-bold">
                    Total Score: <span className={totalScore >= 0 ? "text-green-500" : "text-red-500"}>{totalScore >= 0 ? totalScore : "Invalid"}</span>
                </p>

                <button 
                    className="ms-auto my-auto px-2 py-1 rounded-lg bg-blue-700 hover:bg-blue-500 hover:cursor-pointer"
                    onClick={showLetterScores} 
                >Show Letter Scores</button>
                <button
                    className={`my-auto px-2 py-1 rounded-lg ${totalScore > 0 ? "bg-green-700 hover:cursor-pointer hover:bg-green-500" : "bg-gray-700"}`}
                    disabled={totalScore <= 0}
                    onClick={handleSave}
                >Save Score</button>
                <button
                    className={`my-auto px-2 py-1 rounded-lg ${totalScore != 0 ? "bg-red-700 hover:cursor-pointer hover:bg-red-500" : "bg-gray-700"}`}
                    disabled={totalScore == 0}
                    onClick={handleReset}
                >Reset Tiles</button>
            </div>
        </div>
    );
}

export default Row;
