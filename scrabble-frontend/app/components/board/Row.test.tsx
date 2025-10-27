/**
 * @jest-environment jsdom
 */

import { render, screen, fireEvent, act } from "@testing-library/react";
import Row from "./Row";
import { submitScore } from "@/app/service/scoreSubmission";
import userEvent from "@testing-library/user-event";
import Swal from "sweetalert2";
import { getLetterPoints } from "./rules";

// mock external dependencies
jest.mock("@/app/service/scoreSubmission");
jest.mock("sweetalert2", () => ({
  fire: jest.fn(),
  mixin: jest.fn().mockReturnThis()
}));
jest.mock("../common/toast");
jest.mock("./rules", () => ({
  ...jest.requireActual("./rules"),
  getLetterPoints: jest.fn(),
  LETTER_POINTS: { A: 1, B: 3, C: 3 }
}));

describe("Row Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getLetterPoints as jest.Mock).mockImplementation((letter) => {
      if (!letter) return 0;
      return { A: 1, B: 3, C: 3 }[letter] ?? 0;
    });
  });

  test("renders 10 square inputs", () => {
    render(<Row loadedWord="" refreshLeaderboard={jest.fn()} />);
    const inputs = screen.getAllByRole("textbox");
    expect(inputs.length).toBe(10);
  });

  test("loads word when loadedWord prop changes", () => {
    const { rerender } = render(<Row loadedWord="" refreshLeaderboard={jest.fn()} />);
    rerender(<Row loadedWord="HELLO" refreshLeaderboard={jest.fn()} />);

    const inputs = screen.getAllByRole("textbox");
    expect(inputs[0]).toHaveValue("H");
    expect(inputs[4]).toHaveValue("O");
  });

  test("calculates total score correctly", () => {
    render(<Row loadedWord="AB" refreshLeaderboard={jest.fn()} />);
    expect(screen.getByText(/Total Score/i)).toHaveTextContent("4");
  });

  test("resets tiles when Reset button clicked", async () => {
    render(<Row loadedWord="HELLO" refreshLeaderboard={jest.fn()} />);

    const resetButton = screen.getByText(/Reset Tiles/i);

    await act(async () => {
        fireEvent.click(resetButton);
    }).then(() => {
        const inputs = screen.getAllByRole("textbox");
        inputs.forEach((input) => expect(input).toHaveValue(""));
    });
});

  test("shows letter scores modal", async () => {
    render(<Row loadedWord="" refreshLeaderboard={jest.fn()} />);
    const button = screen.getByText(/Show Letter Scores/i);
    await act(async () => fireEvent.click(button));
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ title: "Letter Scores" }));
  });

  test("submits score successfully", async () => {
    const mockRefresh = jest.fn();
    (submitScore as jest.Mock).mockResolvedValue({});

    render(<Row loadedWord="AB" refreshLeaderboard={mockRefresh} />);

    const saveButton = screen.getByText(/Save Score/i);

    await act(async () => {
      await userEvent.click(saveButton);
    }).then(() => {
        expect(submitScore).toHaveBeenCalledWith("AB", 4);
        expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "success" }));
        expect(mockRefresh).toHaveBeenCalled();
    });
  });
});
