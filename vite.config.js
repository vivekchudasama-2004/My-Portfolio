// vite.config.js
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Create vendor chunk for node_modules
          if (id.includes('node_modules')) {
            // Separate large libraries
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('framer-motion')) {
              return 'animation';
            }
            if (id.includes('firebase')) {
              return 'firebase';
            }
            // Other small libraries go to general vendor
            return 'vendor';
          }

          // Create chunks based on your code structure
          if (id.includes('/components/')) {
            return 'components';
          }
          if (id.includes('/views/') || id.includes('/pages/')) {
            return 'views';
          }
        }
      }
    }
  }
}
