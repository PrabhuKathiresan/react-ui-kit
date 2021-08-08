import { fireEvent, render, screen } from '@testing-library/react';
import SelectComponent from './SelectComponent';

beforeEach(() => {
  Element.prototype.getBoundingClientRect = jest.fn(() => ({
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    toJSON: () => ({
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      height: 34
    })
  }));
});

test('renders learn react link', async () => {
  render(<SelectComponent />);
  let demoSelect = screen.queryByTestId('demo-input');
  expect(demoSelect).toBeInTheDocument();

  fireEvent.focus(demoSelect);
  expect(screen.queryByTestId('demo-dropdown')).toBeInTheDocument();
});
