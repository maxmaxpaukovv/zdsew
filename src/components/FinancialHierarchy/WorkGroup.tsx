import React, { useState } from 'react'
import { HierarchicalWorkGroup } from '../../types/financialHierarchy'
import { CollapsibleHeader, FinancialTotals } from './shared'
import { PositionGroup } from './PositionGroup'

interface WorkGroupProps {
  group: HierarchicalWorkGroup
  onItemQuantityChange: (itemId: string, newQuantity: number) => void
  onSelectMotor: (itemId: string) => void
}

export const WorkGroup: React.FC<WorkGroupProps> = ({
  group,
  onItemQuantityChange,
  onSelectMotor,
}) => {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <div className="bg-blue-100 border-l-4 border-blue-400 rounded-md">
      <CollapsibleHeader
        isExpanded={isExpanded}
        toggle={() => setIsExpanded(!isExpanded)}
        className="hover:bg-blue-200 rounded-md"
      >
        <h2 className="text-sm font-bold text-blue-900 pl-2">
          {group.workGroup}
        </h2>
        <FinancialTotals
          income={group.totalIncome}
          expense={group.totalExpense}
          profit={group.totalProfit}
        />
      </CollapsibleHeader>

      {isExpanded && (
        <div className="py-2 ml-6 space-y-2">
          {group.positions.map((pos) => (
            <PositionGroup
              key={pos.id}
              group={pos}
              onItemQuantityChange={onItemQuantityChange}
              onSelectMotor={onSelectMotor}
            />
          ))}
        </div>
      )}
    </div>
  )
}
