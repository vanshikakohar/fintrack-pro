// src/components/ui/card.jsx
export const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl shadow p-4 bg-white ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={`mt-2 ${className}`}>{children}</div>
);
