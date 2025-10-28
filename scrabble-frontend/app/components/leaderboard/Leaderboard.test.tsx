import { act, render, screen, waitFor } from '@testing-library/react';
import Leaderboard from './Leaderboard';

// Mock getSubmissions function
jest.mock('../../service/scoreSubmission', () => ({
  getSubmissions: jest.fn(() =>
    Promise.resolve([
      { word: "BISHAN", score: 76, id: 1 },
      { word: "ALJUNIED", score: 89, id: 2 },
      { word: "CLEMENTI", score: 54, id: 3 },
    ])
  ),
}));

// Mock LeaderboardEntry component
jest.mock('./LeaderboardEntry', () => (props: any) => {
  return (
    <div data-testid="leaderboard-entry" key={props.id}>
        {props.word} - {props.score}
    </div>
  );
});

// Mock toast
jest.mock('../common/toast', () => ({
    fire: jest.fn(),
}));

const mockLoadWord = jest.fn();

describe('Leaderboard component', () => {
  afterEach(() => jest.clearAllMocks());

  test('renders leaderboard with scores', async () => {
    render(<Leaderboard loadWord={mockLoadWord} refreshFlag={false} />);

    // click to show leaderboard
    await act(async () => {
        const viewButton = screen.getByText('View Top Scores');
        viewButton.click();
    });

    // wait for async leaderboard load
    await waitFor(() => {
        expect(screen.getByText(/ALJUNIED/i)).toBeInTheDocument();
        expect(screen.getByText(/BISHAN/i)).toBeInTheDocument();
        expect(screen.getByText(/CLEMENTI/i)).toBeInTheDocument();
    });
  });

  test('shows message when no scores are available', async () => {
    // Override mock to return empty array
    const { getSubmissions } = require('../../service/scoreSubmission');
    getSubmissions.mockResolvedValueOnce([]);

    render(<Leaderboard loadWord={mockLoadWord} refreshFlag={false} />);

    // click to show leaderboard
    await act(async () => {
        const viewButton = screen.getByText('View Top Scores');
        viewButton.click();
    });

    // wait for async leaderboard load
    await waitFor(() => {
        const noScoresMessage = screen.getByText(/No entries found/i);
        expect(noScoresMessage).toBeInTheDocument();
    });
  });
});
