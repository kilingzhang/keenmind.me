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

-- 2. 创建 ability_points 表（没有外键依赖）
CREATE EXTENSION IF NOT EXISTS citext;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE TABLE ability_points (
	id BIGINT PRIMARY KEY DEFAULT generate_numeric_id(15), -- 自增主键
	slug CITEXT UNIQUE NOT NULL, -- 语义唯一标识，用于URL和API调用，不区分大小写
	domain_zh TEXT NOT NULL DEFAULT '', -- 所属领域中文名称，如 "Go语言"
	domain_en TEXT NOT NULL DEFAULT '', -- 所属领域英文名称，如 "Go"
	name_zh TEXT NOT NULL DEFAULT '', -- 能力点中文名称
	name_en TEXT NOT NULL DEFAULT '', -- 能力点英文名称
	description_zh TEXT DEFAULT NULL, -- 能力点中文说明
	description_en TEXT DEFAULT NULL, -- 能力点英文说明
	aliases JSONB NOT NULL DEFAULT '{}'::jsonb, -- 多语言别名，支持搜索和关联
	tags JSONB NOT NULL DEFAULT '{}'::jsonb, -- 多语言标签，用于分类和筛选
	search_text_tsv TSVECTOR, -- 全文搜索字段，自动构建
	deleted_at TIMESTAMPTZ, -- 软删除时间戳
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(), -- 创建时间
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now() -- 更新时间
);

-- 为 JSONB 字段创建索引
CREATE INDEX idx_ability_points_tags ON ability_points USING GIN (tags);

CREATE INDEX idx_ability_points_aliases ON ability_points USING GIN (aliases);

CREATE INDEX idx_ability_points_active ON ability_points (id)
WHERE
	deleted_at IS NULL;

COMMENT ON TABLE ability_points IS '能力点表，存储技术能力点的多语言信息，支持全文搜索和软删除';

COMMENT ON COLUMN ability_points.id IS '能力点唯一标识，使用generate_numeric_id(15)生成15位随机数字ID';

COMMENT ON COLUMN ability_points.slug IS '语义化唯一标识，用于URL和API调用，不区分大小写';

COMMENT ON COLUMN ability_points.domain_zh IS '能力点所属领域的中文名称，如"Go语言"、"数据库"等';

COMMENT ON COLUMN ability_points.domain_en IS '能力点所属领域的英文名称，如"Go"、"Database"等';

COMMENT ON COLUMN ability_points.name_zh IS '能力点的中文名称，用于中文界面显示';

COMMENT ON COLUMN ability_points.name_en IS '能力点的英文名称，用于英文界面显示';

COMMENT ON COLUMN ability_points.description_zh IS '能力点的中文详细说明，描述该能力点的具体内容和要求';

COMMENT ON COLUMN ability_points.description_en IS '能力点的英文详细说明，描述该能力点的具体内容和要求';

COMMENT ON COLUMN ability_points.aliases IS '多语言别名结构，用于支持搜索和关联，格式：{"zh": ["别名1", "别名2"], "en": ["alias1", "alias2"]}';

COMMENT ON COLUMN ability_points.tags IS '多语言标签结构，用于分类和筛选，格式：{"zh": ["标签1", "标签2"], "en": ["tag1", "tag2"]}';

COMMENT ON COLUMN ability_points.search_text_tsv IS '全文搜索字段，由触发器自动构建，包含所有语言内容';

COMMENT ON COLUMN ability_points.deleted_at IS '软删除时间戳，NULL表示未删除';

COMMENT ON COLUMN ability_points.created_at IS '记录创建时间，自动设置为当前时间';

COMMENT ON COLUMN ability_points.updated_at IS '记录最后更新时间，由触发器自动更新';

-- 自动构建全文搜索字段
CREATE
OR REPLACE FUNCTION update_ability_points_search_text_tsv () RETURNS trigger AS $$
DECLARE
    all_text TEXT := '';
BEGIN
    all_text := coalesce(NEW.domain_zh, '') || ' ' || coalesce(NEW.domain_en, '') || ' ' || 
                coalesce(NEW.name_zh, '') || ' ' || coalesce(NEW.name_en, '') || ' ' ||
                coalesce(NEW.description_zh, '') || ' ' || coalesce(NEW.description_en, '');

    all_text := all_text || ' ' ||
      array_to_string(ARRAY(SELECT jsonb_array_elements_text(value) FROM jsonb_each(NEW.aliases)), ' ') || ' ' ||
      array_to_string(ARRAY(SELECT jsonb_array_elements_text(value) FROM jsonb_each(NEW.tags)), ' ');

    NEW.search_text_tsv := to_tsvector('simple', all_text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_ability_points_search BEFORE INSERT
OR
UPDATE ON ability_points FOR EACH ROW
EXECUTE FUNCTION update_ability_points_search_text_tsv ();

CREATE INDEX idx_ability_points_search ON ability_points USING GIN (search_text_tsv);

-- 添加自动更新 updated_at 的触发器
CREATE
OR REPLACE FUNCTION update_ability_points_updated_at () RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_ability_points_updated_at BEFORE
UPDATE ON ability_points FOR EACH ROW
EXECUTE FUNCTION update_ability_points_updated_at ();

-- 3. 创建 knowledge_points 表（依赖 ability_points）
CREATE TABLE knowledge_points (
	id BIGINT PRIMARY KEY DEFAULT generate_numeric_id(15), -- 自增主键
	slug CITEXT UNIQUE NOT NULL, -- 语义唯一标识，用于URL和API调用，不区分大小写
	name_zh TEXT NOT NULL DEFAULT '', -- 中文名称，用于中文界面显示
	name_en TEXT NOT NULL DEFAULT '', -- 英文名称，用于英文界面显示
	definition_zh TEXT DEFAULT NULL, -- 中文定义，详细解释该知识点
	definition_en TEXT DEFAULT NULL, -- 英文定义，详细解释该知识点
	aliases JSONB NOT NULL DEFAULT '{}'::jsonb, -- 多语言别名，支持搜索和关联
	tags JSONB NOT NULL DEFAULT '{}'::jsonb, -- 多语言标签，用于分类和筛选
	ability_point_ids JSONB NOT NULL DEFAULT '[]'::jsonb, -- 关联的能力点ID数组
	search_text_tsv TSVECTOR, -- 全文搜索字段，自动构建
	deleted_at TIMESTAMPTZ, -- 软删除时间戳
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(), -- 创建时间
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now() -- 更新时间
);

-- 为 JSONB 字段创建索引
CREATE INDEX idx_knowledge_points_tags ON knowledge_points USING GIN (tags);

CREATE INDEX idx_knowledge_points_aliases ON knowledge_points USING GIN (aliases);

CREATE INDEX idx_knowledge_points_active ON knowledge_points (id)
WHERE
	deleted_at IS NULL;

COMMENT ON TABLE knowledge_points IS '知识点表，存储技术知识点的多语言信息，支持全文搜索和软删除';

COMMENT ON COLUMN knowledge_points.id IS '知识点唯一标识，使用generate_numeric_id(15)生成15位随机数字ID';

COMMENT ON COLUMN knowledge_points.slug IS '语义化唯一标识，用于URL和API调用，不区分大小写';

COMMENT ON COLUMN knowledge_points.name_zh IS '知识点的中文名称，用于中文界面显示';

COMMENT ON COLUMN knowledge_points.name_en IS '知识点的英文名称，用于英文界面显示';

COMMENT ON COLUMN knowledge_points.definition_zh IS '知识点的中文定义，详细解释该知识点的含义和用途';

COMMENT ON COLUMN knowledge_points.definition_en IS '知识点的英文定义，详细解释该知识点的含义和用途';

COMMENT ON COLUMN knowledge_points.aliases IS '多语言别名结构，用于支持搜索和关联，格式：{"zh": ["别名1", "别名2"], "en": ["alias1", "alias2"]}';

COMMENT ON COLUMN knowledge_points.tags IS '多语言标签结构，用于分类和筛选，格式：{"zh": ["标签1", "标签2"], "en": ["tag1", "tag2"]}';

COMMENT ON COLUMN knowledge_points.ability_point_ids IS '关联的能力点ID数组，表示该知识点属于哪些能力点';

COMMENT ON COLUMN knowledge_points.search_text_tsv IS '全文搜索字段，由触发器自动构建，包含所有语言内容';

COMMENT ON COLUMN knowledge_points.deleted_at IS '软删除时间戳，NULL表示未删除';

COMMENT ON COLUMN knowledge_points.created_at IS '记录创建时间，自动设置为当前时间';

COMMENT ON COLUMN knowledge_points.updated_at IS '记录最后更新时间，由触发器自动更新';

-- 自动构建全文搜索字段
CREATE
OR REPLACE FUNCTION update_knowledge_points_search_text_tsv () RETURNS trigger AS $$
DECLARE
    all_text TEXT := '';
BEGIN
    all_text := coalesce(NEW.name_zh, '') || ' ' || coalesce(NEW.name_en, '') || ' ' ||
                coalesce(NEW.definition_zh, '') || ' ' || coalesce(NEW.definition_en, '');

    all_text := all_text || ' ' ||
      array_to_string(ARRAY(SELECT jsonb_array_elements_text(value) FROM jsonb_each(NEW.aliases)), ' ') || ' ' ||
      array_to_string(ARRAY(SELECT jsonb_array_elements_text(value) FROM jsonb_each(NEW.tags)), ' ');

    NEW.search_text_tsv := to_tsvector('simple', all_text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_knowledge_points_search BEFORE INSERT
OR
UPDATE ON knowledge_points FOR EACH ROW
EXECUTE FUNCTION update_knowledge_points_search_text_tsv ();

CREATE INDEX idx_knowledge_points_search ON knowledge_points USING GIN (search_text_tsv);

-- 添加自动更新 updated_at 的触发器
CREATE
OR REPLACE FUNCTION update_knowledge_points_updated_at () RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_knowledge_points_updated_at BEFORE
UPDATE ON knowledge_points FOR EACH ROW
EXECUTE FUNCTION update_knowledge_points_updated_at ();

-- 4. 创建 question_variants 表（依赖 knowledge_points）
CREATE TABLE question_variants (
	id BIGINT PRIMARY KEY DEFAULT generate_numeric_id(15), -- 自增主键
	type VARCHAR(20) NOT NULL DEFAULT 'open-ended', -- 题目类型：开放题、编程题、选择题
	language VARCHAR(20) DEFAULT NULL, -- 涉及编程语言，如 "Go"、"Python"
	difficulty VARCHAR(10) NOT NULL DEFAULT 'medium', -- 难度等级：easy、medium、hard
	source VARCHAR(50) DEFAULT 'official', -- 题目来源：official、user、ai
	primary_knowledge_point_id BIGINT NOT NULL REFERENCES knowledge_points (id), -- 主知识点ID
	auxiliary_knowledge_points JSONB NOT NULL DEFAULT '[]'::jsonb, -- 辅助知识点数组
	tags JSONB NOT NULL DEFAULT '{}'::jsonb, -- 多语言标签
	title_zh TEXT NOT NULL DEFAULT '', -- 中文题目标题
	title_en TEXT NOT NULL DEFAULT '', -- 英文题目标题
	description_zh TEXT DEFAULT NULL, -- 中文题目描述
	description_en TEXT DEFAULT NULL, -- 英文题目描述
	search_text_tsv TSVECTOR, -- 全文搜索字段
	deleted_at TIMESTAMPTZ, -- 软删除时间戳
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(), -- 创建时间
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now() -- 更新时间
);

-- 创建常用查询字段的索引
CREATE INDEX idx_question_variants_type ON question_variants (type);

CREATE INDEX idx_question_variants_language ON question_variants (language);

CREATE INDEX idx_question_variants_difficulty ON question_variants (difficulty);

CREATE INDEX idx_question_variants_tags ON question_variants USING GIN (tags);

CREATE INDEX idx_question_variants_active ON question_variants (id)
WHERE
	deleted_at IS NULL;

COMMENT ON TABLE question_variants IS '题目表，存储各类技术题目的多语言信息，支持全文搜索和软删除';

COMMENT ON COLUMN question_variants.id IS '题目唯一标识，使用generate_numeric_id(15)生成15位随机数字ID';

COMMENT ON COLUMN question_variants.type IS '题目类型：open-ended（开放题）、code（编程题）、choice（选择题）';

COMMENT ON COLUMN question_variants.language IS '涉及编程语言，如"Go"、"Python"等，非编程题可为NULL';

COMMENT ON COLUMN question_variants.difficulty IS '题目难度等级：easy（简单）、medium（中等）、hard（困难）';

COMMENT ON COLUMN question_variants.source IS '题目来源：official（官方）、user（用户上传）、ai（AI生成）';

COMMENT ON COLUMN question_variants.primary_knowledge_point_id IS '主知识点ID，题目主要考察的知识点，外键关联knowledge_points表的15位随机数字ID';

COMMENT ON COLUMN question_variants.auxiliary_knowledge_points IS '辅助知识点ID数组，格式：[2,3,4]';

COMMENT ON COLUMN question_variants.tags IS '多语言标签结构，格式：{"zh": ["标签1", "标签2"], "en": ["tag1", "tag2"]}';

COMMENT ON COLUMN question_variants.title_zh IS '题目的中文标题，用于中文界面显示';

COMMENT ON COLUMN question_variants.title_en IS '题目的英文标题，用于英文界面显示';

COMMENT ON COLUMN question_variants.description_zh IS '题目的中文详细描述，包含题目要求和说明';

COMMENT ON COLUMN question_variants.description_en IS '题目的英文详细描述，包含题目要求和说明';

COMMENT ON COLUMN question_variants.search_text_tsv IS '全文搜索字段，由触发器自动构建，包含所有语言内容';

COMMENT ON COLUMN question_variants.deleted_at IS '软删除时间戳，NULL表示未删除';

COMMENT ON COLUMN question_variants.created_at IS '记录创建时间，自动设置为当前时间';

COMMENT ON COLUMN question_variants.updated_at IS '记录最后更新时间，由触发器自动更新';

-- 自动更新全文搜索字段
CREATE
OR REPLACE FUNCTION update_question_variants_search_text_tsv () RETURNS trigger AS $$
DECLARE
    all_text TEXT := '';
BEGIN
    all_text := coalesce(NEW.title_zh, '') || ' ' || coalesce(NEW.title_en, '') || ' ' ||
                coalesce(NEW.description_zh, '') || ' ' || coalesce(NEW.description_en, '');

    all_text := all_text || ' ' ||
        array_to_string(ARRAY(
            SELECT jsonb_array_elements_text(value) FROM jsonb_each(NEW.tags)
        ), ' ');

    NEW.search_text_tsv := to_tsvector('simple', all_text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_question_variants_search BEFORE INSERT
OR
UPDATE ON question_variants FOR EACH ROW
EXECUTE FUNCTION update_question_variants_search_text_tsv ();

CREATE INDEX idx_question_variants_search ON question_variants USING GIN (search_text_tsv);

-- 添加自动更新 updated_at 的触发器
CREATE
OR REPLACE FUNCTION update_question_variants_updated_at () RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_question_variants_updated_at BEFORE
UPDATE ON question_variants FOR EACH ROW
EXECUTE FUNCTION update_question_variants_updated_at ();

-- 5. 创建 standard_answers 表（依赖 users 和 question_variants）
CREATE TABLE standard_answers (
	id BIGINT PRIMARY KEY DEFAULT generate_numeric_id(15), -- 自增主键
	question_id BIGINT NOT NULL REFERENCES question_variants (id) ON DELETE RESTRICT, -- 所属题目ID
	user_id BIGINT REFERENCES users (id) ON DELETE RESTRICT, -- 用户ID，系统生成则为NULL
	is_system BOOLEAN NOT NULL DEFAULT FALSE, -- 是否为系统生成的答案
	source VARCHAR(20) NOT NULL DEFAULT 'official', -- 答案来源
	is_featured BOOLEAN DEFAULT FALSE, -- 是否为精选答案
	used_as_primary BIGINT DEFAULT 0, -- 被采纳为主答案的次数
	upvotes BIGINT DEFAULT 0, -- 点赞数量
	bookmark BIGINT DEFAULT 0, -- 收藏数量
	answer_type VARCHAR(20) DEFAULT 'explanation', -- 答案类型
	knowledge_point_ids JSONB NOT NULL DEFAULT '[]'::jsonb, -- 关联的知识点ID数组
	content_zh TEXT NOT NULL DEFAULT '', -- 中文答案内容
	content_en TEXT NOT NULL DEFAULT '', -- 英文答案内容
	search_text_tsv TSVECTOR, -- 全文搜索字段
	deleted_at TIMESTAMPTZ, -- 软删除时间戳
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(), -- 创建时间
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now() -- 更新时间
);

-- 创建常用查询字段的索引
CREATE INDEX idx_standard_answers_question_id ON standard_answers (question_id);

CREATE INDEX idx_standard_answers_user_id ON standard_answers (user_id);

CREATE INDEX idx_standard_answers_is_featured ON standard_answers (is_featured);

CREATE INDEX idx_standard_answers_answer_type ON standard_answers (answer_type);

CREATE INDEX idx_standard_answers_knowledge_points ON standard_answers USING GIN (knowledge_point_ids);

CREATE INDEX idx_standard_answers_active ON standard_answers (id)
WHERE
	deleted_at IS NULL;

COMMENT ON TABLE standard_answers IS '标准答案表，存储题目的标准答案，支持多语言、点赞收藏统计及全文搜索';

COMMENT ON COLUMN standard_answers.id IS '答案唯一标识，使用generate_numeric_id(15)生成15位随机数字ID';

COMMENT ON COLUMN standard_answers.question_id IS '所属题目的ID，外键关联question_variants表的15位随机数字ID';

COMMENT ON COLUMN standard_answers.user_id IS '创建答案的用户ID，系统生成的答案为NULL，外键关联users表的12位随机数字ID';

COMMENT ON COLUMN standard_answers.is_system IS '是否为系统生成的答案，TRUE表示系统生成，FALSE表示用户创建';

COMMENT ON COLUMN standard_answers.source IS '答案来源：official（官方）、user（用户）、ai（AI生成）';

COMMENT ON COLUMN standard_answers.is_featured IS '是否为精选答案，TRUE表示精选，会在前端优先展示';

COMMENT ON COLUMN standard_answers.used_as_primary IS '被用户采纳为主答案的次数，用于排序和推荐';

COMMENT ON COLUMN standard_answers.upvotes IS '答案获得的点赞数量';

COMMENT ON COLUMN standard_answers.bookmark IS '答案被收藏的次数';

COMMENT ON COLUMN standard_answers.answer_type IS '答案类型：explanation（解释）、code（代码）、example（举例）';

COMMENT ON COLUMN standard_answers.knowledge_point_ids IS '答案关联的知识点ID数组，格式：[1,2,3]';

COMMENT ON COLUMN standard_answers.content_zh IS '答案的中文内容';

COMMENT ON COLUMN standard_answers.content_en IS '答案的英文内容';

COMMENT ON COLUMN standard_answers.search_text_tsv IS '全文搜索字段，由触发器自动构建，包含所有语言内容';

COMMENT ON COLUMN standard_answers.deleted_at IS '软删除时间戳，NULL表示未删除';

COMMENT ON COLUMN standard_answers.created_at IS '记录创建时间，自动设置为当前时间';

COMMENT ON COLUMN standard_answers.updated_at IS '记录最后更新时间，由触发器自动更新';

-- 自动构建全文搜索字段
CREATE
OR REPLACE FUNCTION update_standard_answers_search_text_tsv () RETURNS trigger AS $$
DECLARE
    all_text TEXT := '';
BEGIN
    all_text := coalesce(NEW.content_zh, '') || ' ' || coalesce(NEW.content_en, '') || ' ' ||
        array_to_string(ARRAY(
            SELECT jsonb_array_elements_text(NEW.knowledge_point_ids::jsonb)
        ), ' ');

    NEW.search_text_tsv := to_tsvector('simple', all_text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_standard_answers_search BEFORE INSERT
OR
UPDATE ON standard_answers FOR EACH ROW
EXECUTE FUNCTION update_standard_answers_search_text_tsv ();

CREATE INDEX idx_standard_answers_search ON standard_answers USING GIN (search_text_tsv);

-- 添加自动更新 updated_at 的触发器
CREATE
OR REPLACE FUNCTION update_standard_answers_updated_at () RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_standard_answers_updated_at BEFORE
UPDATE ON standard_answers FOR EACH ROW
EXECUTE FUNCTION update_standard_answers_updated_at ();

-- 6. 创建 user_answers 表（依赖 users 和 question_variants）
CREATE TABLE user_answers (
	id BIGINT PRIMARY KEY DEFAULT generate_numeric_id(15), -- 自增主键
	user_id BIGINT NOT NULL REFERENCES users (id) ON DELETE RESTRICT, -- 用户ID
	question_id BIGINT NOT NULL REFERENCES question_variants (id) ON DELETE RESTRICT, -- 题目ID
	input_language VARCHAR(10) NOT NULL DEFAULT 'zh', -- 输入语言
	audio_url TEXT DEFAULT NULL, -- 音频文件URL
	transcribed_text TEXT DEFAULT NULL, -- 转录文本
	answer_text TEXT NOT NULL DEFAULT '', -- 最终答案文本
	quality_score DECIMAL(3, 2) DEFAULT 0.00, -- 质量评分
	score_detail JSONB DEFAULT NULL, -- 评分详情
	created_at TIMESTAMPTZ DEFAULT now(), -- 创建时间
	deleted_at TIMESTAMPTZ, -- 软删除时间戳
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now() -- 更新时间
);

-- 创建常用查询字段的索引
CREATE INDEX idx_user_answers_user_id ON user_answers (user_id);

CREATE INDEX idx_user_answers_question_id ON user_answers (question_id);

CREATE INDEX idx_user_answers_quality_score ON user_answers (quality_score);

CREATE INDEX idx_user_answers_active ON user_answers (id)
WHERE
	deleted_at IS NULL;

COMMENT ON TABLE user_answers IS '用户作答记录表，支持语音输入、自动评分，保留原始语音与转录文本';

COMMENT ON COLUMN user_answers.id IS '作答记录唯一标识，使用generate_numeric_id(15)生成15位随机数字ID';

COMMENT ON COLUMN user_answers.user_id IS '作答用户的ID，外键关联users表的12位随机数字ID';

COMMENT ON COLUMN user_answers.question_id IS '作答题目的ID，外键关联question_variants表的15位随机数字ID';

COMMENT ON COLUMN user_answers.input_language IS '用户作答使用的语言，如"zh"（中文）、"en"（英文）';

COMMENT ON COLUMN user_answers.audio_url IS '语音输入的音频文件URL，非语音输入为NULL';

COMMENT ON COLUMN user_answers.transcribed_text IS '语音输入转录后的文本内容，非语音输入为NULL';

COMMENT ON COLUMN user_answers.answer_text IS '用户最终提交的答案文本，可能是手动编辑后的内容';

COMMENT ON COLUMN user_answers.quality_score IS 'AI分析的质量评分，范围0-1.5，保留两位小数';

COMMENT ON COLUMN user_answers.score_detail IS '分项评分详情，JSON格式，如{"coverage":0.9, "clarity":0.8}';

COMMENT ON COLUMN user_answers.created_at IS '作答提交时间，自动设置为当前时间';

COMMENT ON COLUMN user_answers.deleted_at IS '软删除时间戳，NULL表示未删除';

COMMENT ON COLUMN user_answers.updated_at IS '记录最后更新时间，由触发器自动更新';

-- 添加自动更新 updated_at 的触发器
CREATE
OR REPLACE FUNCTION update_user_answers_updated_at () RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_user_answers_updated_at BEFORE
UPDATE ON user_answers FOR EACH ROW
EXECUTE FUNCTION update_user_answers_updated_at ();

-- 添加ID生成函数的补充注释
COMMENT ON FUNCTION generate_numeric_id(integer) IS '生成指定长度的随机数字ID，用于各表主键生成，参数为ID长度，返回对应长度的随机数字';