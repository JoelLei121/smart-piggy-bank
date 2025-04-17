'use client';

import * as SVGLoaders from 'svg-loaders-react';
import { useLoading } from "../lib/context";

export default function LoadingLayer() {
  const { isLoading } = useLoading();
  return (
    isLoading 
    ?
    <div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black bg-opacity-50"
      onClick={(e) => { e.preventDefault(); }}
    >
      <SVGLoaders.SpinningCircles />
      <p className="mt-4 text-lg font-large text-white">Loading...</p>
    </div> 
    :
    <></>
  )
}