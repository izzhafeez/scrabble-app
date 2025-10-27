import { deleteScore } from "@/app/service/scoreSubmission";
import toast from "../common/toast";

const LeaderboardEntry = ({ word, score, submittedAt, id, loadWord, loadEntries }: { word: string, score: number, submittedAt: string, id: string, loadWord: (word: string) => void, loadEntries: (withToast: boolean) => void }) => {
    const handleDelete = async () => {
        await deleteScore(id).then(() => {
            toast.fire({
                icon: 'success',
                title: 'Entry Deleted'
            });
            loadEntries(false);
        });
    };

    return (
        <div className="border-2 border-gray-300/50 hover:border-green-500 rounded-lg p-2 flex justify-between">
            <div className="grid grid-cols-3 gap-4 w-full">
                <div className="my-auto">{new Date(submittedAt).toLocaleString()}</div>
                <div className="my-auto">{word}</div>
                <div className="my-auto">{score}</div>
            </div>
            <div className="w-40 flex gap-2">
                <button
                    className="rounded-lg bg-blue-700 hover:bg-blue-500 hover:cursor-pointer px-2 py-1 ms-auto"
                    onClick={() => loadWord(word)}
                >Load</button>
                <button
                    className="rounded-lg bg-red-700 hover:bg-red-500 hover:cursor-pointer px-2 py-1"
                    onClick={handleDelete}
                >Delete</button>
            </div>
        </div>
    );
}

export default LeaderboardEntry;