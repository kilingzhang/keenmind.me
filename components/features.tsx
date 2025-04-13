const features = [
  {
    icon: '🔍',
    title: '智能问答流',
    description: '通过AI驱动的连续问答系统，帮助开发者主动思考、输出，培养结构化知识体系。',
    gradient: 'from-indigo-50/80 via-purple-50/80 to-indigo-50/80'
  },
  {
    icon: '📋',
    title: '结构化反馈',
    description: '多维度分析用户回答，提供清晰的结构分析、改进建议和标准答案。',
    gradient: 'from-purple-50/80 via-pink-50/80 to-purple-50/80'
  },
  {
    icon: '💬',
    title: '主动追问机制',
    description: '支持用户随时追问，形成探索性学习对话，深入理解知识点。',
    gradient: 'from-pink-50/80 via-rose-50/80 to-pink-50/80'
  },
  {
    icon: '📊',
    title: '能力图谱跟踪',
    description: '实时构建个人知识图谱，追踪能力成长，精准定位学习盲区。',
    gradient: 'from-rose-50/80 via-orange-50/80 to-rose-50/80'
  },
  {
    icon: '🎮',
    title: '专项训练挑战',
    description: '针对薄弱点提供专项挑战，通过游戏化机制激发学习动力。',
    gradient: 'from-orange-50/80 via-amber-50/80 to-orange-50/80'
  },
  {
    icon: '🎤',
    title: '语音交互表达',
    description: '支持语音回答问题，锻炼表达能力，更接近实际面试场景。',
    gradient: 'from-amber-50/80 via-yellow-50/80 to-amber-50/80'
  }
];

export default function Features() {
  return (
    <section id="features" className="relative py-32 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-20 relative">
          <span className="inline-block text-2xl mb-4">✨</span>
          <h2 className="text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 mb-6 tracking-tight animate-gradient">
            核心功能
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            探索犀知如何重新定义开发者学习体验
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