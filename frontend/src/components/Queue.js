import React from 'react';
import './Queue.css';
import PatientBox from './PatientBox';
import Patient from '../models/Patient';

const Queue = ({ patients }) => {
    console.log({patients});
    patients.sort((patient1, patient2) =>
        patient1.accuity - patient2.accuity);
    const PatientBoxes = patients.map((patient, i) =>
        <PatientBox key={i} patient={patient} />
    );

    return (
        <div className="QueueContainer">
            <div className="Queue">
                {PatientBoxes}
            </div>
        </div>
    )
};

export default Queue;