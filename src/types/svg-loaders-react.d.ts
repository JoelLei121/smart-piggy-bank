// src/types/svg-loaders-react.d.ts
declare module 'svg-loaders-react' {
    import { FC } from 'react';
    
    export const SpinningCircles: FC<{
      className?: string;
      strokeColor?: string;
      strokeWidth?: string | number;
    }>;
    

  }