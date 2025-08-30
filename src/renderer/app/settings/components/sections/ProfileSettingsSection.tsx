// 🔥 사용자 프로필 섹션
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { User, Camera, RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { SETTINGS_PAGE_STYLES } from '../../constants/styles';
import { SettingItem } from '../controls/SettingItem';
import { Avatar } from '../../../../components/ui/Avatar';
import { Logger } from '../../../../../shared/logger';
import type { UpdateSettingFunction } from '../../types';

interface Props {
    settings: any;
    updateSetting: UpdateSettingFunction;
}

export const ProfileSettingsSection: React.FC<Props> = ({ settings, updateSetting }) => {
    const [displayName, setDisplayName] = useState(settings.displayName || settings.username || '');
    const [avatarSrc, setAvatarSrc] = useState<string | undefined>(settings.avatar || undefined);
    const [uploading, setUploading] = useState(false);
    const [editingImage, setEditingImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        setDisplayName(settings.displayName || settings.username || '');
        // Handle different avatar protocols
        if (settings.avatar && settings.avatar.startsWith('file://')) {
            const path = settings.avatar.replace(/^file:\/\//, '');
            (window.electronAPI as any).files?.readFileAsDataUrl(path).then((r: any) => {
                if (r && r.success && r.data) {
                    setAvatarSrc(r.data as string);
                } else {
                    setAvatarSrc(undefined);
                }
            }).catch(() => setAvatarSrc(undefined));
        } else if (settings.avatar && (settings.avatar.startsWith('loop-avatar://') || settings.avatar.startsWith('data:'))) {
            // 🔥 loop-avatar:// 프로토콜과 data: URL 직접 사용
            setAvatarSrc(settings.avatar);
        } else {
            setAvatarSrc(settings.avatar || undefined);
        }
    }, [settings]);

    const handleDisplayNameChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setDisplayName(newName);

        // Clear existing debounce
        if (debounceRef.current) {
            clearTimeout(debounceRef.current);
        }

        // Debounce the save operation by 500ms
        debounceRef.current = setTimeout(async () => {
            try {
                await updateSetting('account', 'displayName', newName || undefined);
                Logger.info('PROFILE_SETTINGS', 'Display name updated', { displayName: newName });
            } catch (error) {
                Logger.error('PROFILE_SETTINGS', 'Failed to update display name', error);
            }
        }, 500);
    }, [updateSetting]);

    // Cleanup debounce on unmount
    useEffect(() => {
        return () => {
            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }
        };
    }, []);

    const handleAvatarUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0];
        if (!f) return;

        // Size limit check (5MB)
        const maxSize = 5 * 1024 * 1024;
        if (f.size > maxSize) {
            Logger.warn('PROFILE_SETTINGS', 'File size exceeds 5MB limit', { size: f.size, maxSize });
            return;
        }

        try {
            const reader = new FileReader();
            reader.onload = async () => {
                const dataUrl = reader.result as string;

                Logger.info('PROFILE_SETTINGS', 'File upload detected', {
                    fileName: f.name,
                    fileType: f.type,
                    dataUrlPrefix: dataUrl.substring(0, 30) + '...'
                });

                // 🔥 수정: 모든 이미지를 편집기로 전달 (GIF 포함)
                setEditingImage(dataUrl);

                // allow re-uploading same file by clearing input value
                try { if (fileInputRef.current) fileInputRef.current.value = ''; } catch (e) { }
            };
            reader.readAsDataURL(f);
        } catch (error) {
            Logger.error('PROFILE_SETTINGS', 'Failed to read file', error);
        }
    }, [updateSetting]);

    // initial-letter fallback component
    const initial = (displayName || settings.username || settings.email || 'L').charAt(0).toUpperCase();

    // save cropped image from modal
    const handleSaveCropped = React.useCallback(async (dataUrl: string) => {
        try {
            setUploading(true);
            await updateSetting('account', 'avatar', dataUrl);
            Logger.info('PROFILE_SETTINGS', 'Avatar saved from cropper');
        } catch (e) {
            Logger.error('PROFILE_SETTINGS', 'Failed to save cropped avatar', e);
        } finally {
            setUploading(false);
            setEditingImage(null);
        }
    }, [updateSetting]);

    return (
        <div className={SETTINGS_PAGE_STYLES.sectionCard}>
            <div className={SETTINGS_PAGE_STYLES.sectionHeader}>
                <User className={SETTINGS_PAGE_STYLES.sectionIcon} />
                <h2 className={SETTINGS_PAGE_STYLES.sectionTitle}>사용자 프로필</h2>
            </div>

            <div className={SETTINGS_PAGE_STYLES.settingItem}>
                <SettingItem
                    title="프로필 사진"
                    description="파일 업로드 또는 기본 이니셜을 사용합니다 (최대 5MB, 모든 이미지 편집 가능)"
                    control={(
                        <div className="flex items-center gap-3">
                            <Avatar size="lg" src={avatarSrc} fallback={initial} aria-label="프로필 이미지">
                                <span className="text-lg font-medium">{initial}</span>
                            </Avatar>
                            <label className={`${SETTINGS_PAGE_STYLES.button} ${SETTINGS_PAGE_STYLES.secondaryButton} ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleAvatarUpload}
                                    className="hidden"
                                    disabled={uploading}
                                />
                                <Camera className="w-4 h-4 mr-2 inline" />
                                {uploading ? '업로드 중...' : '업로드'}
                            </label>
                        </div>
                    )}
                />

                <SettingItem
                    title="이름(별명)"
                    description="앱에 표시될 이름을 입력하세요 (변경 시 자동 저장)"
                    control={(
                        <input
                            type="text"
                            value={displayName}
                            onChange={handleDisplayNameChange}
                            className={SETTINGS_PAGE_STYLES.textInput}
                            placeholder="표시될 이름을 입력하세요"
                        />
                    )}
                />
            </div>
            {editingImage && (
                <ImageCropperModal
                    src={editingImage}
                    onCancel={() => setEditingImage(null)}
                    onSave={handleSaveCropped}
                />
            )}
        </div>
    );
};

// Simple image cropper modal for circular crop
function ImageCropperModal({ src, onCancel, onSave }: { src: string; onCancel: () => void; onSave: (dataUrl: string) => void }) {
    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const imgRef = React.useRef<HTMLImageElement | null>(null);
    const [scale, setScale] = React.useState<number>(1);
    const [rotation, setRotation] = React.useState<number>(0);
    const [offset, setOffset] = React.useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const dragging = React.useRef<{ active: boolean; startX: number; startY: number; origX: number; origY: number }>({ active: false, startX: 0, startY: 0, origX: 0, origY: 0 });

    React.useEffect(() => {
        // reset
        setScale(1);
        setOffset({ x: 0, y: 0 });
    }, [src]);

    const onMouseDown = (e: React.MouseEvent) => {
        dragging.current = { active: true, startX: e.clientX, startY: e.clientY, origX: offset.x, origY: offset.y };
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!dragging.current.active) return;
        const dx = e.clientX - dragging.current.startX;
        const dy = e.clientY - dragging.current.startY;
        setOffset({ x: dragging.current.origX + dx, y: dragging.current.origY + dy });
    };

    const onMouseUp = () => {
        dragging.current.active = false;
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
    };

    const handleSave = () => {
        const size = 256; // output thumbnail size
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx || !imgRef.current || !containerRef.current) return;

        // Draw circular clip
        ctx.clearRect(0, 0, size, size);
        ctx.save();
        ctx.beginPath();
        ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        ctx.closePath();
        ctx.clip();

        const img = imgRef.current;
        const rect = containerRef.current.getBoundingClientRect();

        // compute drawn image parameters relative to container
        const imgW = img.naturalWidth * scale;
        const imgH = img.naturalHeight * scale;

        // position of image center relative to container center
        const cx = rect.width / 2 + offset.x;
        const cy = rect.height / 2 + offset.y;

        // top-left in container coords
        const sx = cx - imgW / 2;
        const sy = cy - imgH / 2;

        // draw with scaling to canvas
        // compute scale factor from container -> canvas
        const factor = size / rect.width;

        // apply rotation by translating canvas
        if (rotation % 360 !== 0) {
            ctx.translate(size / 2, size / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.translate(-size / 2, -size / 2);
        }

        ctx.drawImage(img, sx * factor, sy * factor, imgW * factor, imgH * factor);

        ctx.restore();

        // 🔥 수정: PNG로 변환하는 로직만 남기고, GIF 관련 분기 모두 제거
        const thumbDataUrl = canvas.toDataURL('image/png');
        onSave(thumbDataUrl);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-[540px] max-w-[90vw] shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">아바타 편집</h3>
                    <button
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1"
                        onClick={onCancel}
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                {/* Preview area */}
                <div className="relative bg-slate-100 dark:bg-slate-700 rounded-xl overflow-hidden mb-6" style={{ height: 320 }}>
                    <div
                        ref={containerRef}
                        className="w-full h-full flex items-center justify-center relative cursor-move select-none"
                        onMouseDown={onMouseDown}
                    >
                        <img
                            ref={imgRef}
                            src={src}
                            alt="편집 중"
                            style={{
                                transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale}) rotate(${rotation}deg)`,
                                maxWidth: 'none',
                                userSelect: 'none',
                                pointerEvents: 'none'
                            }}
                            draggable={false}
                        />
                        {/* Circular crop overlay */}
                        <div
                            className="absolute pointer-events-none"
                            style={{
                                left: '50%',
                                top: '50%',
                                width: 224,
                                height: 224,
                                transform: 'translate(-50%, -50%)',
                                borderRadius: '50%',
                                boxShadow: '0 0 0 9999px rgba(0,0,0,0.6)',
                                border: '3px solid rgba(255,255,255,0.9)'
                            }}
                        />
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                    {/* Zoom control */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <ZoomOut className="w-4 h-4" />
                            <span className="text-sm font-medium min-w-[2rem]">크기</span>
                        </div>
                        <input
                            type="range"
                            min={0.5}
                            max={3}
                            step={0.05}
                            value={scale}
                            onChange={(e) => setScale(Number(e.target.value))}
                            className="flex-1 h-2 bg-slate-200 dark:bg-slate-600 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <ZoomIn className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                    </div>

                    {/* Rotation controls */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                            <RotateCcw className="w-4 h-4" />
                            <span className="text-sm font-medium min-w-[2rem]">회전</span>
                        </div>
                        <div className="flex-1 flex items-center gap-2">
                            <button
                                type="button"
                                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                onClick={() => setRotation((r) => (r - 90) % 360)}
                                title="왼쪽으로 90° 회전"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
                                onClick={() => setRotation((r) => (r + 90) % 360)}
                                title="오른쪽으로 90° 회전"
                            >
                                <RotateCw className="w-4 h-4" />
                            </button>
                        </div>
                        <span className="text-sm text-slate-500 dark:text-slate-400 min-w-[3rem]">{rotation}°</span>
                    </div>
                </div>

                {/* Footer buttons */}
                <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button
                        className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        onClick={onCancel}
                    >
                        취소
                    </button>
                    <button
                        className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                        onClick={handleSave}
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
}

// integrate modal usage in ProfileSettingsSection via editingImage state

export default ProfileSettingsSection;
