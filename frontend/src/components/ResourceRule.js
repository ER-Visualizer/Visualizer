import React from 'react';
import Rule from './Rule';

const ResourceRule = ({ ruleType, onDropdownChange, removeRule }) => <Rule
        name="resourceRules"
        ruleType={ruleType}
        onDropdownChange={onDropdownChange}
        removeRule={removeRule}
    >
        <option value="firstComeFirstServe">First Come First Serve</option>
    </Rule>;

export default ResourceRule;