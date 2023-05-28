import React, { type ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
};

const CardBackground = ({ children, className }: Props) => {
  return (
    <div className={`mb-4 rounded-lg border border-shark-700 bg-shark-950 p-6 pt-2 ${className as string}`}>
      {children}
    </div>
  );
};

export default CardBackground;
