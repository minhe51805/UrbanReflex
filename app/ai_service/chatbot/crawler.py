"""
Author: Trần Tuấn Anh
Created at: 2025-11-28
Updated at: 2025-11-30
Description: Web crawler module for collecting data from UrbanReflex website.
             Extracts text content, metadata, and prepares data for embedding.
"""

import asyncio
import aiohttp
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from typing import List, Dict, Set
import time
import os
import json
from app.config.config import WEBSITE_CRAWL_URL


class WebCrawler:
    """
    Web crawler for collecting documentation and content from UrbanReflex website.
    Supports async crawling with rate limiting and content extraction.
    """
    
    def __init__(self, base_url: str = WEBSITE_CRAWL_URL):
        self.base_url = base_url
        self.visited_urls: Set[str] = set()
        self.crawled_data: List[Dict] = []
        self.session = None
        self.rate_limit_delay = 1.0  # seconds between requests
        
    async def __aenter__(self):
        """Async context manager entry."""
        connector = aiohttp.TCPConnector(limit=10, limit_per_host=5)
        timeout = aiohttp.ClientTimeout(total=30)
        self.session = aiohttp.ClientSession(
            connector=connector,
            timeout=timeout,
            headers={'User-Agent': 'UrbanReflex-Bot/1.0'}
        )
        return self
        
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Async context manager exit."""
        if self.session:
            await self.session.close()
    
    def _is_valid_url(self, url: str) -> bool:
        """Check if URL is valid and should be crawled."""
        if not url or url.startswith('#') or url.startswith('mailto:'):
            return False
            
        parsed = urlparse(url)
        if parsed.netloc and parsed.netloc != urlparse(self.base_url).netloc:
            return False
            
        # Skip common non-content URLs but allow help and documentation pages
        skip_patterns = ['/api/', '/admin', '/login', '/register', '.pdf', '.jpg', '.png', '.css', '.js']
        # Always include help and documentation pages
        include_patterns = ['/help', '/docs', '/guide', '/tutorial', '/about', '/introduction']
        
        url_lower = url.lower()
        should_skip = any(pattern in url_lower for pattern in skip_patterns)
        should_include = any(pattern in url_lower for pattern in include_patterns)
        
        return not should_skip or should_include
    
    def _normalize_url(self, url: str) -> str:
        """Normalize URL to absolute form."""
        if url.startswith('/'):
            return urljoin(self.base_url, url)
        elif not url.startswith('http'):
            return urljoin(self.base_url, url)
        return url
    
    def _extract_content(self, soup: BeautifulSoup, url: str) -> Dict:
        """Extract relevant content from HTML page."""
        # Remove script and style elements
        for element in soup(['script', 'style', 'nav', 'footer', 'header']):
            element.decompose()
        
        # Extract title
        title = soup.find('title')
        title_text = title.get_text().strip() if title else ''
        
        # Extract main content with priority for help/documentation
        content_selectors = [
            'main', 'article', '.content', '.documentation',
            '.docs', '#content', '.main-content', '.help-content',
            '.guide', '.tutorial', '.about-section'
        ]
        
        main_content = None
        for selector in content_selectors:
            main_content = soup.select_one(selector)
            if main_content:
                break
        
        if not main_content:
            main_content = soup.find('body')
        
        # Also extract navigation and help links
        nav_links = []
        for nav in soup.find_all(['nav', 'menu', '.navigation']):
            for link in nav.find_all('a', href=True):
                href = link['href']
                if self._is_valid_url(href):
                    nav_links.append(self._normalize_url(href))
        
        # Extract text and clean it
        if main_content:
            text_content = main_content.get_text(separator=' ', strip=True)
            # Clean up whitespace
            text_content = ' '.join(text_content.split())
        else:
            text_content = ''
        
        # Extract metadata
        meta_description = soup.find('meta', attrs={'name': 'description'})
        description = meta_description.get('content', '') if meta_description else ''
        
        # Extract links for further crawling
        links = []
        for link in soup.find_all('a', href=True):
            href = link['href']
            if self._is_valid_url(href):
                links.append(self._normalize_url(href))
        
        return {
            'url': url,
            'title': title_text,
            'description': description,
            'content': text_content,
            'links': links + nav_links,  # Include navigation links
            'crawled_at': time.time(),
            'content_type': self._classify_content_type(title_text, text_content)
        }
    
    def _classify_content_type(self, title: str, content: str) -> str:
        """
        Classify the type of content for better organization.
        
        Args:
            title: Page title
            content: Page content
            
        Returns:
            Content type classification
        """
        title_lower = title.lower()
        content_lower = content.lower()
        
        if any(keyword in title_lower for keyword in ['guide', 'help', 'tutorial', 'how to']):
            return 'help'
        elif any(keyword in title_lower for keyword in ['api', 'endpoint', 'documentation']):
            return 'api'
        elif any(keyword in title_lower for keyword in ['about', 'introduction', 'overview']):
            return 'about'
        elif any(keyword in title_lower for keyword in ['report', 'submit', 'issue']):
            return 'reporting'
        else:
            return 'general'
    
    async def crawl_page(self, url: str) -> Dict:
        """Crawl a single page and extract content."""
        if url in self.visited_urls:
            return None
            
        try:
            await asyncio.sleep(self.rate_limit_delay)  # Rate limiting
            
            async with self.session.get(url) as response:
                if response.status != 200:
                    print(f"Failed to crawl {url}: HTTP {response.status}")
                    return None
                
                html = await response.text()
                soup = BeautifulSoup(html, 'html.parser')
                
                content = self._extract_content(soup, url)
                self.visited_urls.add(url)
                self.crawled_data.append(content)
                
                print(f"Crawled: {url} ({len(content['content'])} chars)")
                return content
                
        except Exception as e:
            print(f"Error crawling {url}: {str(e)}")
            return None
    
    async def crawl_site(self, max_pages: int = 50) -> List[Dict]:
        """
        Crawl the entire website starting from base URL.
        
        Args:
            max_pages: Maximum number of pages to crawl
            
        Returns:
            List of dictionaries containing crawled content
        """
        if not self.base_url:
            raise ValueError("Base URL is required")
        
        print(f"Starting crawl of {self.base_url}")
        
        # Start with the base URL
        urls_to_crawl = [self.base_url]
        crawled_count = 0
        
        while urls_to_crawl and crawled_count < max_pages:
            current_url = urls_to_crawl.pop(0)
            
            if current_url in self.visited_urls:
                continue
            
            content = await self.crawl_page(current_url)
            if content:
                crawled_count += 1
                # Add new URLs to crawl
                for link in content['links']:
                    if link not in self.visited_urls and link not in urls_to_crawl:
                        urls_to_crawl.append(link)
        
        print(f"Crawling completed. Total pages: {len(self.crawled_data)}")
        return self.crawled_data
    
    def save_to_file(self, filename: str = 'crawled_data.json'):
        """Save crawled data to JSON file."""
        os.makedirs(os.path.dirname(filename) if os.path.dirname(filename) else '.', exist_ok=True)
        
        with open(filename, 'w', encoding='utf-8') as f:
            json.dump(self.crawled_data, f, ensure_ascii=False, indent=2)
        
        print(f"Saved {len(self.crawled_data)} pages to {filename}")


async def crawl_website(base_url: str = None, max_pages: int = 50) -> List[Dict]:
    """
    Convenience function to crawl a website.
    
    Args:
        base_url: Base URL to crawl (defaults to config value)
        max_pages: Maximum number of pages to crawl
        
    Returns:
        List of dictionaries containing crawled content
    """
    url = base_url or WEBSITE_CRAWL_URL
    
    async with WebCrawler(url) as crawler:
        return await crawler.crawl_site(max_pages)


if __name__ == "__main__":
    # Example usage
    async def main():
        data = await crawl_website(max_pages=10)
        print(f"Crawled {len(data)} pages")
        
        # Save to file
        os.makedirs('data', exist_ok=True)
        with open('data/crawled_content.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
    
    asyncio.run(main())