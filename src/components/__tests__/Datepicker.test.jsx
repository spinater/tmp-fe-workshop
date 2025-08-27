import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import Datepicker from '../Datepicker'

test('opens calendar and selects date', () => {
  render(<Datepicker initialDate="2025-08-01T00:00:00.000Z" />)
  const input = screen.getByTestId('datepicker-input')
  // initially closed
  expect(screen.queryByText('August 2025')).toBeNull()
  // open
  fireEvent.click(input)
  expect(screen.getByText('August 2025')).toBeInTheDocument()
  // click a specific day button (e.g., 15)
  const dayButton = screen.getByTestId('day-2025-08-15')
  fireEvent.click(dayButton)
  // calendar should close and input value set
  expect(screen.queryByText('August 2025')).toBeNull()
  expect(input.value).toBe('2025-08-15')
})
