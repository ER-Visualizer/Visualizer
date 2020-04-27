import React from 'react';
import './Rule.css';
import {ReactComponent as RemoveIcon} from '../remove.svg';

const Rule = ({ children, name, ruleType, columnName, nodeId, allowedAcuity, definedFunction, onDropdownChange,
    onInputChange, removeRule }) => <div className="Rule">
        <select name={name}
                value={ruleType || "type"}
                onChange={onDropdownChange}>
            <option value="type" disabled>Rule Type</option>
            {children}
        </select>
        {name !== "resourceRules" && ruleType !== "frequencyAfterNode" && ruleType !== "limitAcuity" &&
            <input
                type="text"
                name="columnName"
                placeholder="Column Name"
                value={columnName} 
                onChange={onInputChange}
            ></input>
        }
        {ruleType == "requiresNode" &&
            <input
                type="text"
                name="nodeId"
                placeholder="Node Id"
                value={nodeId}
                onChange={onInputChange}
            ></input>
        }
        {ruleType == "defineYourOwn" &&
            <div className="defineContainer">
            <label>Custom</label><br/><br/>
            <div style={{color: 'green', marginLeft: '20px'}}>
            """<br/>
            Set a custom resource rule for the patient at this node<br/><br/>
            Attributes available:<br/>
            patient.get_acuity() <br/> Returns a integer value of the patient's acuity<br/><br/>
            patient.get_start_time() <br/> Returns the number of minutes it took for patient to enter the simulation
            after the simulation started.<br/><br/>
            patient.get_attribute(attribute) <br/> Returns the value of the attribute for the patient as indicated by the uploaded CSV <br/><br/>
            int(patient.get_id()) <br/> Returns a integer value of the patient's id <br/><br/>
            <br/><br/>
            """
            </div>
            <br/>
            <div style={{marginLeft: '20px'}}>
            duration = 0<br/>
            <div style={{color: 'grey'}}> # Set duration to the amount of time you want the patient to take<br/>
            # DO NOT RETURN ANYTHING IN THE CODE <br/></div>
            </div>
            <textarea
                type="text"
                name="definedFunction"
                style={{marginLeft: '20px', width: '80%', fontSize: '15px'}}
                value={definedFunction} onChange={onInputChange}></textarea>
            </div>
//            <input
//                type="text"
//                name="nodeId"
//                placeholder="Node Id"
//                value={nodeId}
//                onChange={onInputChange}
//            ></input>
        }
        {ruleType == "limitAcuity" &&
         <div id="parent">
            <input
                type="text"
                name="columnName"
                placeholder="Column Name"
                value={columnName}
                onChange={onInputChange}
            ></input>
            <input
                type="text"
                name="allowedAcuity"
                placeholder="Allowed Acuity"
                value={allowedAcuity}
                onChange={onInputChange}
            ></input>
         </div>
        }
        {ruleType === "frequencyAfterNode" &&
         <div id="parent">
            <input
                type="text"
                name="columnName"
                placeholder="Column Name"
                value={columnName}
                onChange={onInputChange}
            ></input>
            <input
                type="text"
                name="nodeId"
                placeholder="Node Id"
                value={nodeId}
                onChange={onInputChange}
            ></input>
         </div>
        }
        <div className="RuleIconContainer">
            <RemoveIcon className="RuleIcon" onClick={removeRule} />
        </div>
    </div>;

export default Rule;
