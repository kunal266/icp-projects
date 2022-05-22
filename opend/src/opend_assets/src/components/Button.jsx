import React from 'react';
function Button(prop) {
    return (
        <div className="Chip-root makeStyles-chipBlue-108 Chip-clickable">
            <span
              onClick={prop.handleClick}
              className="form-Chip-label"
            >
              {prop.text}
            </span>
            </div>
    )
}
export default Button;