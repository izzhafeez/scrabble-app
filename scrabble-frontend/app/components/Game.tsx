"use client"

import { useState } from "react";
import Row from "./board/Row"
import Leaderboard from "./leaderboard/Leaderboard"
import toast from "./common/toast";

const Game = () => {
    const [loadedWord, setLoadedWord] = useState<string>("");
    const [refreshFlag, setRefreshFlag] = useState<boolean>(false);

    const loadWord = (word: string) => {
        setLoadedWord(word);
        toast.fire({
            icon: 'success',
            title: `Loaded word: ${word}`
        })
    };

    const refreshLeaderboard = () => {
        setRefreshFlag(!refreshFlag);
    }

    return <div className="grid gap-8">
        <Row loadedWord={loadedWord} refreshLeaderboard={refreshLeaderboard} />
        <Leaderboard loadWord={loadWord} refreshFlag={refreshFlag}/>
    </div>
}

export default Game;