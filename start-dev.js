const { spawn } = require('child_process');

const devServer = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

devServer.on('close', (code) => {
  console.log(`开发服务器退出，代码: ${code}`);
});

devServer.on('error', (error) => {
  console.error(`开发服务器启动失败: ${error.message}`);
});

console.log('开发服务器已启动...');
