import React from 'react';
import { Button } from '../ui/button';

function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <Button
      variant="default"
      className="w-full relative overflow-hidden font-semibold text-white bg-primary rounded-none group py-5 text-sm"
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 bg-black origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
    </Button>
  );
}

export default PrimaryButton;
