import React from 'react';
import { METHOD_TYPES } from '../../../constants/attendanceMethodsConstants';
import { MethodCard } from './MethodCard';

export const MethodsGrid = React.memo(({ enabledMethods = [], onToggleMethod, onShowDetails, isUpdating }) => {
  const methodKeysPool = Object.values(METHOD_TYPES);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {methodKeysPool.map((mKey) => {
        const isActive = enabledMethods.includes(mKey);
        return (
          <MethodCard
            key={mKey}
            methodKey={mKey}
            isActive={isActive}
            isDisabled={isUpdating}
            onToggle={() => onToggleMethod(mKey, isActive)}
            onShowDetails={() => onShowDetails(mKey)}
          />
        );
      })}
    </div>
  );
});

MethodsGrid.displayName = 'MethodsGrid';