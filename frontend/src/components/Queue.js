import React from 'react';
import './Queue.css';
import PatientBox from './PatientBox';

const Queue = ({ patients }) => {
    console.log(patients)

    const PatientBoxes = patients.map((patient, i) =>
        <PatientBox key={i} patient={patients[i]} />
    );

    return (
        <div className="QueueContainer">
            {PatientBoxes}
        </div>
    )
};

export default Queue;