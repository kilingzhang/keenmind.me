'use client';

const features = [
  {
    icon: '🧠',
    title: '智能记录',
    description: '支持文本、语音、图像等多种格式，自动分类整理您的生活记忆。',
    gradient: 'from-indigo-50/80 via-purple-50/80 to-indigo-50/80'
  },
  {
    icon: '⏰',
    title: '智能提醒',
    description: '贴心的日程管理，重要事项不错过，让生活更有条理。',
    gradient: 'from-purple-50/80 via-pink-50/80 to-purple-50/80'
  },
  {
    icon: '📊',
    title: '数据分析',
    description: '深度分析您的习惯和生活方式，提供个性化建议。',
    gradient: 'from-pink-50/80 via-rose-50/80 to-pink-50/80'
  },
  {
    icon: '🔒',
    title: '安全可靠',
    description: '采用先进加密技术，保护您的隐私数据安全。',
    gradient: 'from-rose-50/80 via-orange-50/80 to-rose-50/80'
  },
  {
    icon: '🤖',
    title: '智能助手',
    description: '智能对话，帮您处理日常任务，提供贴心服务。',
    gradient: 'from-orange-50/80 via-amber-50/80 to-orange-50/80'
  },
  {
    icon: '🔍',
    title: '智能检索',
    description: '强大的搜索功能，快速找到需要的信息。',
    gradient: 'from-amber-50/80 via-yellow-50/80 to-amber-50/80'
  }
];

export default function Features() {
  return (
    <section className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20 relative">
          <span className="inline-block text-2xl mb-4">✨</span>
          <h2 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 mb-6 tracking-tight animate-gradient">
            核心功能
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            探索思侣为您带来的智能化体验
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-100 shadow-sm hover:shadow-xl hover:border-slate-200 transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-purple-50/50 to-pink-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 mb-6 transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <span className="text-2xl">{feature.icon}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-800">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}