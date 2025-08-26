import React from "react";
import '@/styles/loader.css'

const Loader = ({height}:{height: number}) => {
  return (
    <svg className={`loader h-${height}`} viewBox="25 25 50 50">
      <circle r="20" cy="50" cx="50"></circle>
    </svg>
  );
};

export default Loader;
