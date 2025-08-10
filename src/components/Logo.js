import React from 'react';
import LogoAsset from '../../assets/quote.svg';

const MonaLogo = ({ size = 96, color }) => {
  // color prop kept for backward compatibility but not applied because the SVG has fixed fills
  return <LogoAsset width={size} height={size} />;
};

export default MonaLogo; 