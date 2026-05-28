import './listener.js';
import './graphql-server.js';

// Keep process alive. Both modules start their own servers:
console.log('🔁 Starting Railway composite service (listener + graphql)');

// Railway will set PORT for the GraphQL server via graphql-server.js

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});
