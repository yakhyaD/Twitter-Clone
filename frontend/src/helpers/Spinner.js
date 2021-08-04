import React from 'react'

const Spinner = ({ size }) => {
    const { width, height, color } = size

    const style = {
        position: 'absolute',
        top: '30%',
        left: '45%',
        width,
        height,
        padding: '3px !important',
        margin: '0 !important',
        backgroundColor : color ?? color
    }
    return (
        <div style={style} className="spinner"></div>
    )
}

export default Spinner
