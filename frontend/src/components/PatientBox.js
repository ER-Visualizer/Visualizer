import React from 'react';
import './PatientBox.css';
import ReactTooltip from 'react-tooltip';

const getBackgroundColor = accuity => {
    const baseRed = {r: 200, g: 44, b: 5};
    const tintFactor = 1 - (2 / accuity);

    const newRed = {
        r: baseRed.r + (255 - baseRed.r) * tintFactor,
        g: baseRed.g + (255 - baseRed.g) * tintFactor,
        b: baseRed.b + (255 - baseRed.b) * tintFactor
    }

    return `rgba(${newRed.r}, ${newRed.g}, ${newRed.b})`;
};

const PatientBox = ({ patient }) => {
    return <React.Fragment>
        <div 
            data-tip={`Id: ${patient.id} <br> Accuity: ${patient.accuity}`}
            style={{background: getBackgroundColor(patient.accuity)}} 
            className="Patient">
                {patient.id}
        </div>
        <ReactTooltip
            multiline
            effect="solid"
            className="tooltip" />
    </React.Fragment>
};

export default PatientBox;