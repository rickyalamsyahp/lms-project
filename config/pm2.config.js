module.exports = {
  apps: [
    {
      name: "gfac-service-user",
      script: './index.js',
      instances: 1,
      exec_mode: 'cluster',
      // watch: true,
      // increment_var: 'PORT',
      env: {
        "NODE_ENV":"production",
        "PORT":"9000",
        "TCP_PORT":"9234",
        "TCP_HOST":"127.0.0.1",
        "BODY_LIMIT":"100kb",
        "PG_VERSION":"14.2",
        "PG_HOST":"127.0.0.1",
        "PG_PORT":"5432",
        "PG_USER":"argo",
        "PG_PASSWORD":"",
        "PG_DATABASE":"gfac_user_db",
        "CREATE_TABLE":"1",
        "JWT_SECRET":"1011154e-e5c9-11ed-a05b-0242ac120003",
        "JWT_EXPIRES_IN":"1d",  
        "COOKIE_MAX_AGE":"86400",
        "PROFILE_PICTURE_STORAGE":"./tmp/profile-picture",
        "SUBMISSION_LOG_STORAGE":"./tmp/submission/log",
        "SUBMISSION_REPORT_STORAGE":"./tmp/submission/report",
        "COURSE_STORAGE":"./tmp/module",
        "API_GATEWAY":"http://localhost:9000",
        "REPLAY_BASE_URL_VIDEO":"./tmp/replay/video",
        "REPLAY_BASE_URL_SIMULATION":"./tmp/replay/simulation",
      }
    }
  ]
}