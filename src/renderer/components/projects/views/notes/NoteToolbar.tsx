'use client';

import React from 'react';
import { NoteToolbarProps, NOTE_TYPES, NOTES_STYLES } from './types';

export const NoteToolbar = React.memo(({ selectedType, onTypeChange }: NoteToolbarProps): React.ReactElement => {
    return (
        <div className={NOTES_STYLES.typeButtons}>
            {NOTE_TYPES.map((type) => {
                const IconComponent = type.icon;
                const isActive = selectedType === type.id;

                return (
                    <button
                        key={type.id}
                        onClick={() => onTypeChange(type.id)}
                        className={`${NOTES_STYLES.typeButton} ${isActive ? NOTES_STYLES.typeButtonActive : ''}`}
                    >
                        <IconComponent className="w-5 h-5" />
                        <span>{type.label}</span>
                    </button>
                );
            })}
        </div>
    );
});

NoteToolbar.displayName = 'NoteToolbar';