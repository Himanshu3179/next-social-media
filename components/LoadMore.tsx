"use client"
import React from 'react'
import { Button } from './ui/button'

const LoadMore = () => {
    const handleLoadMore = () => {
        console.log('Load more')
    }
    return (
        <Button
            onClick={handleLoadMore}
        />
    )
}

export default LoadMore