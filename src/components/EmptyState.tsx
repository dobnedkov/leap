import React from "react";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
}) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <p className="empty-state-title">{title}</p>
      {description && (
        <p className="empty-state-desc">{description}</p>
      )}
      {action && <div className="empty-state-action">{action}</div>}
    </div>
  );
};
