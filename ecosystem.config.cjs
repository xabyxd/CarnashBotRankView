module.exports = {
    apps: [
        {
            name: 'lol-rank-overlay',
            script: 'webapp_server.js',
            cwd: __dirname,
            instances: 1,
            autorestart: true,
            watch: false,
            time: true,
            max_memory_restart: '150M',
            env: {
                NODE_ENV: 'production'
            }
        }
    ]
};