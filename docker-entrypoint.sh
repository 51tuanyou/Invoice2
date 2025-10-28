#!/bin/sh

# Create runtime config file
echo "window._env_ = {" > /usr/share/nginx/html/env-config.js
if [ -n "${REACT_APP_OPENAI_API_KEY}" ]; then
  echo "  REACT_APP_OPENAI_API_KEY: '${REACT_APP_OPENAI_API_KEY}'" >> /usr/share/nginx/html/env-config.js
  echo "Runtime config created with REACT_APP_OPENAI_API_KEY: ${REACT_APP_OPENAI_API_KEY:0:8}..."
else
  echo "  REACT_APP_OPENAI_API_KEY: ''" >> /usr/share/nginx/html/env-config.js
  echo "No REACT_APP_OPENAI_API_KEY provided - will prompt user for API key in app"
fi
echo "};" >> /usr/share/nginx/html/env-config.js

# Start nginx
exec "$@"
