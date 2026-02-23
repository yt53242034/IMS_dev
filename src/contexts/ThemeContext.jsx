import React, { createContext } from 'react';

export const ThemeContext = createContext();

export const THEMES = [
    {
        id: 'light',
        name: '柔和亮色',
        type: 'light',
        colors: {
            appBg: 'bg-slate-50',
            sidebarBg: 'bg-slate-800',
            panelBg: 'bg-white',
            border: 'border-slate-200',
            textMain: 'text-slate-700',
            textSub: 'text-slate-500',
            primary: 'bg-indigo-500',
            primaryText: 'text-white',
            accent: 'text-indigo-500',
            hover: 'hover:bg-slate-50',
            cardShadow: 'shadow-sm',
            modalOverlay: 'bg-slate-900/50',
            inputBg: 'bg-white'
        }
    },
    {
        id: 'dark',
        name: '柔和深色',
        type: 'dark',
        colors: {
            appBg: 'bg-slate-900',
            sidebarBg: 'bg-slate-950',
            panelBg: 'bg-slate-800',
            border: 'border-slate-700',
            textMain: 'text-slate-300',
            textSub: 'text-slate-500',
            primary: 'bg-indigo-500',
            primaryText: 'text-white',
            accent: 'text-indigo-400',
            hover: 'hover:bg-slate-700',
            cardShadow: 'shadow-none',
            modalOverlay: 'bg-black/70',
            inputBg: 'bg-slate-900'
        }
    }
];