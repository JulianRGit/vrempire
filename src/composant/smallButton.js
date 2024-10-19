// src/composant/smallButton.js
import React from 'react';

function SmallButton({func, text}) {
  return (
    <button className="small_button" onClick={func}>{text}</button>
  );
}

export default SmallButton;
