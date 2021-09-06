import React from 'react';
import { useSelector } from "react-redux";

const FlashMessage = () => {
    const flashMessage = useSelector((state) => state.UI.flashMessage);
    return (
        <div className="flash-message" style={{ backgroundColor: flashMessage?.color}}>
            {flashMessage?.msg}
        </div>
    )
}
export default FlashMessage;
