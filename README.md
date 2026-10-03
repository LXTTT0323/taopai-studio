# 桃派工作室 · Taopai Studio

桃派工作室官方网站的可编辑源码。帮助学生用 2–4 周，做出能写进简历、也能在面试中讲清楚的 AI 项目。

线上网站：https://taopai-studio.pages.dev/

这是当前已上线版本的独立静态网站，不依赖 ChatGPT，不需要安装前端框架，也不包含后台或数据库。

## 修改哪个文件

| 文件 | 用途 |
| --- | --- |
| `index.html` | 页面文案、区块、导航、导师名称、预约表单 |
| `hero-simple.css` | 首页首屏排版与移动端样式 |
| `hiring-evidence.css` | Amazon / Google 招聘案例的横向布局 |
| `style.css` | 全站基础样式、其他区块、导师横向滚动 |
| `app.js` | 页面与导师滚动效果 |
| `consultation.js` | 隐藏收件地址的 FormSubmit 接入、表单启用状态 |
| `thank-you.html` | 提交后的返回页面 |
| `images/taopai-logo.png` | 工作室标志 |

样式加载顺序为 `style.css` → `hero-simple.css` → `hiring-evidence.css`，后面的规则可覆盖前面的规则。

## 本地预览

克隆仓库，在仓库目录运行以下任一命令：

```sh
python -m http.server 4317 --bind 127.0.0.1
```

Windows 也可使用：

```powershell
py -m http.server 4317 --bind 127.0.0.1
```

浏览器打开 http://127.0.0.1:4317/ 。不需要构建步骤。

## 一起修改

- 有写入权限：创建分支，修改后提交 Pull Request，由负责人确认后合并。
- 没有写入权限：先 Fork，再提交 Pull Request；也可以通过 Issues 提建议。
- 只改文案：在 GitHub 打开 `index.html`，点击编辑按钮，提交修改或发起 Pull Request。
- 直接协作权限由仓库所有者在 Settings → Collaborators 中邀请，不是拿到链接就能直接修改主分支。

## 发布到正式网站

当前使用 Cloudflare Pages，项目名为 `taopai-studio`，生产分支为 `main`。

**本仓库尚未配置自动部署。Push 或合并 PR 不会自动更新线上网站。**

由具备 Cloudflare 发布权限的人，将下面八个网站文件复制到单独的发布目录（例如 `release`，保留 `images` 子目录）：

`index.html`、`style.css`、`hero-simple.css`、`hiring-evidence.css`、`app.js`、`consultation.js`、`thank-you.html`、`images/taopai-logo.png`。

然后运行：

```sh
npx wrangler pages deploy release --project-name taopai-studio --branch main
```

也可以在 Cloudflare Pages 控制台直接上传该发布目录。不要上传整个工作区、`.git`、本地配置或密钥；不要把 API 密钥或登录凭据写入任何网页文件。

## 咨询收件配置（已启用）

不在前端或仓库保存收件邮箱。表单采用 FormSubmit 提供的随机表单编号，而不是邮箱形式的地址。

2026-10-03：收件人确认激活，并提供匿名编号验收邮件的收件截图；姓名、阶段、咨询内容、联系方式四项均完整到达收件箱。网站已启用提交。后续邮件仍可能受到收件服务及垃圾邮件过滤影响。

1. 收件人点击 FormSubmit 验证邮件里的 Activate Form。
2. 将服务提供的随机表单编号填入 `consultation.js` 的 `FORM_ID`。不要填收件邮箱、激活链接或 API 密钥。
3. 测试该编号能投递到正确收件箱，并实际确认收到测试邮件，再将 `FORM_VERIFIED` 改为 `true`。
4. 部署后，在真实网站填写一条明确标为测试的咨询，完成人机验证，并由收件人确认邮件里包含全部四项信息。

配置未验证时表单保持关闭，不会显示虚假的提交成功提示。启用后通过原生 POST 前往 FormSubmit 完成人机验证，再回到 `thank-you.html`。保留 reCAPTCHA，不使用 `_captcha=false`。服务接收不等于收件箱一定送达，排查时也检查垃圾邮件。

参考：https://formsubmit.co/documentation 。服务说明提交记录保留 30 天，页面已提示访客。

## 修改时注意

- 不要重新加入收件邮箱或 `mailto:`；本次移除的是当前版本，历史副本需要另外清理。
- 招聘案例引用原岗位页面，不保证岗位持续开放或获得面试。
- 导师和机构名称不能被改成未经确认的官方合作或结果承诺。
- 保留手机端布局，以及系统“减少动态效果”设置的支持。
- 发布前检查首页、01/02/03 编号、外链、导师滚动和预约邮件流程。
