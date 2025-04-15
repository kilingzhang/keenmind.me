'use client';

import React from 'react';

interface AuroraBackgroundProps {
  className?: string;
  withStaticGradient?: boolean;
  withTopGradient?: boolean;
  withBottomGradient?: boolean;
  withLine?: boolean;
}

export function AuroraBackground({
  className,
  withStaticGradient = false,
  withTopGradient = false,
  withBottomGradient = false,
  withLine = false
}: AuroraBackgroundProps) {
  return (
    <>
      {/* 极光背景效果 - 使用相对于父元素的绝对定位 */}
      {/* 父元素应具有 position: relative/absolute/fixed */}
      {/* 依赖父元素的堆叠上下文（如 z-0） */}
      <div className={`absolute inset-0 overflow-hidden ${className || ''}`}>
        {/* 可选的静态渐变背景 */}
        {withStaticGradient && (
          <div className="absolute inset-0 bg-gradient-to-br from-pink-50 via-pink-50 to-cyan-50" />
        )}

        {/* 可选的顶部渐变装饰 */}
        {withTopGradient && (
          <div className="absolute top-0 inset-x-0 h-1/4 bg-gradient-to-b from-cyan-50 to-transparent opacity-70" />
        )}

        {/* 可选的底部渐变装饰 */}
        {withBottomGradient && (
          <div className="absolute bottom-0 inset-x-0 h-1/3 bg-gradient-to-t from-pink-50 to-transparent opacity-70" />
        )}

        {/* 流动的颜色渐变背景 - 极光效果 */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          {/* 色块 1: 青色 - 更大，更模糊 */}
          <div className="absolute w-[900px] h-[900px] rounded-full bg-radial-gradient-cyan blur-[150px] animate-aurora-1" style={{ top: '-25%', left: '-35%' }}></div>
          {/* 色块 2: 粉色 - 更大，更模糊 */}
          <div className="absolute w-[800px] h-[800px] rounded-full bg-radial-gradient-pink blur-[160px] animate-aurora-2" style={{ bottom: '-30%', right: '-40%' }}></div>
          {/* 色块 3: 绿色 - 更大，更模糊 */}
          <div className="absolute w-[700px] h-[700px] rounded-full bg-radial-gradient-lime blur-[140px] animate-aurora-3" style={{ top: '5%', right: '-25%' }}></div>
          {/* 色块 4: 紫色 - 更大，更模糊 */}
          <div className="absolute w-[600px] h-[600px] rounded-full bg-radial-gradient-purple blur-[130px] animate-aurora-4" style={{ bottom: '0%', left: '-5%' }}></div>
        </div>

        {/* 可选的装饰线条 */}
        {withLine && (
          <div className="absolute bottom-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-pink-200/20 to-transparent"></div>
        )}
      </div>

      {/* 动画和样式定义 */}
      <style jsx global>{`
        /* 极光动画 1 - 更大范围移动，更慢更平滑 */
        @keyframes aurora-1 {
            0%, 100% { transform: translate(0, 0); opacity: 0.08; }
            50% { transform: translate(350px, 250px); opacity: 0.5; } /* 加大移动范围，增强透明度对比 */
        }
        
        /* 极光动画 2 - 更大范围移动，更慢更平滑 */
        @keyframes aurora-2 {
            0%, 100% { transform: translate(0, 0); opacity: 0.08; }
            50% { transform: translate(-300px, -200px); opacity: 0.45; } /* 加大移动范围，增强透明度对比 */
        }
        
        /* 极光动画 3 - 更大范围移动，更慢更平滑 */
        @keyframes aurora-3 {
            0%, 100% { transform: translate(0, 0); opacity: 0.04; }
            50% { transform: translate(250px, -350px); opacity: 0.5; } /* 加大移动范围，增强透明度对比 */
        }
        
        /* 极光动画 4 - 更大范围移动，更慢更平滑 */
        @keyframes aurora-4 {
            0%, 100% { transform: translate(0, 0); opacity: 0.06; }
            50% { transform: translate(-200px, 300px); opacity: 0.45; } /* 加大移动范围，增强透明度对比 */
        }
        
        .animate-aurora-1 {
            animation: aurora-1 12s ease-in-out infinite; /* 减慢速度使动画更平滑 */
        }
        .animate-aurora-2 {
            animation: aurora-2 15s ease-in-out infinite; /* 减慢速度使动画更平滑 */
            animation-delay: 2s;
        }
        .animate-aurora-3 {
            animation: aurora-3 18s ease-in-out infinite; /* 减慢速度使动画更平滑 */
            animation-delay: 1s;
        }
        .animate-aurora-4 {
            animation: aurora-4 20s ease-in-out infinite; /* 减慢速度使动画更平滑 */
            animation-delay: 3s;
        }
        
        /* 为色块定义径向渐变背景 - 增加透明度和扩散范围 */
        .bg-radial-gradient-cyan {
            background-image: radial-gradient(circle, rgba(0, 180, 216, 0.5) 0%, transparent 75%);
        }
        .bg-radial-gradient-pink {
            background-image: radial-gradient(circle, rgba(232, 121, 249, 0.4) 0%, transparent 75%);
        }
        .bg-radial-gradient-lime {
            background-image: radial-gradient(circle, rgba(163, 230, 53, 0.45) 0%, transparent 75%);
        }
        .bg-radial-gradient-purple {
            background-image: radial-gradient(circle, rgba(168, 85, 247, 0.35) 0%, transparent 75%);
        }
        
        /* Added from login page: 登录容器悬浮效果 - 调整回更微妙 */
        @keyframes subtle-float {
            0%, 100% { transform: translateY(0); box-shadow: 0 8px 20px -12px rgba(31, 41, 55, 0.1); }
            50% { transform: translateY(-3px); box-shadow: 0 15px 30px -15px rgba(31, 41, 55, 0.15); }
        }
        
        .animate-subtle-float {
            animation: subtle-float 6s ease-in-out infinite;
            transition: all 0.3s ease;
        }
        
        .animate-subtle-float:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 35px -15px rgba(31, 41, 55, 0.2);
        }
        
        /* Added from login page: fade-in animation */
        .animate-fade-in {
            animation: fade-in 0.6s ease-out forwards;
        }
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
} 