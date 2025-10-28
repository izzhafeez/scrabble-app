import { render, screen, waitFor } from '@testing-library/react';
import LeaderboardEntry from './LeaderboardEntry';

// Mock deleteScore function
jest.mock('../../service/scoreSubmission', () => ({
  deleteScore: jest.fn(() => Promise.resolve()),
}));

// Mock toast
jest.mock('../common/toast', () => ({
  fire: jest.fn(),
}));

const mockLoadWord = jest.fn();
const mockLoadEntries = jest.fn();

describe('LeaderboardEntry component', () => {
  afterEach(() => jest.clearAllMocks());

  test('renders leaderboard entry correctly', () => {
    render(
      <LeaderboardEntry
        word="AMAZING"
        score={42}
        submittedAt="2024-01-01T10:00:00Z"
        id="test-id"
        loadWord={mockLoadWord}
        loadEntries={mockLoadEntries}
      />
    );

    expect(screen.getByText('AMAZING')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText(new Date("2024-01-01T10:00:00Z").toLocaleString())).toBeInTheDocument();
  });

  test('calls loadWord when View button is clicked', () => {
    render(
      <LeaderboardEntry
        word="TestWord"
        score={42}
        submittedAt="2024-01-01T10:00:00Z"
        id="test-id"
        loadWord={mockLoadWord}
        loadEntries={mockLoadEntries}
      />
    );

    const viewButton = screen.getByText('View');
    viewButton.click();

    expect(mockLoadWord).toHaveBeenCalledWith('TestWord');
  });

  test('calls deleteScore and loadEntries when Delete button is clicked', async () => {
    const { deleteScore } = require('../../service/scoreSubmission');
    const { fire } = require('../common/toast');

    render(
      <LeaderboardEntry
        word="TestWord"
        score={42}
        submittedAt="2024-01-01T10:00:00Z"
        id="test-id"
        loadWord={mockLoadWord}
        loadEntries={mockLoadEntries}
      />
    );

    const deleteButton = screen.getByText('Delete');
    deleteButton.click();

    await waitFor(() => {
      expect(deleteScore).toHaveBeenCalledWith('test-id');
      expect(fire).toHaveBeenCalledWith({
        icon: 'success',
        title: 'Entry Deleted'
      });
      expect(mockLoadEntries).toHaveBeenCalledWith(false);
    });
  });
});