const BACKEND_URL = process.env.NEXT_PUBLIC_SCRABBLE_BACKEND_URL || '';

export const submitScore = async (word: string, score: number) => {
    const response = await fetch(`${BACKEND_URL}/api/score-submission`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word, score }),
    }).then(res => res.json()).catch((error) => {
        console.log('Error submitting score:', error);
    });
    return response;
};

export const deleteScore = async (id: string) => {
    const response = await fetch(`${BACKEND_URL}/api/score-submission/${id}`, {
        method: 'DELETE',
    }).catch((error) => {
        console.log('Error deleting score:', error);
    });
    return response;
};

export const getSubmissions = async (sortKey: string, isAscending: boolean) => {
    const response = await fetch(`${BACKEND_URL}/api/score-submission?sortKey=${sortKey}&isAscending=${isAscending}`, {
        method: 'GET',
    }).then(res => res.json()).catch((error) => {
        console.log('Error fetching submissions:', error);
    });
    return response;
};