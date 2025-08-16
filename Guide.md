# DDoS CVE Dashboard - Setup Guide

## Overview
This dashboard analyzes DDoS-related CVEs from multiple perspectives using the OpenCVE API. It provides insights by corporation, programming language, product, recurrence patterns, network protocols, and validation status.

## Quick Start (Standalone HTML)

### Option 1: Instant Setup
1. Download `ddos-cve-dashboard.html`
2. Open the file in any web browser
3. Dashboard loads immediately with sample data

### Option 2: Development Server
1. Install VS Code with Live Server extension
2. Open `ddos-cve-dashboard.html` in VS Code
3. Right-click → "Open with Live Server"
4. Access at `http://localhost:5500`

## Full React Development Setup

### Prerequisites
- Node.js 16+ installed
- npm or yarn package manager

### Installation Steps
```bash
# Clone repository
git clone https://github.com/OhadLibai/CVEs-DDoS-Dashboard
cd CVEs-DDoS-Dashboard

# Create React app
npx create-react-app .
# OR if directory not empty:
npx create-react-app ddos-dashboard
cd ddos-dashboard

# Install dependencies
npm install recharts lucide-react

# Install Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Configure Tailwind (update tailwind.config.js):
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: { extend: {} },
  plugins: []
}

# Add Tailwind to src/index.css:
@tailwind base;
@tailwind components;
@tailwind utilities;

# Replace src/App.js with dashboard code
# Start development server
npm start
```

### Access
- Development: `http://localhost:3000`
- Production build: `npm run build`

## Features
- **Multi-dimensional Analysis**: Corporation, language, protocol, recurrence type
- **Interactive Filtering**: Search, filter, and drill-down capabilities
- **Data Export**: CSV export functionality
- **Real-time Updates**: Refresh from OpenCVE API
- **Validation Tracking**: CVE validation status monitoring

## API Integration (Next Steps)

### OpenCVE API Setup
1. Register at [OpenCVE](https://opencve.io)
2. Get API credentials
3. Update API endpoints in dashboard:
   ```javascript
   // Replace sample data calls with:
   const response = await fetch('https://opencve.io/api/cve?search=ddos', {
     headers: {
       'Authorization': 'Bearer YOUR_API_KEY'
     }
   });
   ```

### Environment Variables
Create `.env` file:
```
REACT_APP_OPENCVE_API_URL=https://opencve.io/api
REACT_APP_OPENCVE_API_KEY=your_api_key_here
```

## Data Structure
The dashboard expects CVE data with these fields:
- `id`: CVE identifier
- `corporation`: Affected company
- `product`: Affected product
- `language`: Programming language
- `protocol`: Network protocol
- `severity`: Severity level
- `score`: CVSS score
- `recurrenceType`: Vulnerability pattern
- `validated`: Validation status

## Deployment Options

### Static Hosting (Standalone HTML)
- GitHub Pages
- Netlify
- Vercel
- Any web server

### React App Deployment
- Vercel: `vercel --prod`
- Netlify: `npm run build` → deploy `build/` folder
- AWS S3 + CloudFront
- Docker container

## Development Roadmap

### Phase 1 (Current)
- ✅ Basic dashboard with sample data
- ✅ Multi-dimensional filtering
- ✅ Interactive charts and tables
- ✅ CSV export

### Phase 2 (Next)
- [ ] OpenCVE API integration
- [ ] Real-time data fetching
- [ ] Advanced search capabilities
- [ ] User authentication

### Phase 3 (Future)
- [ ] Machine learning for recurrence pattern detection
- [ ] Automated CVE validation
- [ ] Notification system
- [ ] API rate limiting and caching
- [ ] Database integration for historical data

## Contributing
1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit pull request

## Support
- GitHub Issues: Report bugs and feature requests
- Documentation: Check README.md for detailed docs
- API Documentation: [OpenCVE API Docs](https://docs.opencve.io/)

## License
MIT License - see LICENSE file for details