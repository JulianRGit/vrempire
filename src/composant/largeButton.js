// src/composant/largeButton.js
import React from 'react';

function LargeButton({func, text}) {
  return (
    <button className="large_button" onClick={func}>{text}</button>
  );
}

export default LargeButton;
