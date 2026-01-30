import React from 'react';
import { Problem } from './components/Problem';
import { Comparison } from './components/Comparison';
import { Trust } from './components/Trust';

// Simple test file to verify components render
export const TestSections = () => {
    return (
        <div className="min-h-screen bg-bg text-white">
            <h1 className="text-4xl p-8">Testing Missing Sections</h1>

            <div className="border-t-4 border-red-500">
                <Problem />
            </div>

            <div className="border-t-4 border-green-500">
                <Comparison />
            </div>

            <div className="border-t-4 border-blue-500">
                <Trust />
            </div>
        </div>
    );
};
