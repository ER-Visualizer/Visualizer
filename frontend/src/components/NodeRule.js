import React from 'react';
import Rule from './Rule';

const NodeRule = ({ ruleType, columnName, allowedAcuity, nodeId, onDropdownChange,
    onInputChange, removeRule }) => <Rule
        name="nodeRules"
        ruleType={ruleType}
        columnName={columnName}
        nodeId={nodeId}
        allowedAcuity={allowedAcuity}
        onDropdownChange={onDropdownChange}
        onInputChange={onInputChange}
        removeRule={removeRule}
    >
        <option value="prediction">Prediction</option>
        <option value="frequency">Frequency</option>
        <option value="frequencyAfterNode">Frequency After Node</option>
        <option value="limitAcuity">Limit Acuity</option>

    </Rule>;

export default NodeRule;