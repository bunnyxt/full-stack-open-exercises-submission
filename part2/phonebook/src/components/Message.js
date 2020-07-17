import React from 'react'

const Message = ({ text, type }) => {
    if (text === null) {
        return null;
    }

    return (
        <div className={type}>
            {text}
        </div>
    )
}

export default Message
