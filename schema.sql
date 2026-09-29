CREATE DATABASE IF NOT EXISTS tech_transfer_platform
  DEFAULT CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tech_transfer_platform;

CREATE TABLE users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  role ENUM('enterprise', 'expert') NOT NULL,
  phone VARCHAR(32) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE 成果库 (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  成果名称 VARCHAR(255) NOT NULL,
  完成人 VARCHAR(255),
  完成单位 VARCHAR(255),
  成果简介 TEXT,
  所属高新技术领域 VARCHAR(120),
  成果体现形式 VARCHAR(120),
  成果所处阶段 VARCHAR(120),
  成果技术水平 VARCHAR(120),
  成果关键字 VARCHAR(500),
  联系人 VARCHAR(120),
  拟采取的转化方式 VARCHAR(120),
  转化说明 TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE 需求库 (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  需求名称 VARCHAR(255) NOT NULL,
  所属单位或公司名称 VARCHAR(255),
  技术领域 VARCHAR(120),
  技术指标 TEXT,
  拟解决的技术难题 TEXT,
  现有基础条件 TEXT,
  预算资金 DECIMAL(14, 2),
  合作方式 VARCHAR(120),
  单位性质 VARCHAR(120),
  预算金额 DECIMAL(14, 2),
  需求类型 VARCHAR(120),
  所属地区 VARCHAR(120),
  有效期 DATE,
  更新时间 TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  信息来源 VARCHAR(255),
  publisher_id BIGINT,
  FOREIGN KEY (publisher_id) REFERENCES users(id)
);

CREATE TABLE experts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT,
  name VARCHAR(120) NOT NULL,
  title VARCHAR(120),
  organization VARCHAR(255),
  region VARCHAR(120),
  field VARCHAR(120),
  keywords VARCHAR(500),
  bio TEXT,
  active_score INT DEFAULT 70,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE match_records (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  demand_id BIGINT NOT NULL,
  expert_id BIGINT NOT NULL,
  score DECIMAL(5, 2) NOT NULL,
  reason TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (demand_id) REFERENCES 需求库(id),
  FOREIGN KEY (expert_id) REFERENCES experts(id)
);

CREATE TABLE conversations (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  demand_id BIGINT NOT NULL,
  expert_id BIGINT NOT NULL,
  title VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (demand_id) REFERENCES 需求库(id),
  FOREIGN KEY (expert_id) REFERENCES experts(id)
);

CREATE TABLE chat_messages (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  conversation_id BIGINT NOT NULL,
  sender VARCHAR(40) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES conversations(id)
);
