/**
 * 外部服务配置
 */
export const EXTERNAL_SERVICES = {
  // 不蒜子统计服务
  busuanzi: {
    scriptUrl: 'https://cdn.dong4j.site/source/static/busuanzi.self.js',
    apiUrl: 'https://api.dong4j.site/busuanzi/api',
    prefix: 'busuanzi',
    style: 'default',
  },
  
  // Umami 分析服务
  umami: {
    scriptUrl: 'https://cdn.dong4j.site/source/static/umami.self.js',
    hostUrl: 'https://umami.dong4j.site',
    websiteId: '1e2e22cc-637c-49e6-aeaf-c2bd0b47f92b',
  },
  
  // 在线计数服务
  onlineCounter: {
    apiUrl: 'https://umami.dong4j.site/counter',
    room: 'spring-ai-cookbook',
    updateInterval: 15000, 
  }
} as const

/**
 * GitHub 仓库配置
 */
export const GITHUB_CONFIG = {
  owner: 'dong4j',
  repo: 'spring-ai-cookbook',
  branch: 'main',
  url: 'https://github.com/dong4j/spring-ai-cookbook',
  get editUrl() {
    return `${this.url}/edit/${this.branch}/docs/:path`
  },
} as const

/**
 * 统计配置
 */
export const ANALYTICS_CONFIG = {
  enableBusuanzi: true,
  enableUmami: true,
  enableOnlineCounter: true,
} as const
