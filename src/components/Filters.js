import React from 'react';
import Filter from './Filter';
import { nanoid } from 'nanoid';
import { useAPI } from '../services/apiContext';
import '../stylesheet/layout/_filters.scss';

function Filters() {
    const { filtersWithOptions } = useAPI();
    return (
        <div className= "filters" >
            {filtersWithOptions.map((filter) => (
                <Filter key={nanoid()} data={filter} />
            ))}
        </div>
    )
}
export default Filters;
