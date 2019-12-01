import React from 'react';
import Rule from './Rule';

const NodeRule = ({ ruleType, columnName, onDropdownChange,
    onInputChange, removeRule }) => <Rule
        name="nodeRules"
        ruleType={ruleType}
        columnName={columnName}
        onDropdownChange={onDropdownChange}
        onInputChange={onInputChange}
        removeRule={removeRule}
    >
        <option value="prediction">Prediction</option>
        <option value="frequency">Frequency</option>
    </Rule>;

export default NodeRule;