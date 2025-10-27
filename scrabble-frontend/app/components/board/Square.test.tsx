import { render, screen, fireEvent } from '@testing-library/react';
import Square from './Square';
import { getLetterPoints } from './rules';

// Mock getLetterPoints
jest.mock('./rules', () => ({
  getLetterPoints: jest.fn((letter: string) => {
    const mockPoints: Record<string, number> = { A: 1, B: 3, C: 3 };
    return mockPoints[letter] ?? 0;
  }),
}));

describe('Square component', () => {
  let onChange: jest.Mock;
  let onFocus: jest.Mock;

  beforeEach(() => {
    onChange = jest.fn();
    onFocus = jest.fn();
  });

  test('renders with initial letter', () => {
    render(<Square letter="A" onChange={onChange} onFocus={onFocus} ref={null} />);
    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('A');
  });

  test('updates score based on letter', () => {
    render(<Square letter="B" onChange={onChange} onFocus={onFocus} ref={null} />);
    expect(getLetterPoints).toHaveBeenCalledWith('B');
    const scoreCircle = screen.getByText('3'); // B = 3 points
    expect(scoreCircle).toBeInTheDocument();
  });

  test('handles typing a new letter', () => {
    render(<Square letter="" onChange={onChange} onFocus={onFocus} ref={null} />);
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'C' });
    expect(onChange).toHaveBeenCalledWith('C');
  });

  test('handles Backspace correctly', () => {
    render(<Square letter="A" onChange={onChange} onFocus={onFocus} ref={null} />);
    const input = screen.getByRole('textbox');
    fireEvent.keyDown(input, { key: 'Backspace' });
    expect(onChange).toHaveBeenCalledWith('');
    expect(input).toHaveValue('');
  });

  test('handles ArrowLeft and ArrowRight', () => {
    render(<Square letter="B" onChange={onChange} onFocus={onFocus} ref={null} />);
    const input = screen.getByRole('textbox');

    fireEvent.keyDown(input, { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenCalledWith('LEFT_ARROW');

    fireEvent.keyDown(input, { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith('RIGHT_ARROW');
  });

  test('updates when prop changes', () => {
    const { rerender } = render(<Square letter="A" onChange={onChange} onFocus={onFocus} ref={null} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('A');

    rerender(<Square letter="B" onChange={onChange} onFocus={onFocus} ref={null} />);
    expect(input).toHaveValue('B');
  });
});
