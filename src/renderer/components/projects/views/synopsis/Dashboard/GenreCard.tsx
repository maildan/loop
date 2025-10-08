'use client';

import React from 'react';
import { Badge } from '../../../../ui/Badge';
import { Card } from '../../../../ui/Card';
import { ProgressBar } from '../../../../ui/ProgressBar';
import { BookOpen } from 'lucide-react';

interface GenreCardProps {
  genre: string; // 'romance-fantasy', 'hunter', 'fantasy', etc.
  genreConsistency: number; // 0-100
}

const GENRE_NAMES: Record<string, string> = {
  'romance-fantasy': '로맨스 판타지',
  'romance': '로맨스',
  'bl': 'BL',
  'modern-fantasy': '현대 판타지',
  'hunter': '헌터물',
  'fantasy': '판타지',
  'martial-arts': '무협',
  'historical': '사극',
  'unknown': '미분류',
};

const GENRE_COLORS: Record<string, string> = {
  'romance-fantasy': 'bg-pink-500/20 text-pink-700 border-pink-500/30',
  'romance': 'bg-rose-500/20 text-rose-700 border-rose-500/30',
  'bl': 'bg-purple-500/20 text-purple-700 border-purple-500/30',
  'modern-fantasy': 'bg-blue-500/20 text-blue-700 border-blue-500/30',
  'hunter': 'bg-red-500/20 text-red-700 border-red-500/30',
  'fantasy': 'bg-indigo-500/20 text-indigo-700 border-indigo-500/30',
  'martial-arts': 'bg-orange-500/20 text-orange-700 border-orange-500/30',
  'historical': 'bg-yellow-500/20 text-yellow-700 border-yellow-500/30',
  'unknown': 'bg-gray-500/20 text-gray-700 border-gray-500/30',
};

export const GenreCard: React.FC<GenreCardProps> = ({ genre, genreConsistency }) => {
  const genreName = GENRE_NAMES[genre] || '알 수 없음';
  const genreColor = GENRE_COLORS[genre] || GENRE_COLORS['unknown'];

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[hsl(var(--accent-primary))]" />
          장르 감지
        </h3>
        <Badge className={`${genreColor} text-sm font-medium px-3 py-1`}>
          {genreName}
        </Badge>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">장르 일관성</span>
          <span className="font-semibold text-foreground">{genreConsistency}%</span>
        </div>
        <ProgressBar
          value={genreConsistency}
          className="h-2"
          color={genreConsistency >= 70 ? 'green' : genreConsistency >= 40 ? 'orange' : 'red'}
        />
        {genreConsistency < 70 && (
          <p className="text-xs text-muted-foreground mt-2">
            💡 장르 특화 키워드를 더 추가하면 일관성이 높아집니다.
          </p>
        )}
      </div>
    </Card>
  );
};
