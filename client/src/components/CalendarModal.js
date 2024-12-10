import React from 'react';
import { DateRange } from 'react-date-range';
import './CalendarModal.css';

const CalendarModal = ({ dateRange, onDateChange, onClose }) => {
    return (
        <div className="calendar-modal">
            <button className="close-button" onClick={onClose}>X</button>
            <DateRange
                ranges={[dateRange]}
                onChange={(ranges) => onDateChange(ranges)}
            />
        </div>
    );
};

export default CalendarModal;
