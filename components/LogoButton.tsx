"use client"
import React, { useEffect } from 'react';

const LogoButton = () => {
    useEffect(() => {
        const styleSheet = document.styleSheets[0];
        const keyframes = `@keyframes gradientAnimation {
      0%, 100% {
        background-position: 100% 0;
      }
      50% {
        background-position: 0 100%;
      }
    }`;
        styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

        return () => {
            styleSheet.deleteRule(styleSheet.cssRules.length - 1);
        };
    }, []);

    return (
        <div style={textStyle} className='text-xl font-bold'>
            Social Media
        </div>
    );
};

const textStyle = {

    background: 'linear-gradient(90deg,  #0000FF, #FF00FF)',
    backgroundSize: '200% 100%',
    color: 'transparent',
    backgroundClip: 'text',
    animation: 'gradientAnimation 5s ease infinite',
};

export default LogoButton;
