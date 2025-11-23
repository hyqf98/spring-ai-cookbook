# GitHub Actions 部署配置说明

## 概述

此 workflow 会在代码推送到 `main` 或 `master` 分支时，自动构建文档并部署到 ECS 服务器。

## 配置步骤

### 1. 生成 SSH 密钥对（如果还没有）

在本地执行：

```bash
ssh-keygen -t rsa -b 4096 -C "github-actions-deploy" -f ~/.ssh/github_actions_deploy
```

这会生成两个文件：

- `~/.ssh/github_actions_deploy` (私钥)
- `~/.ssh/github_actions_deploy.pub` (公钥)

### 2. 将公钥添加到 ECS 服务器

将公钥内容添加到 ECS 服务器的 `~/.ssh/authorized_keys` 文件中：

```bash
# 在本地执行，将公钥复制到 ECS 服务器
ssh-copy-id -i ~/.ssh/github_actions_deploy.pub user@your-ecs-ip

# 或者手动添加
cat ~/.ssh/github_actions_deploy.pub | ssh user@your-ecs-ip "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```

### 3. 配置 GitHub Secrets

在 GitHub 仓库中，进入 **Settings** → **Secrets and variables** → **Actions**，添加以下 Secrets：

| Secret 名称             | 说明                                            | 示例值                                   |
|-----------------------|-----------------------------------------------|---------------------------------------|
| `ECS_SSH_PRIVATE_KEY` | SSH 私钥内容（整个文件内容，包括 `-----BEGIN` 和 `-----END`） | 从 `~/.ssh/github_actions_deploy` 文件复制 |
| `ECS_HOST`            | ECS 服务器 IP 地址或域名                              | `47.21.21.21` 或 `docs.example.com`    |
| `ECS_USER`            | SSH 登录用户名                                     | `root` 或 `ubuntu`                     |
| `ECS_DEPLOY_PATH`     | 部署路径（文档将部署到此目录）                               | `/var/www/html` 或 `/home/user/docs`   |

### 4. 获取私钥内容

```bash
# 在本地执行，复制私钥内容
cat ~/.ssh/github_actions_deploy
```

将输出的完整内容（包括 `-----BEGIN RSA PRIVATE KEY-----` 和 `-----END RSA PRIVATE KEY-----`）复制到 GitHub Secrets 的 `ECS_SSH_PRIVATE_KEY` 中。

## 工作流程

1. **触发条件**：
    - 推送到 `main` 或 `master` 分支
    - `docs/` 目录下的文件有变更
    - 手动触发（workflow_dispatch）

2. **构建步骤**：
    - 检出代码
    - 设置 Node.js 环境
    - 安装依赖 (`npm install`)
    - 构建文档 (`npm run build`)

3. **部署步骤**：
    - 配置 SSH 密钥
    - 使用 rsync 同步文件到 ECS 服务器
    - `--delete` 选项确保目标目录与源目录完全一致（会删除目标目录中不存在的文件）

## 注意事项

- 确保 ECS 服务器上的部署目录有写入权限
- 建议使用非 root 用户，并配置适当的权限
- 如果使用 Nginx，确保配置指向正确的部署路径
- 首次部署前，建议在 ECS 服务器上手动创建部署目录

## 故障排查

### SSH 连接失败

1. 检查 SSH 密钥是否正确配置
2. 检查 ECS 服务器的防火墙设置
3. 检查 `known_hosts` 是否正确添加

### 权限错误

1. 检查部署目录的权限
2. 确保 SSH 用户有写入权限

### rsync 同步失败

1. 检查部署路径是否存在
2. 检查磁盘空间是否充足
3. 检查网络连接

## 安全建议

- 定期轮换 SSH 密钥
- 使用最小权限原则
- 考虑使用 SSH 密钥密码保护（需要额外配置）
- 定期检查 GitHub Actions 日志

## Nginx 配置

项目根目录下的 `.github/workflows/nginx.conf` 包含了优化的 Nginx 配置文件，包括：

- HTTP 自动跳转到 HTTPS
- SSL/TLS 安全配置
- 安全头设置
- Gzip 压缩
- 静态资源缓存策略
- VitePress SPA 路由支持

### 使用说明

1. 将配置文件复制到 ECS 服务器：
   ```bash
   sudo cp .github/workflows/nginx.conf /etc/nginx/sites-available/spring-ai-cookbook
   ```

2. 创建符号链接：
   ```bash
   sudo ln -s /etc/nginx/sites-available/spring-ai-cookbook /etc/nginx/sites-enabled/
   ```

3. 测试配置：
   ```bash
   sudo nginx -t
   ```

4. 重载 Nginx：
   ```bash
   sudo systemctl reload nginx
   ```

### 注意事项

- 确保 SSL 证书路径正确：`/etc/nginx/encrypt/fullchain.pem` 和 `/etc/nginx/encrypt/privkey.pem`
- 如果使用 Let's Encrypt，证书路径可能不同
- 根据实际情况调整 `root` 路径：`/var/www/spring-ai-cookbook/dist`
- 如果安装了 Brotli 模块，可以取消注释 Brotli 压缩配置

