import React from 'react';
import './Rule.css';
import {ReactComponent as RemoveIcon} from '../remove.svg';

const Rule = ({ children, name, ruleType, columnName, onDropdownChange,
    onInputChange, removeRule }) => <div className="Rule">
        <select name={name}
                value={ruleType || "type"}
                onChange={onDropdownChange}>
            <option value="type" disabled>Rule Type</option>
            {children}
        </select>
        {name !== "resourceRules" &&
            <input
                type="text"
                name="columnName"
                placeholder="Column Name"
                value={columnName} 
                onChange={onInputChange}
            ></input>
        }
        <div className="RuleIconContainer">
            <RemoveIcon className="RuleIcon" onClick={removeRule} />
        </div>
    </div>;

export default Rule;