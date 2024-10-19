// src/composant/textVar.js
import React from 'react';

function TextVar({text, type}) {
    if (type == "h3") {
        return (
          <h3>{text}</h3>
        );
    } else {
        return (
          <h4>{text}</h4>
        );
    }
}

export default TextVar;
