#!/bin/sh

# Create runtime config file
echo "window._env_ = {" > /usr/share/nginx/html/env-config.js
echo "  REACT_APP_OPENAI_API_KEY: '${REACT_APP_OPENAI_API_KEY}'" >> /usr/share/nginx/html/env-config.js
echo "};" >> /usr/share/nginx/html/env-config.js

echo "Runtime config created with REACT_APP_OPENAI_API_KEY: ${REACT_APP_OPENAI_API_KEY:0:8}..."

# Start nginx
exec "$@"
