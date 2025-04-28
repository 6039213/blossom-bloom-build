
export interface ProjectTemplate {
  type: string;
  displayName: string;
  description: string;
  icon: string;
  fileStructure: string[];
  suggestedDependencies: Record<string, string>;
  defaultPrompt: string;
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
    defaultPrompt: "Create a YouTube clone with a home feed, video player page, and channel profiles."
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
    defaultPrompt: "Create a Twitter clone with a timeline, tweet composer, and user profiles."
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
    defaultPrompt: "Create an e-commerce website with product listings, product details, and a shopping cart."
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
    defaultPrompt: "Create a blog platform with a home page, article pages, and category filtering."
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
`;
};
