import { createContext } from 'react';

export const ThemeContext = createContext(null);

export const THEMES = [
    {
        id: 'blue_light',
        name: '藍色明亮',
        type: 'light',
        colors: {
            appBg: 'bg-slate-50',
            panelBg: 'bg-white',
            sidebarBg: 'bg-slate-900',
            border: 'border-slate-200',
            textMain: 'text-slate-800',
            textSub: 'text-slate-500',
            primary: 'bg-blue-600',
            primaryText: 'text-white',
            accent: 'text-blue-600',
            hover: 'hover:bg-slate-50',
            inputBg: 'bg-white',
            cardShadow: 'shadow-sm'
        }
    },
    {
        id: 'dark',
        name: '深色模式',
        type: 'dark',
        colors: {
            appBg: 'bg-gray-900',
            panelBg: 'bg-gray-800',
            sidebarBg: 'bg-gray-950',
            border: 'border-gray-700',
            textMain: 'text-gray-100',
            textSub: 'text-gray-400',
            primary: 'bg-blue-600',
            primaryText: 'text-white',
            accent: 'text-blue-400',
            hover: 'hover:bg-gray-700',
            inputBg: 'bg-gray-900',
            cardShadow: 'shadow-none'
        }
    }
];
