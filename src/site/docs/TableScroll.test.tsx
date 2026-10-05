import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TableScroll } from './TableScroll';

describe('TableScroll', () => {
  it('is a named region a keyboard can focus, so a table wider than the screen can be scrolled without a mouse', () => {
    render(
      <TableScroll label="Button props">
        <table>
          <tbody>
            <tr>
              <td>size</td>
            </tr>
          </tbody>
        </table>
      </TableScroll>,
    );
    const region = screen.getByRole('region', { name: 'Button props' });
    expect(region).toHaveAttribute('tabindex', '0');
    expect(region).toHaveClass('site-props');
  });
});
