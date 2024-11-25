import React from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

function DatePicker({ dateRange, onDateChange }) {
    return (
        <div className="date-picker">
            <DateRange
                ranges={[dateRange]}
                onChange={onDateChange}
                moveRangeOnFirstSelection={false}
                editableDateInputs={true}
                rangeColors={['#f8e6d1']} // Customize color to match theme
            />
        </div>
    );
}

export default DatePicker;
