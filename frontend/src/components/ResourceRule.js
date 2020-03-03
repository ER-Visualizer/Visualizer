import React from 'react';
import Rule from './Rule';

const ResourceRule = ({ ruleType, nodeId, onDropdownChange, onInputChange, removeRule }) => <Rule
        name="resourceRules"
        ruleType={ruleType}
        nodeId={nodeId}
        onDropdownChange={onDropdownChange}
        onInputChange={onInputChange}
        removeRule={removeRule}
    >
        <option value="firstComeFirstServe">First Come First Serve</option>
        <option value="requiresNode">Requires Node</option>
    </Rule>;

export default ResourceRule;