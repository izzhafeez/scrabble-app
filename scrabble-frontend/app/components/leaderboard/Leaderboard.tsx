"use client";

import { getSubmissions } from "../../service/scoreSubmission";
import { useEffect, useState } from "react";
import LeaderboardEntry from "./LeaderboardEntry";
import toast from "../common/toast";

const Leaderboard = ({
    loadWord, refreshFlag
}: {
    loadWord: (word: string) => void, refreshFlag: boolean
}) => {
    const [entries, setEntries] = useState([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [toShowLeaderboard, setToShowLeaderboard] = useState<boolean>(false);

    const loadEntries = async (withToast: boolean=true) => {
        setIsLoading(true);
        const data = await getSubmissions("score", false);
        setEntries(data);
        setIsLoading(false);

        if (withToast) {
            toast.fire({
                icon: 'success',
                title: 'Leaderboard Updated'
            });
        }
    };

    useEffect(() => {
        loadEntries();
    }, [refreshFlag]);

    return (
        <div>
            <div className="flex mb-4">
                <h2 className="text-2xl font-bold">Leaderboard</h2>
                <div className="ms-auto flex gap-2">
                    {!toShowLeaderboard && <button onClick={() => {setToShowLeaderboard(true)}} className="rounded-lg bg-blue-700 hover:bg-blue-500 hover:cursor-pointer px-2 py-1">View Top Scores</button>}
                    {toShowLeaderboard && <button onClick={() => loadEntries(true)} className="rounded-lg bg-yellow-700 hover:bg-yellow-500 hover:cursor-pointer px-2 py-1">Refresh</button>}
                    {toShowLeaderboard && <button onClick={() => {setToShowLeaderboard(false)}} className="rounded-lg bg-blue-700 hover:bg-blue-500 hover:cursor-pointer px-2 py-1">Hide Top Scores</button>}
                </div>
            </div>

            {toShowLeaderboard && isLoading && <p>Loading...</p>}
            {toShowLeaderboard && !isLoading && (!entries || entries.length === 0) && <p>No entries found.</p>}
            {toShowLeaderboard && !isLoading && entries.length > 0 && <div className="space-y-2">
                    <div className="px-2 flex justify-between">
                    <div className="grid grid-cols-3 gap-4 w-full">
                        <div>Submitted At</div>
                        <div>Word</div>
                        <div>Score</div>
                    </div>
                    <div className="w-40 flex">
                        
                    </div>
                </div>
                    {entries.map((entry: any) => (
                        <LeaderboardEntry key={entry.id} {...entry} loadWord={loadWord} loadEntries={loadEntries}/>
                    ))}
                </div>
            }
        </div>
    );
}

export default Leaderboard;
