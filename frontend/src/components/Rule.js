import React from 'react';
import './Rule.css';
import {ReactComponent as RemoveIcon} from '../remove.svg';

const Rule = ({ children, name, ruleType, columnName, nodeId, onDropdownChange,
    onInputChange, removeRule }) => <div className="Rule">
        <select name={name}
                value={ruleType || "type"}
                onChange={onDropdownChange}>
            <option value="type" disabled>Rule Type</option>
            {children}
        </select>
        {name !== "resourceRules" && ruleType!== "frequencyAfterNode" &&
            <input
                type="text"
                name="columnName"
                placeholder="Column Name"
                value={columnName} 
                onChange={onInputChange}
            ></input>
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