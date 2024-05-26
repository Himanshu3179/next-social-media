import React from 'react';

const LogoButton = () => {
    return (
        <div className='text-xl font-bold relative overflow-hidden inline-block '>
            <span className='absolute inset-0 bg-gradient-stroke transform scale-150 origin-center' aria-hidden='true'></span>
            <span className='relative text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500'>
                VibeSphere
            </span>
        </div>
    );
};

export default LogoButton;