import React from 'react'; 
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event'; 
import Filters from '../components/Filters';

function setupTest() {


    render(
    <Filters />);
    const filterProvinceInput = screen.queryByLabelText('Provincia');
    const selectProvinceOptions = screen.queryAllByText('selectOption');

    return { filterProvinceInput, selectProvinceOptions };
}

test('Select province options should not be more than 9', async () => {
    const { filterProvinceInput, selectProvinceOptions } = setupTest();
    await userEvent.click(filterProvinceInput);
    expect(selectProvinceOptions).toBeInTheDocument();
    expect(selectProvinceOptions.length).toBe(9);
})