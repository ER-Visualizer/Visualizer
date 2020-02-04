import React from 'react';
import Rule from './Rule';

const NodeRule = ({ ruleType, columnName, nodeId, onDropdownChange,
    onInputChange, removeRule }) => <Rule
        name="nodeRules"
        ruleType={ruleType}
        columnName={columnName}
        nodeId={nodeId}
        onDropdownChange={onDropdownChange}
        onInputChange={onInputChange}
        removeRule={removeRule}
    >
        <option value="prediction">Prediction</option>
        <option value="frequency">Frequency</option>
        <option value="frequencyAfterNode">Frequency After Node</option>

    </Rule>;

export default NodeRule;