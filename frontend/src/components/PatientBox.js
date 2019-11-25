import React from 'react';
import './PatientBox.css';

const getBackgroundColor = accuity => {
    const baseRed = {r: 200, g: 44, b: 5};

    // const newRed = baseRed;
    const tintFactor = 1 - (2 / accuity);

    const newRed = {
        r: baseRed.r + (255 - baseRed.r) * tintFactor,
        g: baseRed.g + (255 - baseRed.g) * tintFactor,
        b: baseRed.b + (255 - baseRed.b) * tintFactor
    }

    return `rgba(${newRed.r}, ${newRed.g}, ${newRed.b})`;
};

const PatientBox = ({ patient }) => {
    return (
        <div
            style={{background: getBackgroundColor(patient.accuity)}} 
            className="Patient">
        </div>
    )
};

export default PatientBox;