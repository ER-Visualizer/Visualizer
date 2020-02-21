import React from 'react';
import Rule from './Rule';

const ResourceRule = ({ ruleType, columnName, nodeId, allowedAcuity, onDropdownChange, onInputChange, removeRule }) => <Rule
        name="resourceRules"
        ruleType={ruleType}
        columnName={columnName}
        nodeId={nodeId}
        allowedAcuity={allowedAcuity}
        onDropdownChange={onDropdownChange}
        onInputChange={onInputChange}
        removeRule={removeRule}
    >
        <option value="firstComeFirstServe">First Come First Serve</option>
        <option value="requiresNode">Requires Node</option>
        <option value="limitAcuity">Limit Acuity</option>
    </Rule>;

export default ResourceRule;