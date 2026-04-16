# 手动部署 Cloudflare Worker 指南

## 前提条件

1. 安装 Node.js (v16+)
2. 安装 Wrangler CLI: `npm install -g wrangler`
3. 登录 Cloudflare: `wrangler login`

## 部署步骤

### 1. 进入 Worker 目录

```bash
cd /Users/leo/WorkBuddy/20260414132240/chinesename/workers
```

### 2. 配置环境变量

编辑 `.env.local` 文件，填入你的真实信息：

```bash
# Cloudflare Account ID (在 Cloudflare 控制台右侧可以看到)
CLOUDFLARE_ACCOUNT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Cloudflare API Token (在 https://dash.cloudflare.com/profile/api-tokens 创建)
# 需要的权限: Account - Cloudflare Workers - Edit
CLOUDFLARE_API_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# DeepSeek API Key
DEEPSEEK_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. 部署 Worker

```bash
# 部署 Worker
wrangler deploy

# 或者使用环境变量部署（推荐，不修改 wrangler.toml）
wrangler deploy --var DEEPSEEK_API_KEY:$DEEPSEEK_API_KEY
```

### 4. 获取 Worker URL

部署成功后，会显示类似：
```
✨ Successfully deployed to https://chinesename-api.your-account.workers.dev
```

### 5. 更新前端配置

把这个 URL 更新到前端代码中：

**文件**: `app/result/page.tsx`

找到这行：
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://chinesename-api.your-account.workers.dev/api/generate";
```

改成你的实际 Worker URL：
```typescript
const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://chinesename-api.xxxxx.workers.dev/api/generate";
```

### 6. 重新部署前端

```bash
# 回到项目根目录
cd ..

# 提交更改
git add -A
git commit -m "update: Worker URL"
git push origin main
```

Cloudflare Pages 会自动重新部署。

## 验证部署

1. 访问前端网站
2. 填写表单生成名字
3. 打开浏览器开发者工具 (F12) → Network 标签
4. 查看是否调用了 Worker URL
5. 如果返回 200 并有 AI 生成的名字，说明成功！

## 安全提示

- `.env.local` 已在 `.gitignore` 中，不会被提交
- 不要将真实的 API Token 上传到 GitHub
- 如果 Token 泄露，立即在 Cloudflare 控制台撤销并重新生成
