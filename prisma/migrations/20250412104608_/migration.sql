-- 启用 citext 扩展支持邮箱地址的精确匹配
CREATE EXTENSION IF NOT EXISTS citext;
-- 启用 pgcrypto 扩展支持随机数生成
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 创建生成 12 位随机数字 ID 的函数
CREATE OR REPLACE FUNCTION generate_numeric_id(length INTEGER DEFAULT 12) RETURNS BIGINT AS $$
DECLARE
    result BIGINT;
    min_value BIGINT;
    max_value BIGINT;
BEGIN
    min_value := power(10, length - 1)::BIGINT;
    max_value := (power(10, length) - 1)::BIGINT;
    SELECT floor(random() * (max_value - min_value + 1) + min_value)::BIGINT INTO result;
    RETURN result;
END;
$$ LANGUAGE plpgsql VOLATILE;

-- 创建枚举类型
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'LOCKED', 'BANNED');
CREATE TYPE "CredentialType" AS ENUM ('PASSWORD', 'PHONE', 'EMAIL', 'CHANNEL_CODE');
CREATE TYPE "TokenType" AS ENUM ('EMAIL_VERIFICATION', 'PHONE_VERIFICATION', 'PASSWORD_RESET');

-- 用户主表
CREATE TABLE users (
    id              BIGINT PRIMARY KEY DEFAULT generate_numeric_id(12),  -- 用户唯一标识，12 位随机数字 ID
    username        VARCHAR(50),                   -- 用户名，用于登录和显示，全局唯一
    nickname        VARCHAR(50),                   -- 昵称，可自定义修改
    email           VARCHAR(100),                  -- 邮箱地址（可选）
    phone           VARCHAR(20),                   -- 手机号（可选）
    email_verified  TIMESTAMPTZ,                   -- 邮箱验证时间
    phone_verified  TIMESTAMPTZ,                   -- 手机验证时间
    avatar          TEXT,                          -- 头像 URL
    bio             TEXT,                          -- 个人简介
    status          "UserStatus" NOT NULL DEFAULT 'ACTIVE', -- 用户状态
    created_ip      VARCHAR(50),                   -- 创建IP
    updated_ip      VARCHAR(50),                   -- 更新IP
    last_login_at   TIMESTAMPTZ,                   -- 最近一次登录时间
    extra           JSONB DEFAULT '{}'::jsonb,     -- 扩展字段，JSON 格式存储其他业务字段
    deleted_at      TIMESTAMPTZ,                   -- 软删除时间，NULL 表示未删除
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(), -- 创建时间
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()  -- 更新时间
);

-- 添加字段注释
COMMENT ON TABLE users IS '用户表，存储用户基础信息，支持软删除与时间戳追踪';

COMMENT ON COLUMN users.id IS '用户唯一标识，12 位随机数字 ID';
COMMENT ON COLUMN users.username IS '用户名，用于登录和显示，全局唯一';
COMMENT ON COLUMN users.nickname IS '用户昵称';
COMMENT ON COLUMN users.email IS '用户邮箱地址';
COMMENT ON COLUMN users.phone IS '用户手机号';
COMMENT ON COLUMN users.avatar IS '用户头像链接 URL';
COMMENT ON COLUMN users.bio IS '用户个人简介';
COMMENT ON COLUMN users.status IS '用户状态';
COMMENT ON COLUMN users.last_login_at IS '最近一次登录时间';
COMMENT ON COLUMN users.extra IS '扩展字段，存储其他 JSON 格式结构化信息';
COMMENT ON COLUMN users.deleted_at IS '软删除时间戳，NULL 表示未删除';
COMMENT ON COLUMN users.created_at IS '记录创建时间，默认当前时间';
COMMENT ON COLUMN users.updated_at IS '记录最后更新时间，由触发器维护';

-- 索引与约束
CREATE INDEX idx_users_username ON users (username);
CREATE UNIQUE INDEX users_id_unique ON users (id);
CREATE INDEX idx_users_active ON users (id) WHERE deleted_at IS NULL;

-- 创建认证凭据表
CREATE TABLE credentials (
    id              BIGINT PRIMARY KEY DEFAULT generate_numeric_id(12),
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type            "CredentialType" NOT NULL,
    value           TEXT NOT NULL,
    salt            TEXT,
    encryption_type TEXT,
    expires_at      TIMESTAMPTZ,
    failed_attempts INTEGER NOT NULL DEFAULT 0,
    last_failed_at  TIMESTAMPTZ,
    locked_until    TIMESTAMPTZ,
    version         INTEGER NOT NULL DEFAULT 1,
    created_ip      VARCHAR(50),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 添加credentials表相关注释
COMMENT ON TABLE credentials IS '用户认证凭据表，存储不同类型的认证信息，如密码、手机验证等';
COMMENT ON COLUMN credentials.id IS '凭据唯一标识，使用generate_numeric_id(12)生成12位随机数字ID';
COMMENT ON COLUMN credentials.user_id IS '所属用户ID，外键关联users表的12位随机数字ID';
COMMENT ON COLUMN credentials.type IS '凭据类型：PASSWORD（密码）、PHONE（手机）、EMAIL（邮箱）、CHANNEL_CODE（渠道码）';
COMMENT ON COLUMN credentials.value IS '凭据值，如密码哈希、手机号码等';
COMMENT ON COLUMN credentials.salt IS '加密盐值，用于密码哈希';
COMMENT ON COLUMN credentials.encryption_type IS '加密类型，指定使用的加密算法';
COMMENT ON COLUMN credentials.expires_at IS '凭据过期时间';
COMMENT ON COLUMN credentials.failed_attempts IS '认证失败尝试次数，用于账户锁定策略';
COMMENT ON COLUMN credentials.last_failed_at IS '最后一次认证失败时间';
COMMENT ON COLUMN credentials.locked_until IS '账户锁定截止时间';
COMMENT ON COLUMN credentials.version IS '凭据版本号，用于追踪凭据更新';
COMMENT ON COLUMN credentials.created_ip IS '创建凭据时的IP地址';
COMMENT ON COLUMN credentials.created_at IS '凭据创建时间';
COMMENT ON COLUMN credentials.updated_at IS '凭据最后更新时间';

-- 创建第三方认证账户表
CREATE TABLE auth_accounts (
    id                  BIGINT PRIMARY KEY DEFAULT generate_numeric_id(12),
    user_id             BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type                TEXT NOT NULL,
    provider            TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    refresh_token       TEXT,
    access_token        TEXT,
    expires_at          INTEGER,
    token_type          TEXT,
    scope               TEXT,
    id_token            TEXT,
    session_state       TEXT,
    encryption_type     TEXT,
    version             INTEGER NOT NULL DEFAULT 1,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 添加auth_accounts表相关注释
COMMENT ON TABLE auth_accounts IS '第三方认证账户表，存储用户的第三方登录信息，如微信、GitHub等';
COMMENT ON COLUMN auth_accounts.id IS '第三方账户唯一标识，使用generate_numeric_id(12)生成12位随机数字ID';
COMMENT ON COLUMN auth_accounts.user_id IS '关联用户ID，外键关联users表的12位随机数字ID';
COMMENT ON COLUMN auth_accounts.type IS '账户类型，如OAuth、SAML等';
COMMENT ON COLUMN auth_accounts.provider IS '服务提供商，如微信、GitHub、Google等';
COMMENT ON COLUMN auth_accounts.provider_account_id IS '提供商账户ID，第三方平台上的唯一标识';
COMMENT ON COLUMN auth_accounts.refresh_token IS '刷新令牌，用于获取新的访问令牌';
COMMENT ON COLUMN auth_accounts.access_token IS '访问令牌，用于访问第三方API';
COMMENT ON COLUMN auth_accounts.expires_at IS '令牌过期时间戳';
COMMENT ON COLUMN auth_accounts.token_type IS '令牌类型，如Bearer等';
COMMENT ON COLUMN auth_accounts.scope IS '授权范围，标识允许访问的资源';
COMMENT ON COLUMN auth_accounts.id_token IS 'ID令牌，包含用户身份信息';
COMMENT ON COLUMN auth_accounts.session_state IS '会话状态，用于维护会话一致性';
COMMENT ON COLUMN auth_accounts.encryption_type IS '令牌加密类型';
COMMENT ON COLUMN auth_accounts.version IS '账户版本号，用于追踪更新';
COMMENT ON COLUMN auth_accounts.created_at IS '账户创建时间';
COMMENT ON COLUMN auth_accounts.updated_at IS '账户最后更新时间';

-- 创建会话表
CREATE TABLE auth_sessions (
    id              BIGINT PRIMARY KEY DEFAULT generate_numeric_id(12),
    session_token   TEXT NOT NULL,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires         TIMESTAMPTZ NOT NULL,
    user_agent      TEXT,
    ip_address      VARCHAR(50),
    device_id       VARCHAR(100),
    is_mobile       BOOLEAN,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 添加auth_sessions表相关注释
COMMENT ON TABLE auth_sessions IS '用户会话表，存储用户登录会话信息';
COMMENT ON COLUMN auth_sessions.id IS '会话唯一标识，使用generate_numeric_id(12)生成12位随机数字ID';
COMMENT ON COLUMN auth_sessions.session_token IS '会话令牌，用于验证用户身份';
COMMENT ON COLUMN auth_sessions.user_id IS '会话所属用户ID，外键关联users表的12位随机数字ID';
COMMENT ON COLUMN auth_sessions.expires IS '会话过期时间';
COMMENT ON COLUMN auth_sessions.user_agent IS '用户代理信息，记录客户端设备和浏览器信息';
COMMENT ON COLUMN auth_sessions.ip_address IS '会话创建时的IP地址';
COMMENT ON COLUMN auth_sessions.device_id IS '设备唯一标识，用于追踪用户设备';
COMMENT ON COLUMN auth_sessions.is_mobile IS '是否为移动设备，TRUE表示移动设备，FALSE表示桌面设备';
COMMENT ON COLUMN auth_sessions.created_at IS '会话创建时间';

-- 创建验证令牌表
CREATE TABLE auth_verification_tokens (
    identifier      TEXT NOT NULL,
    token           TEXT NOT NULL,
    expires         TIMESTAMPTZ NOT NULL,
    type            "TokenType" NOT NULL,
    used            BOOLEAN NOT NULL DEFAULT false,
    used_at         TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_ip      VARCHAR(50)
);

-- 添加auth_verification_tokens表相关注释
COMMENT ON TABLE auth_verification_tokens IS '验证令牌表，用于邮箱验证、手机验证、密码重置等场景';
COMMENT ON COLUMN auth_verification_tokens.identifier IS '验证对象标识，如邮箱地址或手机号码';
COMMENT ON COLUMN auth_verification_tokens.token IS '验证令牌，用于确认用户身份';
COMMENT ON COLUMN auth_verification_tokens.expires IS '令牌过期时间';
COMMENT ON COLUMN auth_verification_tokens.type IS '令牌类型：EMAIL_VERIFICATION（邮箱验证）、PHONE_VERIFICATION（手机验证）、PASSWORD_RESET（密码重置）';
COMMENT ON COLUMN auth_verification_tokens.used IS '令牌是否已使用，TRUE表示已使用，FALSE表示未使用';
COMMENT ON COLUMN auth_verification_tokens.used_at IS '令牌使用时间';
COMMENT ON COLUMN auth_verification_tokens.created_at IS '令牌创建时间';
COMMENT ON COLUMN auth_verification_tokens.created_ip IS '创建令牌时的IP地址';

-- 创建索引
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_deleted_at ON users(deleted_at);
CREATE UNIQUE INDEX users_email_deleted_at_key ON users(email, deleted_at) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX users_phone_deleted_at_key ON users(phone, deleted_at) WHERE phone IS NOT NULL;
CREATE INDEX idx_credentials_type ON credentials(type);
CREATE UNIQUE INDEX credentials_user_id_type_key ON credentials(user_id, type);
CREATE INDEX idx_auth_accounts_provider ON auth_accounts(provider);
CREATE INDEX idx_auth_accounts_user_id ON auth_accounts(user_id);
CREATE UNIQUE INDEX auth_accounts_provider_provider_account_id_key ON auth_accounts(provider, provider_account_id);
CREATE UNIQUE INDEX auth_sessions_session_token_key ON auth_sessions(session_token);
CREATE INDEX idx_auth_sessions_expires ON auth_sessions(expires);
CREATE INDEX idx_auth_sessions_user_id ON auth_sessions(user_id);
CREATE UNIQUE INDEX auth_verification_tokens_token_key ON auth_verification_tokens(token);
CREATE INDEX idx_auth_verification_tokens_expires ON auth_verification_tokens(expires);
CREATE UNIQUE INDEX auth_verification_tokens_identifier_token_key ON auth_verification_tokens(identifier, token);

-- 自动更新时间戳的触发器
CREATE OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为所有表添加更新时间触发器
CREATE TRIGGER trg_update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_update_credentials_updated_at
    BEFORE UPDATE ON credentials
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_update_auth_accounts_updated_at
    BEFORE UPDATE ON auth_accounts
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

-- 1. 领域表
CREATE TABLE domains (
  id BIGSERIAL PRIMARY KEY, -- 自增主键
  slug CITEXT UNIQUE NOT NULL, -- 语义唯一标识
  name_zh TEXT NOT NULL, -- 中文名称
  name_en TEXT NOT NULL, -- 英文名称
  description_zh TEXT, -- 中文描述
  description_en TEXT, -- 英文描述
  icon TEXT, -- 图标
  sort_order INT DEFAULT 0, -- 排序权重
  extra JSONB DEFAULT '{}'::jsonb, -- 扩展字段
  deleted_at TIMESTAMPTZ, -- 软删除
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE domains IS '领域表，存储技术大方向/职业路径';
COMMENT ON COLUMN domains.slug IS '领域唯一语义标识';
COMMENT ON COLUMN domains.name_zh IS '领域中文名称';
COMMENT ON COLUMN domains.name_en IS '领域英文名称';
COMMENT ON COLUMN domains.description_zh IS '领域中文描述';
COMMENT ON COLUMN domains.description_en IS '领域英文描述';
COMMENT ON COLUMN domains.icon IS '领域图标';
COMMENT ON COLUMN domains.sort_order IS '排序权重';
COMMENT ON COLUMN domains.extra IS '扩展字段';
COMMENT ON COLUMN domains.deleted_at IS '软删除时间戳';
COMMENT ON COLUMN domains.created_at IS '创建时间';
COMMENT ON COLUMN domains.updated_at IS '更新时间';
CREATE UNIQUE INDEX idx_domains_slug ON domains(slug);
CREATE INDEX idx_domains_active ON domains(id) WHERE deleted_at IS NULL;

-- 2. 主题表
CREATE TABLE topics (
  id BIGSERIAL PRIMARY KEY, -- 自增主键
  domain_id BIGINT NOT NULL REFERENCES domains(id),
  slug CITEXT UNIQUE NOT NULL,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  description_zh TEXT,
  description_en TEXT,
  sort_order INT DEFAULT 0,
  extra JSONB DEFAULT '{}'::jsonb,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE topics IS '主题表，存储具体技术栈/知识模块';
COMMENT ON COLUMN topics.domain_id IS '所属领域ID';
COMMENT ON COLUMN topics.slug IS '主题唯一语义标识';
COMMENT ON COLUMN topics.name_zh IS '主题中文名称';
COMMENT ON COLUMN topics.name_en IS '主题英文名称';
COMMENT ON COLUMN topics.description_zh IS '主题中文描述';
COMMENT ON COLUMN topics.description_en IS '主题英文描述';
COMMENT ON COLUMN topics.sort_order IS '排序权重';
COMMENT ON COLUMN topics.extra IS '扩展字段';
COMMENT ON COLUMN topics.deleted_at IS '软删除时间戳';
COMMENT ON COLUMN topics.created_at IS '创建时间';
COMMENT ON COLUMN topics.updated_at IS '更新时间';
CREATE UNIQUE INDEX idx_topics_slug ON topics(slug);
CREATE INDEX idx_topics_domain_id ON topics(domain_id);
CREATE INDEX idx_topics_active ON topics(id) WHERE deleted_at IS NULL;

-- 3. 标签表
CREATE TABLE tags (
  id BIGSERIAL PRIMARY KEY, -- 自增主键
  slug CITEXT UNIQUE NOT NULL,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  type VARCHAR(32), -- 能力/技术/属性/场景等
  parent_id BIGINT REFERENCES tags(id),
  description_zh TEXT,
  description_en TEXT,
  extra JSONB DEFAULT '{}'::jsonb,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  search_text_tsv TSVECTOR
);
COMMENT ON TABLE tags IS '标签表，支持多语言、类型、层级';
COMMENT ON COLUMN tags.slug IS '标签唯一语义标识';
COMMENT ON COLUMN tags.name_zh IS '标签中文名称';
COMMENT ON COLUMN tags.name_en IS '标签英文名称';
COMMENT ON COLUMN tags.type IS '标签类型';
COMMENT ON COLUMN tags.parent_id IS '父标签ID';
COMMENT ON COLUMN tags.description_zh IS '标签中文描述';
COMMENT ON COLUMN tags.description_en IS '标签英文描述';
COMMENT ON COLUMN tags.extra IS '扩展字段';
COMMENT ON COLUMN tags.deleted_at IS '软删除时间戳';
COMMENT ON COLUMN tags.created_at IS '创建时间';
COMMENT ON COLUMN tags.updated_at IS '更新时间';
COMMENT ON COLUMN tags.search_text_tsv IS '全文搜索字段';
CREATE UNIQUE INDEX idx_tags_slug ON tags(slug);
CREATE INDEX idx_tags_type ON tags(type);
CREATE INDEX idx_tags_parent_id ON tags(parent_id);
CREATE INDEX idx_tags_active ON tags(id) WHERE deleted_at IS NULL;
CREATE INDEX idx_tags_search ON tags USING GIN (search_text_tsv);

-- 4. 知识点表
CREATE TABLE knowledge_points (
  id BIGSERIAL PRIMARY KEY, -- 自增主键
  slug CITEXT UNIQUE NOT NULL,
  name_zh TEXT NOT NULL,
  name_en TEXT NOT NULL,
  definition_zh TEXT,
  definition_en TEXT,
  topic_id BIGINT REFERENCES topics(id),
  aliases JSONB NOT NULL DEFAULT '{}'::jsonb,
  extra JSONB DEFAULT '{}'::jsonb,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  search_text_tsv TSVECTOR
);
COMMENT ON TABLE knowledge_points IS '知识点表，支持多语言、标签、软删除';
COMMENT ON COLUMN knowledge_points.slug IS '知识点唯一语义标识';
COMMENT ON COLUMN knowledge_points.name_zh IS '知识点中文名称';
COMMENT ON COLUMN knowledge_points.name_en IS '知识点英文名称';
COMMENT ON COLUMN knowledge_points.definition_zh IS '知识点中文定义';
COMMENT ON COLUMN knowledge_points.definition_en IS '知识点英文定义';
COMMENT ON COLUMN knowledge_points.topic_id IS '主归属主题ID';
COMMENT ON COLUMN knowledge_points.aliases IS '多语言别名';
COMMENT ON COLUMN knowledge_points.extra IS '扩展字段';
COMMENT ON COLUMN knowledge_points.deleted_at IS '软删除时间戳';
COMMENT ON COLUMN knowledge_points.created_at IS '创建时间';
COMMENT ON COLUMN knowledge_points.updated_at IS '更新时间';
COMMENT ON COLUMN knowledge_points.search_text_tsv IS '全文搜索字段';
CREATE UNIQUE INDEX idx_knowledge_points_slug ON knowledge_points(slug);
CREATE INDEX idx_knowledge_points_topic_id ON knowledge_points(topic_id);
CREATE INDEX idx_knowledge_points_active ON knowledge_points(id) WHERE deleted_at IS NULL;
CREATE INDEX idx_knowledge_points_search ON knowledge_points USING GIN (search_text_tsv);

-- 知识点-标签多对多
CREATE TABLE knowledge_point_tags (
  knowledge_point_id BIGINT NOT NULL REFERENCES knowledge_points(id) ON DELETE CASCADE,
  tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (knowledge_point_id, tag_id)
);

-- 5. 题目表
CREATE TABLE questions (
  id BIGINT PRIMARY KEY DEFAULT generate_numeric_id(15),
  type VARCHAR(20) NOT NULL DEFAULT 'open-ended', -- 题型
  language VARCHAR(20), -- 编程语言
  difficulty VARCHAR(10) NOT NULL DEFAULT 'medium',
  source VARCHAR(50) DEFAULT 'official',
  primary_knowledge_point_id BIGINT NOT NULL REFERENCES knowledge_points(id),
  title_zh TEXT NOT NULL,
  title_en TEXT NOT NULL,
  description_zh TEXT,
  description_en TEXT,
  extra JSONB DEFAULT '{}'::jsonb,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  search_text_tsv TSVECTOR
);
COMMENT ON TABLE questions IS '题目表，支持多语言、标签、软删除';
COMMENT ON COLUMN questions.type IS '题目类型';
COMMENT ON COLUMN questions.language IS '编程语言';
COMMENT ON COLUMN questions.difficulty IS '难度等级';
COMMENT ON COLUMN questions.source IS '题目来源';
COMMENT ON COLUMN questions.primary_knowledge_point_id IS '主知识点ID';
COMMENT ON COLUMN questions.title_zh IS '题目中文标题';
COMMENT ON COLUMN questions.title_en IS '题目英文标题';
COMMENT ON COLUMN questions.description_zh IS '题目中文描述';
COMMENT ON COLUMN questions.description_en IS '题目英文描述';
COMMENT ON COLUMN questions.extra IS '扩展字段';
COMMENT ON COLUMN questions.deleted_at IS '软删除时间戳';
COMMENT ON COLUMN questions.created_at IS '创建时间';
COMMENT ON COLUMN questions.updated_at IS '更新时间';
COMMENT ON COLUMN questions.search_text_tsv IS '全文搜索字段';
CREATE INDEX idx_questions_type ON questions(type);
CREATE INDEX idx_questions_language ON questions(language);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_questions_primary_knowledge_point_id ON questions(primary_knowledge_point_id);
CREATE INDEX idx_questions_active ON questions(id) WHERE deleted_at IS NULL;
CREATE INDEX idx_questions_search ON questions USING GIN (search_text_tsv);

-- 题目-标签多对多
CREATE TABLE question_tags (
  question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (question_id, tag_id)
);

-- 题目-辅助知识点多对多
CREATE TABLE question_aux_knowledge_points (
  question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  knowledge_point_id BIGINT NOT NULL REFERENCES knowledge_points(id) ON DELETE CASCADE,
  PRIMARY KEY (question_id, knowledge_point_id)
);

-- 6. 标准答案表
CREATE TABLE standard_answers (
  id BIGINT PRIMARY KEY DEFAULT generate_numeric_id(15),
  question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(id),
  is_system BOOLEAN NOT NULL DEFAULT FALSE,
  source VARCHAR(20) NOT NULL DEFAULT 'official',
  is_featured BOOLEAN DEFAULT FALSE,
  answer_type VARCHAR(20) DEFAULT 'explanation',
  content_zh TEXT NOT NULL,
  content_en TEXT NOT NULL,
  extra JSONB DEFAULT '{}'::jsonb,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE standard_answers IS '标准答案表，支持多语言、软删除';
COMMENT ON COLUMN standard_answers.question_id IS '所属题目ID';
COMMENT ON COLUMN standard_answers.user_id IS '创建答案的用户ID';
COMMENT ON COLUMN standard_answers.is_system IS '是否为系统生成';
COMMENT ON COLUMN standard_answers.source IS '答案来源';
COMMENT ON COLUMN standard_answers.is_featured IS '是否为精选答案';
COMMENT ON COLUMN standard_answers.answer_type IS '答案类型';
COMMENT ON COLUMN standard_answers.content_zh IS '中文答案内容';
COMMENT ON COLUMN standard_answers.content_en IS '英文答案内容';
COMMENT ON COLUMN standard_answers.extra IS '扩展字段';
COMMENT ON COLUMN standard_answers.deleted_at IS '软删除时间戳';
COMMENT ON COLUMN standard_answers.created_at IS '创建时间';
COMMENT ON COLUMN standard_answers.updated_at IS '更新时间';
CREATE INDEX idx_standard_answers_question_id ON standard_answers(question_id);
CREATE INDEX idx_standard_answers_user_id ON standard_answers(user_id);
CREATE INDEX idx_standard_answers_is_featured ON standard_answers(is_featured);
CREATE INDEX idx_standard_answers_answer_type ON standard_answers(answer_type);
CREATE INDEX idx_standard_answers_active ON standard_answers(id) WHERE deleted_at IS NULL;

-- 答案-知识点多对多
CREATE TABLE standard_answer_knowledge_points (
  standard_answer_id BIGINT NOT NULL REFERENCES standard_answers(id) ON DELETE CASCADE,
  knowledge_point_id BIGINT NOT NULL REFERENCES knowledge_points(id) ON DELETE CASCADE,
  PRIMARY KEY (standard_answer_id, knowledge_point_id)
);

-- 标准答案-标签多对多
CREATE TABLE standard_answer_tags (
  standard_answer_id BIGINT NOT NULL REFERENCES standard_answers(id) ON DELETE CASCADE,
  tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (standard_answer_id, tag_id)
);
COMMENT ON TABLE standard_answer_tags IS '标准答案与标签的多对多关系表';
COMMENT ON COLUMN standard_answer_tags.standard_answer_id IS '标准答案ID，外键关联standard_answers';
COMMENT ON COLUMN standard_answer_tags.tag_id IS '标签ID，外键关联tags';

-- 7. 用户作答表
CREATE TABLE user_answers (
  id BIGINT PRIMARY KEY DEFAULT generate_numeric_id(15),
  user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  question_id BIGINT NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  input_language VARCHAR(10) NOT NULL DEFAULT 'zh',
  audio_url TEXT,
  transcribed_text TEXT,
  answer_text TEXT NOT NULL,
  quality_score DECIMAL(3, 2) DEFAULT 0.00,
  score_detail JSONB,
  extra JSONB DEFAULT '{}'::jsonb,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
COMMENT ON TABLE user_answers IS '用户作答表，支持语音、评分、软删除';
COMMENT ON COLUMN user_answers.user_id IS '作答用户ID';
COMMENT ON COLUMN user_answers.question_id IS '作答题目ID';
COMMENT ON COLUMN user_answers.input_language IS '作答语言';
COMMENT ON COLUMN user_answers.audio_url IS '语音文件URL';
COMMENT ON COLUMN user_answers.transcribed_text IS '语音转录文本';
COMMENT ON COLUMN user_answers.answer_text IS '最终答案文本';
COMMENT ON COLUMN user_answers.quality_score IS 'AI质量评分';
COMMENT ON COLUMN user_answers.score_detail IS '评分详情';
COMMENT ON COLUMN user_answers.extra IS '扩展字段';
COMMENT ON COLUMN user_answers.deleted_at IS '软删除时间戳';
COMMENT ON COLUMN user_answers.created_at IS '创建时间';
COMMENT ON COLUMN user_answers.updated_at IS '更新时间';
CREATE INDEX idx_user_answers_user_id ON user_answers(user_id);
CREATE INDEX idx_user_answers_question_id ON user_answers(question_id);
CREATE INDEX idx_user_answers_quality_score ON user_answers(quality_score);
CREATE INDEX idx_user_answers_active ON user_answers(id) WHERE deleted_at IS NULL;

-- 用户作答-标签多对多
CREATE TABLE user_answer_tags (
  user_answer_id BIGINT NOT NULL REFERENCES user_answers(id) ON DELETE CASCADE,
  tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (user_answer_id, tag_id)
);
COMMENT ON TABLE user_answer_tags IS '用户作答与标签的多对多关系表';
COMMENT ON COLUMN user_answer_tags.user_answer_id IS '用户作答ID，外键关联user_answers';
COMMENT ON COLUMN user_answer_tags.tag_id IS '标签ID，外键关联tags';

-- 8. search_text_tsv 触发器
CREATE OR REPLACE FUNCTION update_tags_search_text_tsv() RETURNS trigger AS $$
DECLARE
    all_text TEXT := '';
BEGIN
    all_text := coalesce(NEW.name_zh, '') || ' ' || coalesce(NEW.name_en, '') || ' ' ||
                coalesce(NEW.description_zh, '') || ' ' || coalesce(NEW.description_en, '');
    NEW.search_text_tsv := to_tsvector('simple', all_text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_update_tags_search BEFORE INSERT OR UPDATE ON tags FOR EACH ROW EXECUTE FUNCTION update_tags_search_text_tsv();

CREATE OR REPLACE FUNCTION update_knowledge_points_search_text_tsv() RETURNS trigger AS $$
DECLARE
    all_text TEXT := '';
BEGIN
    all_text := coalesce(NEW.name_zh, '') || ' ' || coalesce(NEW.name_en, '') || ' ' ||
                coalesce(NEW.definition_zh, '') || ' ' || coalesce(NEW.definition_en, '');
    NEW.search_text_tsv := to_tsvector('simple', all_text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_update_knowledge_points_search BEFORE INSERT OR UPDATE ON knowledge_points FOR EACH ROW EXECUTE FUNCTION update_knowledge_points_search_text_tsv();

CREATE OR REPLACE FUNCTION update_questions_search_text_tsv() RETURNS trigger AS $$
DECLARE
    all_text TEXT := '';
BEGIN
    all_text := coalesce(NEW.title_zh, '') || ' ' || coalesce(NEW.title_en, '') || ' ' ||
                coalesce(NEW.description_zh, '') || ' ' || coalesce(NEW.description_en, '');
    NEW.search_text_tsv := to_tsvector('simple', all_text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER trg_update_questions_search BEFORE INSERT OR UPDATE ON questions FOR EACH ROW EXECUTE FUNCTION update_questions_search_text_tsv();

-- 9. updated_at 触发器
CREATE OR REPLACE FUNCTION update_updated_at() RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_domains_updated_at BEFORE UPDATE ON domains FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_update_topics_updated_at BEFORE UPDATE ON topics FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_update_tags_updated_at BEFORE UPDATE ON tags FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_update_knowledge_points_updated_at BEFORE UPDATE ON knowledge_points FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_update_questions_updated_at BEFORE UPDATE ON questions FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_update_standard_answers_updated_at BEFORE UPDATE ON standard_answers FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_update_user_answers_updated_at BEFORE UPDATE ON user_answers FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 添加ID生成函数的补充注释
COMMENT ON FUNCTION generate_numeric_id(integer) IS '生成指定长度的随机数字ID，用于各表主键生成，参数为ID长度，返回对应长度的随机数字';