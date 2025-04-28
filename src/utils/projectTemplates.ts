
export interface ProjectTemplate {
  type: string;
  displayName: string;
  description: string;
  icon: string;
  fileStructure: string[];
  suggestedDependencies: Record<string, string>;
  defaultPrompt: string;
  boilerplateCode: Record<string, string>; // Add boilerplate code for each file
}

export const projectTemplates: Record<string, ProjectTemplate> = {
  youtube: {
    type: 'youtube',
    displayName: 'YouTube Clone',
    description: 'Video sharing platform with comments and user channels',
    icon: 'video',
    fileStructure: [
      '/src/pages/HomePage.tsx',
      '/src/pages/WatchPage.tsx',
      '/src/pages/ChannelPage.tsx',
      '/src/components/VideoPlayer.tsx',
      '/src/components/VideoCard.tsx',
      '/src/components/CommentSection.tsx'
    ],
    suggestedDependencies: {
      "react-player": "^2.12.0"
    },
    defaultPrompt: "Create a YouTube clone with a home feed, video player page, and channel profiles.",
    boilerplateCode: {
      '/src/pages/HomePage.tsx': `import React from 'react';

export default function HomePage() {
  return (
    <div>
      <h1>YouTube Clone Home Page</h1>
      <p>This is the home page of your YouTube clone.</p>
    </div>
  );
}`,
      '/src/pages/WatchPage.tsx': `import React from 'react';

export default function WatchPage() {
  return (
    <div>
      <h1>Video Watch Page</h1>
      <p>This is where videos will be watched.</p>
    </div>
  );
}`,
      '/src/pages/ChannelPage.tsx': `import React from 'react';

export default function ChannelPage() {
  return (
    <div>
      <h1>Channel Page</h1>
      <p>This page displays channel information and videos.</p>
    </div>
  );
}`,
      '/src/components/VideoPlayer.tsx': `import React from 'react';

export default function VideoPlayer() {
  return (
    <div className="video-player">
      <div className="video-placeholder">Video Player Placeholder</div>
    </div>
  );
}`,
      '/src/components/VideoCard.tsx': `import React from 'react';

interface VideoCardProps {
  title?: string;
  thumbnail?: string;
  views?: number;
  channelName?: string;
}

export default function VideoCard({
  title = "Video Title",
  thumbnail = "https://via.placeholder.com/320x180",
  views = 0,
  channelName = "Channel Name"
}: VideoCardProps) {
  return (
    <div className="video-card">
      <div className="video-thumbnail">
        <img src={thumbnail} alt={title} />
      </div>
      <div className="video-info">
        <h3>{title}</h3>
        <p>{channelName}</p>
        <p>{views} views</p>
      </div>
    </div>
  );
}`
    }
  },
  twitter: {
    type: 'twitter',
    displayName: 'Twitter Clone',
    description: 'Microblogging platform with tweets and timeline',
    icon: 'message-circle',
    fileStructure: [
      '/src/pages/FeedPage.tsx',
      '/src/pages/ProfilePage.tsx',
      '/src/components/Tweet.tsx',
      '/src/components/TweetComposer.tsx',
      '/src/components/Timeline.tsx'
    ],
    suggestedDependencies: {},
    defaultPrompt: "Create a Twitter clone with a timeline, tweet composer, and user profiles.",
    boilerplateCode: {
      '/src/pages/FeedPage.tsx': `import React from 'react';

export default function FeedPage() {
  return (
    <div>
      <h1>Twitter Clone Feed</h1>
      <p>This is the main feed page of your Twitter clone.</p>
    </div>
  );
}`,
      '/src/pages/ProfilePage.tsx': `import React from 'react';

export default function ProfilePage() {
  return (
    <div>
      <h1>Profile Page</h1>
      <p>This page shows user profile information and tweets.</p>
    </div>
  );
}`
    }
  },
  ecommerce: {
    type: 'ecommerce',
    displayName: 'E-commerce Store',
    description: 'Online shopping platform with product listings and cart',
    icon: 'shopping-cart',
    fileStructure: [
      '/src/pages/StorePage.tsx',
      '/src/pages/ProductPage.tsx',
      '/src/pages/CartPage.tsx',
      '/src/components/ProductCard.tsx',
      '/src/components/CartWidget.tsx',
      '/src/components/Checkout.tsx'
    ],
    suggestedDependencies: {},
    defaultPrompt: "Create an e-commerce website with product listings, product details, and a shopping cart.",
    boilerplateCode: {
      '/src/pages/StorePage.tsx': `import React from 'react';

export default function StorePage() {
  return (
    <div>
      <h1>E-commerce Store</h1>
      <p>Browse our product listings.</p>
    </div>
  );
}`,
      '/src/pages/ProductPage.tsx': `import React from 'react';

export default function ProductPage() {
  return (
    <div>
      <h1>Product Details</h1>
      <p>This page displays detailed information about a product.</p>
    </div>
  );
}`,
      '/src/pages/CartPage.tsx': `import React from 'react';

export default function CartPage() {
  return (
    <div>
      <h1>Shopping Cart</h1>
      <p>View the items in your shopping cart.</p>
    </div>
  );
}`
    }
  },
  blog: {
    type: 'blog',
    displayName: 'Blog Platform',
    description: 'Content publishing platform with articles and categories',
    icon: 'book-open',
    fileStructure: [
      '/src/pages/BlogHome.tsx',
      '/src/pages/ArticlePage.tsx',
      '/src/pages/CategoryPage.tsx',
      '/src/components/ArticleCard.tsx',
      '/src/components/CategoryList.tsx'
    ],
    suggestedDependencies: {
      "react-markdown": "^8.0.7"
    },
    defaultPrompt: "Create a blog platform with a home page, article pages, and category filtering.",
    boilerplateCode: {
      '/src/pages/BlogHome.tsx': `import React from 'react';

export default function BlogHome() {
  return (
    <div>
      <h1>Blog Home</h1>
      <p>Welcome to our blog platform.</p>
    </div>
  );
}`,
      '/src/pages/ArticlePage.tsx': `import React from 'react';

export default function ArticlePage() {
  return (
    <div>
      <h1>Article Page</h1>
      <p>This page displays a full blog article.</p>
    </div>
  );
}`,
      '/src/pages/CategoryPage.tsx': `import React from 'react';

export default function CategoryPage() {
  return (
    <div>
      <h1>Category Page</h1>
      <p>This page shows articles filtered by category.</p>
    </div>
  );
}`
    }
  }
};

export const detectProjectType = (prompt: string): string | null => {
  prompt = prompt.toLowerCase();
  
  // Check for explicit mentions of project types
  for (const [type, template] of Object.entries(projectTemplates)) {
    if (prompt.includes(`${type} clone`) || 
        prompt.includes(`like ${type}`) || 
        prompt.includes(`similar to ${type}`)) {
      return type;
    }
  }
  
  // Check for keywords
  if (prompt.includes('video') || prompt.includes('watch') || prompt.includes('channel')) {
    return 'youtube';
  }
  if (prompt.includes('tweet') || prompt.includes('timeline') || prompt.includes('microblog')) {
    return 'twitter';
  }
  if (prompt.includes('product') || prompt.includes('shop') || prompt.includes('cart') || 
      prompt.includes('store') || prompt.includes('purchase')) {
    return 'ecommerce';
  }
  if (prompt.includes('blog') || prompt.includes('article') || prompt.includes('post') || 
      prompt.includes('content') || prompt.includes('publish')) {
    return 'blog';
  }
  
  return null;
};

export const getTemplatePrompt = (projectType: string | null): string => {
  if (!projectType || !projectTemplates[projectType]) {
    return '';
  }
  
  const template = projectTemplates[projectType];
  
  return `
This should be a ${template.displayName} application.
Please follow these specific file naming conventions:

${template.fileStructure.join('\n')}

Ensure these key files are implemented properly as they are essential for this type of application.

IMPORTANT: All imports should use the @/ prefix for paths from the src directory.
For example, use: import Component from '@/components/Component';
`;
};

// New function to create default files based on template
export const createDefaultFilesForTemplate = (projectType: string | null): Record<string, { code: string }> => {
  if (!projectType || !projectTemplates[projectType]) {
    return {};
  }
  
  const template = projectTemplates[projectType];
  const files: Record<string, { code: string }> = {};
  
  // Add boilerplate files from the template
  Object.entries(template.boilerplateCode).forEach(([filePath, code]) => {
    files[filePath] = { code };
  });
  
  // Add additional necessary files that might be missing
  // App.tsx with imports for the template routes
  files['/src/App.tsx'] = { code: generateAppTsx(projectType) };
  
  // Add index files
  files['/src/index.tsx'] = { 
    code: `import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/globals.scss';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);` 
  };
  
  // Add a basic global styles file
  files['/src/styles/globals.scss'] = {
    code: `body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

// Basic styling for ${projectType} template
`
  };
  
  return files;
};

// Helper to generate App.tsx content based on project type
function generateAppTsx(projectType: string): string {
  const template = projectTemplates[projectType];
  
  // Extract page components from fileStructure
  const pageFiles = template.fileStructure.filter(file => file.includes('/pages/'));
  
  let imports = `import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
`;

  // Add imports for each page
  pageFiles.forEach(file => {
    const componentName = file.split('/').pop()?.replace('.tsx', '');
    if (componentName) {
      imports += `import ${componentName} from '${file.replace('/src', '@')}';
`;
    }
  });

  // Build routes based on the pages
  let routes = '';
  pageFiles.forEach((file, index) => {
    const componentName = file.split('/').pop()?.replace('.tsx', '');
    const path = index === 0 ? '/' : file.split('/').pop()?.replace('Page.tsx', '').toLowerCase();
    
    if (componentName) {
      routes += `          <Route path="${path}" element={<${componentName} />} />\n`;
    }
  });

  return `${imports}
export default function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
${routes}        </Routes>
      </div>
    </Router>
  );
}`;
}
