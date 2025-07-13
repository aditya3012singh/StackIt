// src/components/ui/dialog.tsx
import React from "react";

export const Dialog = ({ open, children }: { open: boolean; children: React.ReactNode }) => {
  if (!open) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">{children}</div>;
};

export const DialogContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
      {children}
    </div>
  );
};
