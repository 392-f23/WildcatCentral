import { render, fireEvent } from '@testing-library/react';
import { vi, expect } from 'vitest';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  it('renders correctly', () => {
    const mockHandleSearch = vi.fn();
    const { getByPlaceholderText } = render(<SearchBar handleSearch={mockHandleSearch} />);

    expect(getByPlaceholderText('Search…')).toBeTruthy();
  });

  it('calls handleSearch on input change', () => {
    const mockHandleSearch = vi.fn();
    const { getByPlaceholderText } = render(<SearchBar handleSearch={mockHandleSearch} />);
    const input = getByPlaceholderText('Search…');

    fireEvent.change(input, { target: { value: 'test' } });
    expect(mockHandleSearch).toHaveBeenCalledWith('test');
  });
});
