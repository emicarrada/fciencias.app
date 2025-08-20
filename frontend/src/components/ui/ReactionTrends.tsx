'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ReactionType } from '@/components/ui/ReactionButton';
import ReactionStats from '@/components/ui/ReactionStats';

interface TrendingReaction {
  type: ReactionType;
  count: number;
  growth: number; // porcentaje de crecimiento
  trend: 'up' | 'down' | 'stable';
}

interface ReactionTrendsProps {
  reactions: Record<ReactionType, { count: number; isActive: boolean }>;
  className?: string;
}

// Simular datos de tendencias
const generateTrendData = (reactions: Record<ReactionType, { count: number; isActive: boolean }>): TrendingReaction[] => {
  return Object.entries(reactions).map(([type, data]) => {
    const randomTrend = Math.random();
    const trend: 'up' | 'down' | 'stable' = randomTrend > 0.7 ? 'up' : randomTrend > 0.3 ? 'stable' : 'down';
    
    return {
      type: type as ReactionType,
      count: data.count,
      growth: Math.random() * 20 - 10, // -10% a +10%
      trend
    };
  }).sort((a, b) => b.count - a.count);
};

export default function ReactionTrends({ reactions, className = '' }: ReactionTrendsProps) {
  const [trends, setTrends] = useState<TrendingReaction[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTrends(generateTrendData(reactions));
    setIsVisible(true);
  }, [reactions]);

  const topTrends = trends.slice(0, 5);

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return '📈';
      case 'down':
        return '📉';
      default:
        return '➡️';
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return 'text-green-600';
      case 'down':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.5 }}
      className={`bg-white rounded-xl shadow-lg p-6 ${className}`}
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">📊</span>
        <h3 className="text-lg font-semibold text-gray-800">
          Tendencias de Reacciones
        </h3>
      </div>

      <div className="space-y-4">
        {/* Estadísticas principales */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
          <ReactionStats 
            reactions={reactions} 
            showPercentages={true}
            compact={false}
          />
        </div>

        {/* Tendencias en tiempo real */}
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-3 flex items-center gap-2">
            <span className="animate-pulse">🔥</span>
            Tendencias en Tiempo Real
          </h4>
          
          <AnimatePresence>
            {topTrends.map((trend, index) => (
              <motion.div
                key={trend.type}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getTrendIcon(trend.trend)}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-800 capitalize">
                      {trend.type.replace('-', ' ')}
                    </div>
                    <div className="text-xs text-gray-500">
                      {trend.count} reacciones
                    </div>
                  </div>
                </div>
                
                <div className={`text-sm font-medium ${getTrendColor(trend.trend)}`}>
                  {trend.growth > 0 ? '+' : ''}{trend.growth.toFixed(1)}%
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Métricas rápidas */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-blue-50 rounded-lg p-3 text-center"
          >
            <div className="text-2xl font-bold text-blue-600">
              {Object.values(reactions).reduce((sum, r) => sum + r.count, 0)}
            </div>
            <div className="text-xs text-blue-600 font-medium">
              Total
            </div>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-green-50 rounded-lg p-3 text-center"
          >
            <div className="text-2xl font-bold text-green-600">
              {Object.values(reactions).filter(r => r.count > 0).length}
            </div>
            <div className="text-xs text-green-600 font-medium">
              Tipos Activos
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
