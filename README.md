# electron-win-demo


### 环境要求

*   Node.js 和 npm (Node 包管理器)
*   Docker 和 Docker Compose (用于使用提供的 `docker-compose.yml` 进行构建)

### 开始使用 (本地开发)

1.  **克隆仓库 (如果尚未克隆):**
    ```bash
    git clone https://github.com/ShawnMa123/electron-win-demo.git
    cd electron-win-demo
    ```

2.  **安装依赖:**
    ```bash
    npm install
    ```

3.  **在开发模式下运行应用程序:**
    ```bash
    npm start
    ```
    这将打开计算器窗口。

### 为 Windows 构建 (使用 Docker Compose)

本项目配置为在 Docker 容器内使用 `electron-builder` 构建 Windows 安装程序 (`.exe`)。这对于在非 Windows 系统（如 Linux 或 macOS）上进行构建特别有用。

1.  **确保 Docker 和 Docker Compose 已安装并正在运行。**

2.  **导航到项目根目录。**

3.  **运行构建命令:**
    ```bash
    docker compose run --rm electron-builder
    ```
    或者，如果你更喜欢带连字符的命令 (旧版 Docker Compose V1):
    ```bash
    # docker-compose run --rm electron-builder
    ```

4.  **查找输出文件:**
    打包好的 Windows 安装程序 (`.exe`) 和其他构建产物将位于 `dist/` 目录中。

### 使用的技术

*   [Electron](https://www.electronjs.org/)
*   [Node.js](https://nodejs.org/)
*   HTML, CSS, JavaScript
*   [electron-builder](https://www.electron.build/) (用于打包)
*   [Docker](https://www.docker.com/) (用于构建环境)

### 如何贡献

欢迎贡献！如果你有任何建议或改进，请随时：
1.  Fork 本仓库。
2.  创建一个新的分支 (`git checkout -b feature/your-feature-name`)。
3.  进行你的更改。
4.  提交你的更改 (`git commit -m 'Add some feature'`)。
5.  推送到该分支 (`git push origin feature/your-feature-name`)。
6.  提交一个 Pull Request。

