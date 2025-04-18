INSERT INTO domains (slug, name_zh, name_en, description_zh, description_en, icon, extra)
VALUES
  ('backend', '后端开发', 'Backend Development', '后端开发涉及服务器端编程、微服务、数据库等，是互联网系统的核心支撑。', 'Backend development covers server-side programming, microservices, databases, and is the backbone of internet systems.', NULL, '{}'),
  ('frontend', '前端开发', 'Frontend Development', '前端开发关注用户界面与交互体验，涵盖Web、H5、小程序等。', 'Frontend development focuses on UI and user experience, including Web, H5, and mini-programs.', NULL, '{}'),
  ('mobile', '移动开发', 'Mobile Development', '移动开发包括Android、iOS及跨平台应用开发。', 'Mobile development includes Android, iOS, and cross-platform app development.', NULL, '{}'),
  ('qa', '测试与质量', 'QA & Testing', '测试与质量保障涵盖自动化测试、性能测试、安全测试等。', 'QA & Testing covers automation, performance, and security testing.', NULL, '{}'),
  ('devops', '运维与SRE', 'DevOps & SRE', '运维与SRE关注系统部署、监控、自动化运维和高可用保障。', 'DevOps & SRE focuses on deployment, monitoring, automation, and high availability.', NULL, '{}'),
  ('bigdata', '大数据', 'Big Data', '大数据领域涉及数据采集、存储、分析与治理。', 'Big Data covers data collection, storage, analysis, and governance.', NULL, '{}'),
  ('ai', '人工智能', 'AI & Machine Learning', '人工智能包括机器学习、深度学习、NLP、CV等方向。', 'AI includes machine learning, deep learning, NLP, CV, etc.', NULL, '{}'),
  ('architecture', '架构', 'Architecture', '架构设计关注系统整体结构、可扩展性与高可用。', 'Architecture focuses on system structure, scalability, and high availability.', NULL, '{}'),
  ('security', '安全', 'Security', '安全领域涵盖应用安全、数据安全、攻防与合规。', 'Security covers application security, data security, offensive & defensive, and compliance.', NULL, '{}'),
  ('product', '产品', 'Product', '产品管理涉及需求分析、产品设计与生命周期管理。', 'Product management covers requirement analysis, product design, and lifecycle management.', NULL, '{}'),
  ('project', '项目管理', 'Project Management', '项目管理关注团队协作、进度控制与交付质量。', 'Project management focuses on teamwork, schedule control, and delivery quality.', NULL, '{}'),
  ('operation', '运营', 'Operation', '运营包括用户、内容、数据等多维度的增长与维护。', 'Operation includes user, content, and data growth and maintenance.', NULL, '{}'),
  ('data', '数据分析', 'Data Analysis', '数据分析关注数据挖掘、可视化与商业洞察。', 'Data analysis focuses on mining, visualization, and business insights.', NULL, '{}'),
  ('cs', '计算机基础', 'CS Fundamentals', '计算机基础涵盖操作系统、网络、算法与数据结构等。', 'CS Fundamentals covers OS, networking, algorithms, and data structures.', NULL, '{}'),
  ('growth', '成长与通用', 'Growth & General', '成长与通用能力包括职业发展、软技能与团队协作。', 'Growth & General covers career development, soft skills, and teamwork.', NULL, '{}')
ON CONFLICT (slug) DO NOTHING;