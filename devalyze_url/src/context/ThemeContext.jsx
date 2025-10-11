import React, { createContext, useState, useEffect } from 'react';

export const Themecontext = createContext();

function ThemeContext({ children }) {
    const themes = {
        custom: {
            name: "custom",
            titleColor: '#000',
            bioColor: '#444',
            backgroundColor: '#fff',
            linkBackgroundColor: '#f3f4f6',
            linkBorderColor: '#e5e7eb',
            linkTextColor: '#000',
            border: '2px dashed #4e61f6',
            previewText: 'CREATE YOUR OWN',
        },
        lakeWhite: {
            name: 'lakeWhite',
            titleColor: '#222',
            bioColor: '#333',
            backgroundColor: 'rgba(255,255,255,0.8)',
            linkBackgroundColor: 'rgba(255,255,255,0.9)',
            linkBorderColor: '#e0e0e0',
            linkTextColor: '#222',
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            backdropFilter: 'blur(20px)',
        },
        lakeBlack: {
            name: 'lakeBlack',
            titleColor: '#fff',
            bioColor: '#ddd',
            backgroundColor: 'rgba(20,20,20,0.8)',
            linkBackgroundColor: 'rgba(40,40,40,0.8)',
            linkBorderColor: '#444',
            linkTextColor: '#fff',
            border: '1px solid #333',
            boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
            backdropFilter: 'blur(25px)',
        },
        airSmoke: {
            name: 'airSmoke',
            titleColor: '#f8f8f8',
            bioColor: '#d0d0d0',
            backgroundColor: '#1c1c1c',
            linkBackgroundColor: '#2a2a2a',
            linkBorderColor: '#3a3a3a',
            linkTextColor: '#f8f8f8',
            border: '1px solid #2a2a2a',
        },
        airSnow: {
            name: 'airSnow',
            titleColor: '#1b1b1b',
            bioColor: '#333',
            backgroundColor: '#f8f9fa',
            linkBackgroundColor: '#fff',
            linkBorderColor: '#ddd',
            linkTextColor: '#1b1b1b',
            border: '1px solid #ddd',
        },
        airGrey: {
            name: 'airGrey',
            titleColor: '#1a1a1a',
            bioColor: '#2e2e2e',
            backgroundColor: '#e5e7eb',
            linkBackgroundColor: '#f3f4f6',
            linkBorderColor: '#d1d5db',
            linkTextColor: '#1a1a1a',
            border: '1px solid #9ca3af',
        },
    };

    const storedThemeName = localStorage.getItem('theme') || 'lakeWhite';
    const [themeName, setThemeName] = useState(storedThemeName);
    const [theme, setTheme] = useState(themes[storedThemeName]);

    useEffect(() => {
        setTheme(themes[themeName]);
        localStorage.setItem('theme', themeName);
    }, [themeName]);

    const setThemeByName = (name) => {
        if (themes[name]) setThemeName(name);
    };

    const value = {
        theme,
        themeName,
        setThemeByName,
        availableThemes: Object.keys(themes),
    };

    return (
        <Themecontext.Provider value={value}>
            {children}
        </Themecontext.Provider>
    );
}

export default ThemeContext;