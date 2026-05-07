"""
AI News Engine FINAL - Dengan Text Cleaner
"""

import time
import requests
import feedparser
import re
import html
from html.parser import HTMLParser
from urllib.parse import urlparse

class MLStripper(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
    def handle_data(self, d):
        self.text.append(d)
    def get_data(self):
        return ' '.join(self.text)

def clean_html(html_text):
    s = MLStripper()
    s.feed(html_text)
    return s.get_data()

def clean_text(text):
    """Bersihkan teks dari HTML entities, SVG, CSS, dan karakter aneh"""
    if not text:
        return text
    
    # 1. Unescape HTML entities
    text = html.unescape(text)
    
    # 2. HAPUS SEMUA TAG SVG (yang paling mengganggu)
    text = re.sub(r'<svg[^>]*>.*?</svg>', '', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<path[^>]*/>', '', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<path[^>]*>.*?</path>', '', text, flags=re.DOTALL | re.IGNORECASE)
    
    # 3. Hapus semua tag HTML (termasuk div, span, button, dll)
    text = re.sub(r'<[^>]+>', ' ', text)
    
    # 4. Hapus CSS inline dan JavaScript
    text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r'<script[^>]*>.*?</script>', '', text, flags=re.DOTALL | re.IGNORECASE)
    
    # 5. Hapus karakter kontrol dan non-printable (tapi retain newline dan tab)
    text = ''.join(char for char in text if char.isprintable() or char in '\n\t ')
    
    # 6. Hapus BBC navigation noise (yang panjang)
    noise_patterns = [
        r'British Broadcasting Corporation\s+Home\s+News\s+Sport.*?Live\s+Sport',
        r'BBC News\s*\|\s*',
        r'Watch:\s*',
        r'Read more\s*',
        r'Share\s+Save\s+Add as preferred on Google',
        r'\d+\s+minutes?\s+ago',
        r'\d+\s+hours?\s+ago',
        r'Getty Images',
        r'Reuters',
        r'EPA',
        r'AP',
        r'<svg[\s\S]*?</svg>',  # SVG tags
        r'<path[\s\S]*?/>',      # Path tags
        r'className="[^"]*"',    # React className
        r'data-testid="[^"]*"',  # Test IDs
        r'fill-rule="[^"]*"',    # SVG attributes
        r'clip-rule="[^"]*"',    # SVG attributes
        r'fill="[^"]*"',         # Fill attributes
        r'viewBox="[^"]*"',      # ViewBox attributes
    ]
    
    for pattern in noise_patterns:
        text = re.sub(pattern, '', text, flags=re.IGNORECASE | re.DOTALL)
    
    # 7. Hapus multiple spaces dan newlines
    text = re.sub(r'\s+', ' ', text)
    
    # 8. Bersihkan spasi sebelum tanda baca
    text = re.sub(r'\s+([\.\,\!\?\;\:])', r'\1', text)
    
    # 9. Hapus URL yang tidak diperlukan
    text = re.sub(r'https?://\S+', '', text)
    
    # 10. Hapus karakter aneh yang tersisa (non-alphabet, non-space, non-punctuation umum)
    # Tapi pertahankan huruf, angka, spasi, dan tanda baca dasar
    text = re.sub(r'[^\w\s\.\,\!\?\;\:\'\"\(\)\-]', ' ', text)
    
    # 11. Bersihkan multiple spaces lagi
    text = re.sub(r'\s+', ' ', text)
    
    # 12. Hapus spasi di awal dan akhir
    text = text.strip()
    
    return text

class AIEngineFinal:
    def __init__(self):
        self.api_url = "http://localhost:5000/api/articles"
        # SUMBER YANG BISA DIACCESS
        self.rss_feeds = [
            # BBC - WORKING
            "http://feeds.bbci.co.uk/news/rss.xml",
            "http://feeds.bbci.co.uk/news/world/rss.xml",
            "http://feeds.bbci.co.uk/news/technology/rss.xml",
            "http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml",
            
            # Al Jazeera - WORKING  
            "https://www.aljazeera.com/xml/rss/all.xml",
            
            # Reuters - WORKING
            "https://www.reutersagency.com/feed/",
            "http://feeds.reuters.com/reuters/topNews",
        ]
        
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        })
    
    def is_valid_url(self, url):
        """Cek apakah URL bisa diakses"""
        blocked = ['news.google.com', 'nytimes.com', 'wsj.com', 'washingtonpost.com']
        return not any(b in url for b in blocked)
    
    def fetch_news(self):
        """Fetch news dari RSS feeds yang reliable"""
        articles = []
        
        print("  📡 Fetching from sources...")
        for feed_url in self.rss_feeds:
            try:
                feed = feedparser.parse(feed_url)
                
                if feed.entries:
                    for entry in feed.entries[:2]:
                        if self.is_valid_url(entry.link):
                            # Bersihkan title juga
                            clean_title = clean_text(entry.title)
                            articles.append({
                                'title': clean_title,
                                'url': entry.link,
                                'source': feed_url.split('/')[2]
                            })
                    print(f"     ✓ {feed_url.split('/')[2]}: {len(feed.entries[:2])} articles")
                else:
                    print(f"     ✗ {feed_url.split('/')[2]}: No entries")
                    
            except Exception as e:
                print(f"     ✗ {feed_url.split('/')[2]}: {str(e)[:30]}")
        
        return articles
    
    def scrape_article(self, url):
        """Extract article content dengan cleaning"""
        try:
            print(f"    🌐 Fetching...")
            
            resp = self.session.get(url, timeout=15, allow_redirects=True)
            
            if resp.status_code != 200:
                print(f"    ⚠️  HTTP {resp.status_code}")
                return None
            
            content = resp.text
            
            # Extract title
            title_match = re.search(r'<title>(.*?)</title>', content, re.DOTALL | re.IGNORECASE)
            title = title_match.group(1).strip() if title_match else "No Title"
            title = clean_text(title)
            
            # Extract content from paragraphs
            paragraphs = re.findall(r'<p[^>]*>(.*?)</p>', content, re.DOTALL | re.IGNORECASE)
            
            if not paragraphs:
                print(f"    ⚠️  No paragraphs found")
                return None
            
            # Gabungkan dan bersihkan
            raw_content = ' '.join(paragraphs)
            clean_content = clean_text(raw_content)
            
            # Extract image
            img_patterns = [
                r'<meta[^>]*property="og:image"[^>]*content="([^"]+)"',
                r'<img[^>]*src="([^"]+\.(?:jpg|jpeg|png|webp))"[^>]*>',
            ]
            
            image = ""
            for pattern in img_patterns:
                match = re.search(pattern, content, re.IGNORECASE)
                if match:
                    image = match.group(1)
                    if not image.startswith('http'):
                        parsed = urlparse(url)
                        image = f"{parsed.scheme}://{parsed.netloc}{image}"
                    break
            
            if len(clean_content) < 200:
                print(f"    ⚠️  Too short: {len(clean_content)} chars")
                return None
            
            # Batasi panjang konten (tapi tetap readable)
            if len(clean_content) > 4000:
                clean_content = clean_content[:4000]
            
            print(f"    ✅ Extracted: {len(clean_content)} chars")
            
            return {
                'title': title[:200],
                'content': clean_content,
                'image': image
            }
            
        except Exception as e:
            print(f"    ❌ Error: {str(e)[:40]}")
            return None
    
    def publish(self, article):
        """Publish ke web app"""
        try:
            response = self.session.post(self.api_url, json=article, timeout=10)
            return response.status_code == 201
        except Exception as e:
            print(f"    ❌ Publish error: {e}")
            return False

def is_valid_content(content):
        """Cek apakah konten layak publish"""
        if not content:
            return False
    
        # Minimal 300 karakter
        if len(content) < 300:
            return False
    
        # Hitung berapa banyak kalimat
        sentences = re.findall(r'[.!?]+', content)
        if len(sentences) < 3:
            return False
    
        # Cek rasio teks vs kode (jika masih banyak karakter aneh)
        clean_chars = len(re.sub(r'[^\w\s\.\,\!\?\;\:\'\"]', '', content))
        ratio = clean_chars / len(content) if len(content) > 0 else 0
    
        if ratio < 0.7:  # Lebih dari 30% karakter aneh
            return False
    
        return True


def scrape_article(self, url):
    """Extract article content dengan cleaning agresif"""
    try:
        print(f"    🌐 Fetching...")
        
        resp = self.session.get(url, timeout=15, allow_redirects=True)
        
        if resp.status_code != 200:
            print(f"    ⚠️  HTTP {resp.status_code}")
            return None
        
        content = resp.text
        
        # Extract title
        title_match = re.search(r'<title>(.*?)</title>', content, re.DOTALL | re.IGNORECASE)
        title = title_match.group(1).strip() if title_match else "No Title"
        title = clean_text(title)
        
        # Coba extract dari article tag terlebih dahulu
        article_match = re.search(r'<article[^>]*>(.*?)</article>', content, re.DOTALL | re.IGNORECASE)
        if article_match:
            main_content = article_match.group(1)
        else:
            # Fallback: ambil semua paragraph
            paragraphs = re.findall(r'<p[^>]*>(.*?)</p>', content, re.DOTALL | re.IGNORECASE)
            main_content = ' '.join(paragraphs) if paragraphs else ""
        
        if not main_content:
            print(f"    ⚠️  No content found")
            return None
        
        # Bersihkan konten
        clean_content = clean_text(main_content)
        
        # Filter konten yang tidak layak
        if not is_valid_content(clean_content):
            print(f"    ⚠️  Content not valid (too short or low quality)")
            return None
        
        # Extract image
        img_patterns = [
            r'<meta[^>]*property="og:image"[^>]*content="([^"]+)"',
            r'<img[^>]*src="([^"]+\.(?:jpg|jpeg|png|webp))"[^>]*>',
        ]
        
        image = ""
        for pattern in img_patterns:
            match = re.search(pattern, content, re.IGNORECASE)
            if match:
                image = match.group(1)
                if not image.startswith('http'):
                    parsed = urlparse(url)
                    image = f"{parsed.scheme}://{parsed.netloc}{image}"
                break
        
        # Batasi panjang konten
        if len(clean_content) > 4000:
            clean_content = clean_content[:4000]
        
        print(f"    ✅ Extracted: {len(clean_content)} chars (valid content)")
        
        return {
            'title': title[:200],
            'content': clean_content,
            'image': image
        }
        
    except Exception as e:
        print(f"    ❌ Error: {str(e)[:40]}")
        return None


    
    def run(self, max_articles=5):
        """Main loop"""
        print("\n" + "="*60)
        print("🤖 AI MEDIA ENGINE FINAL (Dengan Text Cleaner)")
        print("="*60)
        print(f"Target: {max_articles} articles\n")
        
        # Check web server
        try:
            self.session.get("http://localhost:5000/api/health", timeout=5)
            print("✅ Web server running\n")
        except:
            print("❌ Web server NOT running!")
            print("Start web server first: py app.py")
            return 0
        
        # Fetch news
        print("📰 Fetching news from reliable sources...\n")
        news_list = self.fetch_news()
        
        if not news_list:
            print("\n❌ No news found!")
            return 0
        
        # Remove duplicates
        seen = set()
        unique_news = []
        for news in news_list:
            if news['title'] not in seen:
                seen.add(news['title'])
                unique_news.append(news)
        
        print(f"\n📊 Total unique: {len(unique_news)} articles")
        print(f"🎯 Will process: {min(max_articles, len(unique_news))}\n")
        print("🔍 Processing articles...\n")
        
        published = 0
        failed = 0
        
        for i, news in enumerate(unique_news[:max_articles], 1):
            print(f"[{i}/{max_articles}]")
            print(f"  Title: {news['title'][:60]}...")
            
            article = self.scrape_article(news['url'])
            
            if not article:
                failed += 1
                print("  ⏭️  Skipped\n")
                continue
            
            if self.publish(article):
                published += 1
                print(f"  ✅ Published!\n")
            else:
                failed += 1
                print(f"  ❌ Failed\n")
            
            time.sleep(2)
        
        print(f"{'='*60}")
        print(f"✅ DONE!")
        print(f"   📝 Published: {published}")
        print(f"   ⏭️  Skipped: {failed}")
        print(f"{'='*60}\n")
        
        if published > 0:
            print(f"🌐 View articles at: http://localhost:5000")
        
        return published

if __name__ == "__main__":
    import sys
    max_n = int(sys.argv[1]) if len(sys.argv) > 1 else 5
    engine = AIEngineFinal()
    engine.run(max_n)