#!/bin/bash

# ============================================================
#   AI SEO AUTO ARTICLE ENGINE PRO v2.0
#   by: Laravel Expert & SEO Strategist
#   Fitur: Multi-AI, Queue, SEO Engine, Admin Panel, Analytics
# ============================================================

set -e  # Stop on error

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

PROJECT=${1:-"ai-seo-engine-pro"}

banner() {
echo -e "${CYAN}"
cat << 'BANNER'
 █████╗ ██╗    ███████╗███████╗ ██████╗     ███████╗███╗   ██╗ ██████╗ ██╗███╗   ██╗███████╗
██╔══██╗██║    ██╔════╝██╔════╝██╔═══██╗    ██╔════╝████╗  ██║██╔════╝ ██║████╗  ██║██╔════╝
███████║██║    ███████╗█████╗  ██║   ██║    █████╗  ██╔██╗ ██║██║  ███╗██║██╔██╗ ██║█████╗
██╔══██║██║    ╚════██║██╔══╝  ██║   ██║    ██╔══╝  ██║╚██╗██║██║   ██║██║██║╚██╗██║██╔══╝
██║  ██║██║    ███████║███████╗╚██████╔╝    ███████╗██║ ╚████║╚██████╔╝██║██║ ╚████║███████╗
╚═╝  ╚═╝╚═╝    ╚══════╝╚══════╝ ╚═════╝     ╚══════╝╚═╝  ╚═══╝ ╚═════╝ ╚═╝╚═╝  ╚═══╝╚══════╝
BANNER
echo -e "${NC}"
echo -e "${GREEN}  ██████╗ ██████╗  ██████╗     ██╗   ██╗██████╗     ██████╗ ${NC}"
echo -e "${GREEN}  ██╔══██╗██╔══██╗██╔═══██╗    ██║   ██║╚════██╗   ██╔═████╗${NC}"
echo -e "${GREEN}  ██████╔╝██████╔╝██║   ██║    ██║   ██║ █████╔╝   ██║██╔██║${NC}"
echo -e "${GREEN}  ██╔═══╝ ██╔══██╗██║   ██║    ╚██╗ ██╔╝██╔═══╝    ████╔╝██║${NC}"
echo -e "${GREEN}  ██║     ██║  ██║╚██████╔╝     ╚████╔╝ ███████╗██╗╚██████╔╝${NC}"
echo -e "${GREEN}  ╚═╝     ╚═╝  ╚═╝ ╚═════╝       ╚═══╝  ╚══════╝╚═╝ ╚═════╝ ${NC}"
echo ""
echo -e "${YELLOW}  Fitur: Multi-AI Provider | Queue System | SEO Engine Lengkap${NC}"
echo -e "${YELLOW}  Admin Panel | Analytics | Schema.org | Auto Sitemap | RSS Feed${NC}"
echo ""
echo -e "${BLUE}  Project: ${PROJECT}${NC}"
echo -e "${BLUE}  ========================================${NC}"
echo ""
}

step() { echo -e "\n${CYAN}▶ $1${NC}"; }
ok()   { echo -e "${GREEN}  ✓ $1${NC}"; }
warn() { echo -e "${YELLOW}  ⚠ $1${NC}"; }
fail() { echo -e "${RED}  ✗ $1${NC}"; exit 1; }

banner

# ============================================================
# 1. CREATE LARAVEL PROJECT
# ============================================================

step "Membuat Laravel Project..."
composer create-project laravel/laravel "$PROJECT" --prefer-dist || fail "Gagal membuat project"
cd "$PROJECT"
ok "Laravel project dibuat"

# ============================================================
# 2. INSTALL PACKAGES
# ============================================================

step "Menginstall packages..."
composer require guzzlehttp/guzzle
composer require spatie/laravel-sitemap
composer require spatie/laravel-feed
composer require intervention/image:"^3.0"
composer require league/html-to-markdown
composer require illuminate/queue

php artisan key:generate
ok "Packages terinstall"

# ============================================================
# 3. BUAT DIREKTORI STRUKTUR
# ============================================================

step "Membuat struktur direktori..."
mkdir -p app/Services/AI
mkdir -p app/Services/SEO
mkdir -p app/Services/Scraper
mkdir -p app/Services/InternalLink
mkdir -p app/Services/Analytics
mkdir -p app/Services/Image
mkdir -p app/Console/Commands
mkdir -p app/Enums
mkdir -p app/Http/Middleware
mkdir -p resources/views/layouts
mkdir -p resources/views/blog
mkdir -p resources/views/admin
mkdir -p resources/views/components
mkdir -p public/uploads/thumbnails
ok "Direktori siap"

# ============================================================
# 4. ENUMS
# ============================================================

step "Membuat Enums..."

cat > app/Enums/ArticleStatus.php << 'ENUM_EOF'
<?php
namespace App\Enums;

enum ArticleStatus: string
{
    case Draft     = 'draft';
    case Queue     = 'queue';
    case Generating = 'generating';
    case Review    = 'review';
    case Published = 'published';
    case Failed    = 'failed';

    public function label(): string
    {
        return match($this) {
            self::Draft      => '📝 Draft',
            self::Queue      => '⏳ Antri',
            self::Generating => '🤖 Generating...',
            self::Review     => '👀 Review',
            self::Published  => '✅ Published',
            self::Failed     => '❌ Gagal',
        };
    }

    public function color(): string
    {
        return match($this) {
            self::Draft      => 'gray',
            self::Queue      => 'yellow',
            self::Generating => 'blue',
            self::Review     => 'purple',
            self::Published  => 'green',
            self::Failed     => 'red',
        };
    }
}
ENUM_EOF

cat > app/Enums/AIProvider.php << 'ENUM_EOF'
<?php
namespace App\Enums;

enum AIProvider: string
{
    case OpenAI    = 'openai';
    case Claude    = 'claude';
    case Gemini    = 'gemini';
    case Groq      = 'groq';

    public function label(): string
    {
        return match($this) {
            self::OpenAI  => 'OpenAI GPT-4',
            self::Claude  => 'Anthropic Claude',
            self::Gemini  => 'Google Gemini',
            self::Groq    => 'Groq (Fast)',
        };
    }
}
ENUM_EOF

ok "Enums dibuat"

# ============================================================
# 5. CONFIG
# ============================================================

step "Membuat config file..."

cat > config/ai_engine.php << 'CONFIG_EOF'
<?php

return [

    /*
    |--------------------------------------------------------------------------
    | AI SEO Engine Configuration
    |--------------------------------------------------------------------------
    */

    'default_provider' => env('AI_PROVIDER', 'openai'),

    'providers' => [
        'openai' => [
            'api_key' => env('OPENAI_API_KEY'),
            'model'   => env('OPENAI_MODEL', 'gpt-4o'),
            'url'     => 'https://api.openai.com/v1/chat/completions',
        ],
        'claude' => [
            'api_key' => env('ANTHROPIC_API_KEY'),
            'model'   => env('CLAUDE_MODEL', 'claude-3-5-sonnet-20241022'),
            'url'     => 'https://api.anthropic.com/v1/messages',
        ],
        'gemini' => [
            'api_key' => env('GEMINI_API_KEY'),
            'model'   => env('GEMINI_MODEL', 'gemini-1.5-pro'),
            'url'     => 'https://generativelanguage.googleapis.com/v1beta/models',
        ],
        'groq' => [
            'api_key' => env('GROQ_API_KEY'),
            'model'   => env('GROQ_MODEL', 'llama-3.3-70b-versatile'),
            'url'     => 'https://api.groq.com/openai/v1/chat/completions',
        ],
    ],

    'article' => [
        'min_words'        => env('ARTICLE_MIN_WORDS', 1500),
        'max_words'        => env('ARTICLE_MAX_WORDS', 2500),
        'language'         => env('ARTICLE_LANGUAGE', 'id'), // id = Bahasa Indonesia
        'internal_links'   => env('ARTICLE_INTERNAL_LINKS', 3),
        'auto_publish'     => env('ARTICLE_AUTO_PUBLISH', false),
        'generate_image'   => env('ARTICLE_GENERATE_IMAGE', true),
        'image_provider'   => env('IMAGE_PROVIDER', 'unsplash'), // unsplash | dalle | pexels
        'unsplash_key'     => env('UNSPLASH_ACCESS_KEY'),
        'pexels_key'       => env('PEXELS_API_KEY'),
    ],

    'seo' => [
        'site_name'        => env('SITE_NAME', 'AI SEO Blog'),
        'site_url'         => env('APP_URL', 'http://localhost'),
        'default_og_image' => env('DEFAULT_OG_IMAGE', '/images/og-default.jpg'),
        'twitter_handle'   => env('TWITTER_HANDLE', '@yourhandle'),
        'google_analytics' => env('GOOGLE_ANALYTICS_ID'),
        'google_search_console_verify' => env('GSC_VERIFY_CODE'),
        'schema_org_type'  => 'Article',
        'auto_sitemap'     => env('AUTO_SITEMAP', true),
    ],

    'queue' => [
        'connection'   => env('QUEUE_CONNECTION', 'database'),
        'max_attempts' => 3,
        'retry_after'  => 300,
        'delay_seconds'=> env('ARTICLE_GENERATE_DELAY', 5),
    ],

    'keyword' => [
        'auto_suggest'     => env('KEYWORD_AUTO_SUGGEST', true),
        'suggest_limit'    => env('KEYWORD_SUGGEST_LIMIT', 10),
        'schedule_enabled' => env('KEYWORD_SCHEDULE', true),
        'schedule_cron'    => env('KEYWORD_CRON', '0 8 * * *'), // Every day 08:00
    ],

];
CONFIG_EOF

ok "Config dibuat"

# ============================================================
# 6. MIGRATIONS
# ============================================================

step "Membuat migrations..."

cat > database/migrations/2024_01_01_000001_create_categories_table.php << 'MIG_EOF'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();
            $table->string('og_image')->nullable();
            $table->integer('article_count')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('categories'); }
};
MIG_EOF

cat > database/migrations/2024_01_01_000002_create_keywords_table.php << 'MIG_EOF'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('keywords', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('keyword');
            $table->string('language', 10)->default('id');
            $table->integer('search_volume')->nullable();
            $table->decimal('keyword_difficulty', 5, 2)->nullable();
            $table->string('ai_provider')->default('openai');
            $table->enum('status', ['pending','processing','done','failed'])->default('pending');
            $table->string('focus_tone')->default('informatif'); // informatif|persuasif|review|berita
            $table->integer('target_words')->default(1500);
            $table->json('lsi_keywords')->nullable();       // related keywords
            $table->json('competitor_urls')->nullable();    // for reference
            $table->integer('priority')->default(5);        // 1-10
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('generated_at')->nullable();
            $table->text('error_message')->nullable();
            $table->timestamps();

            $table->index(['status', 'priority', 'scheduled_at']);
        });
    }

    public function down(): void { Schema::dropIfExists('keywords'); }
};
MIG_EOF

cat > database/migrations/2024_01_01_000003_create_articles_table.php << 'MIG_EOF'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('articles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('keyword_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('headline')->nullable();          // Sub-judul menarik
            $table->text('excerpt')->nullable();             // Ringkasan 160 karakter
            $table->longText('content');
            $table->longText('content_html')->nullable();    // Rendered HTML
            $table->string('featured_image')->nullable();
            $table->string('featured_image_alt')->nullable();
            $table->string('ai_provider')->nullable();

            // SEO Fields
            $table->string('meta_title')->nullable();
            $table->text('meta_description')->nullable();    // Max 160 chars
            $table->text('meta_keywords')->nullable();
            $table->string('canonical_url')->nullable();
            $table->string('og_title')->nullable();
            $table->text('og_description')->nullable();
            $table->string('og_image')->nullable();
            $table->string('twitter_title')->nullable();
            $table->text('twitter_description')->nullable();
            $table->json('schema_org')->nullable();          // JSON-LD data
            $table->json('faq_schema')->nullable();          // FAQ Schema data
            $table->json('breadcrumbs')->nullable();

            // Analytics
            $table->integer('view_count')->default(0);
            $table->integer('unique_view_count')->default(0);
            $table->integer('share_count')->default(0);
            $table->decimal('avg_time_on_page', 8, 2)->default(0);
            $table->integer('word_count')->default(0);
            $table->decimal('readability_score', 5, 2)->default(0);
            $table->decimal('seo_score', 5, 2)->default(0);

            // Status
            $table->string('status')->default('draft');
            $table->boolean('indexed')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamp('indexed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'published_at']);
            $table->index('slug');
        });
    }

    public function down(): void { Schema::dropIfExists('articles'); }
};
MIG_EOF

cat > database/migrations/2024_01_01_000004_create_article_views_table.php << 'MIG_EOF'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('article_views', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained()->cascadeOnDelete();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('referer')->nullable();
            $table->string('country', 10)->nullable();
            $table->string('device_type', 20)->nullable(); // mobile|desktop|tablet
            $table->integer('time_on_page')->default(0);   // seconds
            $table->timestamps();

            $table->index(['article_id', 'created_at']);
        });
    }

    public function down(): void { Schema::dropIfExists('article_views'); }
};
MIG_EOF

cat > database/migrations/2024_01_01_000005_create_internal_links_table.php << 'MIG_EOF'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('internal_links', function (Blueprint $table) {
            $table->id();
            $table->foreignId('source_article_id')->constrained('articles')->cascadeOnDelete();
            $table->foreignId('target_article_id')->constrained('articles')->cascadeOnDelete();
            $table->string('anchor_text');
            $table->string('context')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('internal_links'); }
};
MIG_EOF

cat > database/migrations/2024_01_01_000006_create_settings_table.php << 'MIG_EOF'
<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('settings', function (Blueprint $table) {
            $table->id();
            $table->string('key')->unique();
            $table->text('value')->nullable();
            $table->string('type')->default('string'); // string|boolean|integer|json
            $table->string('group')->default('general');
            $table->timestamps();
        });
    }

    public function down(): void { Schema::dropIfExists('settings'); }
};
MIG_EOF

ok "Migrations dibuat"

# ============================================================
# 7. MODELS
# ============================================================

step "Membuat Models..."

cat > app/Models/Category.php << 'MODEL_EOF'
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Category extends Model
{
    protected $fillable = ['name', 'slug', 'description', 'meta_title', 'meta_description', 'og_image', 'article_count', 'active'];

    public function keywords(): HasMany { return $this->hasMany(Keyword::class); }

    public function articles(): HasMany { return $this->hasMany(Article::class); }

    public function getUrlAttribute(): string
    {
        return route('category.show', $this->slug);
    }
}
MODEL_EOF

cat > app/Models/Keyword.php << 'MODEL_EOF'
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Keyword extends Model
{
    protected $fillable = [
        'category_id', 'keyword', 'language', 'search_volume', 'keyword_difficulty',
        'ai_provider', 'status', 'focus_tone', 'target_words', 'lsi_keywords',
        'competitor_urls', 'priority', 'scheduled_at', 'generated_at', 'error_message'
    ];

    protected $casts = [
        'lsi_keywords'    => 'array',
        'competitor_urls' => 'array',
        'scheduled_at'    => 'datetime',
        'generated_at'    => 'datetime',
    ];

    public function category(): BelongsTo { return $this->belongsTo(Category::class); }

    public function article(): HasOne { return $this->hasOne(Article::class); }

    public function scopePending($query) { return $query->where('status', 'pending'); }

    public function scopeByPriority($query) { return $query->orderBy('priority', 'desc')->orderBy('scheduled_at'); }
}
MODEL_EOF

cat > app/Models/Article.php << 'MODEL_EOF'
<?php
namespace App\Models;

use App\Enums\ArticleStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Article extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'keyword_id', 'category_id', 'title', 'slug', 'headline', 'excerpt', 'content',
        'content_html', 'featured_image', 'featured_image_alt', 'ai_provider',
        'meta_title', 'meta_description', 'meta_keywords', 'canonical_url',
        'og_title', 'og_description', 'og_image', 'twitter_title', 'twitter_description',
        'schema_org', 'faq_schema', 'breadcrumbs', 'view_count', 'unique_view_count',
        'share_count', 'avg_time_on_page', 'word_count', 'readability_score', 'seo_score',
        'status', 'indexed', 'published_at', 'indexed_at',
    ];

    protected $casts = [
        'schema_org'   => 'array',
        'faq_schema'   => 'array',
        'breadcrumbs'  => 'array',
        'published_at' => 'datetime',
        'indexed_at'   => 'datetime',
        'indexed'      => 'boolean',
    ];

    protected $dates = ['deleted_at'];

    // Relations
    public function keyword(): BelongsTo  { return $this->belongsTo(Keyword::class); }
    public function category(): BelongsTo { return $this->belongsTo(Category::class); }
    public function views(): HasMany      { return $this->hasMany(ArticleView::class); }

    // Scopes
    public function scopePublished($query)
    {
        return $query->where('status', 'published')->where('published_at', '<=', now());
    }

    public function scopeByCategory($query, $categoryId)
    {
        return $query->where('category_id', $categoryId);
    }

    // Helpers
    public function getUrlAttribute(): string
    {
        return route('article.show', $this->slug);
    }

    public function getReadingTimeAttribute(): int
    {
        return (int) ceil($this->word_count / 200); // 200 words per minute
    }

    public function isPublished(): bool
    {
        return $this->status === 'published';
    }

    public function incrementView(): void
    {
        $this->increment('view_count');
    }

    protected static function booted(): void
    {
        static::creating(function ($article) {
            if (empty($article->canonical_url)) {
                $article->canonical_url = config('app.url') . '/blog/' . $article->slug;
            }
        });
    }
}
MODEL_EOF

cat > app/Models/ArticleView.php << 'MODEL_EOF'
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ArticleView extends Model
{
    protected $fillable = ['article_id', 'ip_address', 'user_agent', 'referer', 'country', 'device_type', 'time_on_page'];

    public function article(): BelongsTo { return $this->belongsTo(Article::class); }
}
MODEL_EOF

cat > app/Models/Setting.php << 'MODEL_EOF'
<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = ['key', 'value', 'type', 'group'];

    public static function get(string $key, mixed $default = null): mixed
    {
        return Cache::remember("setting_{$key}", 3600, function () use ($key, $default) {
            $setting = static::where('key', $key)->first();
            return $setting ? $setting->getCastedValue() : $default;
        });
    }

    public static function set(string $key, mixed $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => is_array($value) ? json_encode($value) : $value]);
        Cache::forget("setting_{$key}");
    }

    protected function getCastedValue(): mixed
    {
        return match($this->type) {
            'boolean' => (bool) $this->value,
            'integer' => (int) $this->value,
            'json'    => json_decode($this->value, true),
            default   => $this->value,
        };
    }
}
MODEL_EOF

ok "Models dibuat"

# ============================================================
# 8. AI SERVICE (MULTI-PROVIDER)
# ============================================================

step "Membuat AI Service (Multi-Provider)..."

cat > app/Services/AI/AIContentService.php << 'AI_EOF'
<?php
namespace App\Services\AI;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Enums\AIProvider;

class AIContentService
{
    private string $provider;
    private array  $config;

    public function __construct(string $provider = null)
    {
        $this->provider = $provider ?? config('ai_engine.default_provider', 'openai');
        $this->config   = config("ai_engine.providers.{$this->provider}", []);
    }

    /**
     * Generate full SEO article
     */
    public function generateArticle(string $keyword, array $options = []): array
    {
        $language   = $options['language']   ?? 'id';
        $tone       = $options['tone']       ?? 'informatif';
        $wordCount  = $options['word_count'] ?? 1500;
        $lsi        = $options['lsi_keywords'] ?? [];
        $lsiText    = implode(', ', array_slice($lsi, 0, 8));
        $langLabel  = $language === 'id' ? 'Bahasa Indonesia' : 'English';

        $prompt = <<<PROMPT
Kamu adalah SEO content writer expert. Buat artikel SEO berkualitas tinggi dengan ketentuan:

**Keyword Utama:** {$keyword}
**LSI Keywords (gunakan secara natural):** {$lsiText}
**Bahasa:** {$langLabel}
**Tone:** {$tone}
**Target Panjang:** {$wordCount} kata

**Struktur Artikel WAJIB:**
1. [TITLE] - Judul clickbait & SEO friendly (55-60 karakter), sertakan keyword
2. [HEADLINE] - Sub-judul menarik yang mendukung judul
3. [META_DESCRIPTION] - Deskripsi meta 150-160 karakter, mengandung keyword
4. [EXCERPT] - Ringkasan 2 kalimat untuk preview
5. [CONTENT] - Konten artikel lengkap dengan format:

   ## Pendahuluan (150-200 kata, keyword di kalimat pertama)

   ## [H2 Relevant] (gunakan keyword variasi)
   ### [H3 Subtopik]
   [Konten 200-300 kata per section]

   ## [H2 Relevant ke-2]
   ### [H3 Subtopik]

   ## [H2 Relevant ke-3]
   ### [H3 Subtopik]

   ## FAQ - Pertanyaan yang Sering Ditanyakan
   **Q: [Pertanyaan 1]?**
   A: [Jawaban detail]

   **Q: [Pertanyaan 2]?**
   A: [Jawaban detail]

   **Q: [Pertanyaan 3]?**
   A: [Jawaban detail]

   ## Kesimpulan (100-150 kata, CTA di akhir)

6. [TAGS] - 5-7 tag relevan, pisah koma
7. [IMAGE_PROMPT] - Prompt untuk generate gambar dalam bahasa Inggris

**RULES:**
- Keyword density 1.5-2.5%
- Jangan keyword stuffing
- Gunakan LSI keywords secara natural
- Buat konten orisinil dan informatif
- Sertakan data/statistik jika relevan
- Bold teks penting menggunakan **bold**
- Gunakan bullet points dan numbered list dimana sesuai
- Tulis dalam format Markdown

PENTING: Kembalikan HANYA plain text dengan format persis seperti di atas. Jangan tambahkan komentar lain.
PROMPT;

        $rawContent = $this->callProvider($prompt);

        return $this->parseArticleResponse($rawContent, $keyword);
    }

    /**
     * Generate meta tags only
     */
    public function generateMetaTags(string $title, string $content): array
    {
        $excerpt = substr(strip_tags($content), 0, 500);
        $prompt  = "Buat meta SEO untuk artikel berikut.\nJudul: {$title}\nIsi: {$excerpt}\n\nKembalikan JSON dengan format: {\"meta_title\":\"...\",\"meta_description\":\"...\",\"og_title\":\"...\",\"og_description\":\"...\",\"focus_keywords\":[]}";

        $raw = $this->callProvider($prompt);
        $json = $this->extractJson($raw);

        return $json ?? ['meta_title' => $title, 'meta_description' => substr(strip_tags($content), 0, 160)];
    }

    /**
     * Generate FAQ schema data
     */
    public function generateFAQ(string $keyword, int $count = 5): array
    {
        $prompt = "Buat {$count} pertanyaan FAQ umum beserta jawaban detail tentang: '{$keyword}'. Format JSON array: [{\"question\":\"...\",\"answer\":\"...\"}]. Hanya JSON saja, tanpa komentar lain.";

        $raw  = $this->callProvider($prompt);
        $json = $this->extractJson($raw);

        return is_array($json) ? $json : [];
    }

    /**
     * Call the selected AI provider
     */
    private function callProvider(string $prompt): string
    {
        return match($this->provider) {
            'openai' => $this->callOpenAI($prompt),
            'claude' => $this->callClaude($prompt),
            'gemini' => $this->callGemini($prompt),
            'groq'   => $this->callGroq($prompt),
            default  => throw new \Exception("Unknown AI provider: {$this->provider}"),
        };
    }

    private function callOpenAI(string $prompt): string
    {
        $response = Http::timeout(120)
            ->withHeaders(['Authorization' => 'Bearer ' . $this->config['api_key']])
            ->post($this->config['url'], [
                'model'    => $this->config['model'],
                'messages' => [['role' => 'user', 'content' => $prompt]],
                'temperature' => 0.7,
            ]);

        if (!$response->successful()) {
            throw new \Exception('OpenAI Error: ' . $response->body());
        }

        return $response->json('choices.0.message.content') ?? '';
    }

    private function callClaude(string $prompt): string
    {
        $response = Http::timeout(120)
            ->withHeaders([
                'x-api-key'         => $this->config['api_key'],
                'anthropic-version' => '2023-06-01',
            ])
            ->post($this->config['url'], [
                'model'      => $this->config['model'],
                'max_tokens' => 4096,
                'messages'   => [['role' => 'user', 'content' => $prompt]],
            ]);

        if (!$response->successful()) {
            throw new \Exception('Claude Error: ' . $response->body());
        }

        return $response->json('content.0.text') ?? '';
    }

    private function callGemini(string $prompt): string
    {
        $url = $this->config['url'] . '/' . $this->config['model'] . ':generateContent?key=' . $this->config['api_key'];

        $response = Http::timeout(120)->post($url, [
            'contents' => [['parts' => [['text' => $prompt]]]],
            'generationConfig' => ['temperature' => 0.7, 'maxOutputTokens' => 4096],
        ]);

        if (!$response->successful()) {
            throw new \Exception('Gemini Error: ' . $response->body());
        }

        return $response->json('candidates.0.content.parts.0.text') ?? '';
    }

    private function callGroq(string $prompt): string
    {
        $response = Http::timeout(60)
            ->withHeaders(['Authorization' => 'Bearer ' . $this->config['api_key']])
            ->post($this->config['url'], [
                'model'    => $this->config['model'],
                'messages' => [['role' => 'user', 'content' => $prompt]],
                'temperature' => 0.7,
            ]);

        if (!$response->successful()) {
            throw new \Exception('Groq Error: ' . $response->body());
        }

        return $response->json('choices.0.message.content') ?? '';
    }

    /**
     * Parse raw AI response into structured array
     */
    private function parseArticleResponse(string $raw, string $keyword): array
    {
        $result = [
            'title'            => '',
            'headline'         => '',
            'meta_description' => '',
            'excerpt'          => '',
            'content'          => '',
            'tags'             => [],
            'image_prompt'     => '',
            'word_count'       => 0,
        ];

        $sections = [
            'title'            => '/\[TITLE\]\s*(.+?)(?=\[HEADLINE\]|\[META|$)/si',
            'headline'         => '/\[HEADLINE\]\s*(.+?)(?=\[META|$)/si',
            'meta_description' => '/\[META_DESCRIPTION\]\s*(.+?)(?=\[EXCERPT\]|\[CONTENT\]|$)/si',
            'excerpt'          => '/\[EXCERPT\]\s*(.+?)(?=\[CONTENT\]|$)/si',
            'content'          => '/\[CONTENT\]\s*(.+?)(?=\[TAGS\]|\[IMAGE|$)/si',
            'tags'             => '/\[TAGS\]\s*(.+?)(?=\[IMAGE|$)/si',
            'image_prompt'     => '/\[IMAGE_PROMPT\]\s*(.+?)$/si',
        ];

        foreach ($sections as $key => $pattern) {
            if (preg_match($pattern, $raw, $m)) {
                $value = trim($m[1]);
                if ($key === 'tags') {
                    $result[$key] = array_map('trim', explode(',', $value));
                } else {
                    $result[$key] = $value;
                }
            }
        }

        // Fallback: if parsing fails, use full raw as content
        if (empty($result['content'])) {
            $result['content'] = $raw;
            $result['title']   = $keyword;
        }

        $result['word_count'] = str_word_count(strip_tags($result['content']));

        return $result;
    }

    private function extractJson(string $text): mixed
    {
        $text = preg_replace('/```json|```/i', '', $text);
        preg_match('/(\{.*\}|\[.*\])/s', $text, $m);
        return isset($m[1]) ? json_decode($m[1], true) : null;
    }
}
AI_EOF

ok "AI Service dibuat"

# ============================================================
# 9. SEO SERVICE
# ============================================================

step "Membuat SEO Service..."

cat > app/Services/SEO/SeoService.php << 'SEO_EOF'
<?php
namespace App\Services\SEO;

use App\Models\Article;
use Illuminate\Support\Str;

class SeoService
{
    /**
     * Generate complete SEO data for article
     */
    public function buildSeoData(Article $article): array
    {
        return [
            'meta_title'         => $this->buildMetaTitle($article->title),
            'meta_description'   => $this->buildMetaDescription($article->excerpt ?? $article->content),
            'canonical_url'      => $this->buildCanonical($article->slug),
            'og_title'           => $article->og_title ?? $article->title,
            'og_description'     => $article->og_description ?? $this->buildMetaDescription($article->excerpt ?? ''),
            'og_image'           => $article->og_image ?? $article->featured_image ?? config('ai_engine.seo.default_og_image'),
            'twitter_title'      => $article->twitter_title ?? $article->title,
            'twitter_description'=> $article->twitter_description ?? $this->buildMetaDescription($article->excerpt ?? ''),
            'schema_org'         => $this->buildArticleSchema($article),
            'breadcrumbs'        => $this->buildBreadcrumbs($article),
            'reading_time'       => $article->reading_time,
        ];
    }

    /**
     * Build SEO score (0-100)
     */
    public function calculateSeoScore(Article $article): float
    {
        $score  = 0;
        $checks = [
            'has_meta_title'       => !empty($article->meta_title) && strlen($article->meta_title) >= 40,
            'meta_title_length'    => strlen($article->meta_title ?? '') <= 60,
            'has_meta_description' => !empty($article->meta_description) && strlen($article->meta_description) >= 100,
            'meta_desc_length'     => strlen($article->meta_description ?? '') <= 160,
            'has_featured_image'   => !empty($article->featured_image),
            'has_alt_text'         => !empty($article->featured_image_alt),
            'word_count_ok'        => $article->word_count >= 1000,
            'has_h2'               => substr_count($article->content, '## ') >= 2,
            'has_h3'               => substr_count($article->content, '### ') >= 1,
            'has_faq'              => !empty($article->faq_schema),
            'keyword_in_title'     => !empty($article->keyword) && str_contains(strtolower($article->title), strtolower($article->keyword->keyword ?? '')),
            'keyword_in_meta'      => !empty($article->keyword) && str_contains(strtolower($article->meta_description ?? ''), strtolower($article->keyword->keyword ?? '')),
            'has_internal_links'   => substr_count($article->content_html ?? '', '<a href') >= 2,
            'has_schema'           => !empty($article->schema_org),
            'has_canonical'        => !empty($article->canonical_url),
        ];

        $weights = [
            'has_meta_title' => 10, 'meta_title_length' => 5,
            'has_meta_description' => 10, 'meta_desc_length' => 5,
            'has_featured_image' => 8, 'has_alt_text' => 5,
            'word_count_ok' => 10, 'has_h2' => 8, 'has_h3' => 5,
            'has_faq' => 8, 'keyword_in_title' => 10, 'keyword_in_meta' => 8,
            'has_internal_links' => 5, 'has_schema' => 8, 'has_canonical' => 5,
        ];

        foreach ($checks as $key => $passed) {
            if ($passed) $score += $weights[$key] ?? 5;
        }

        return min(100, round($score));
    }

    /**
     * Calculate readability score (Flesch-Kincaid simplified for Indonesian)
     */
    public function calculateReadability(string $content): float
    {
        $text      = strip_tags($content);
        $sentences = max(1, preg_match_all('/[.!?]+/', $text, $m));
        $words     = max(1, str_word_count($text));
        $syllables = $this->countSyllables($text);

        $score = 206.835 - (1.015 * ($words / $sentences)) - (84.6 * ($syllables / $words));

        return min(100, max(0, round($score, 2)));
    }

    /**
     * Build Article JSON-LD Schema
     */
    public function buildArticleSchema(Article $article): array
    {
        $siteUrl  = config('app.url');
        $siteName = config('ai_engine.seo.site_name');

        return [
            '@context'        => 'https://schema.org',
            '@type'           => 'Article',
            'headline'        => $article->title,
            'description'     => $article->meta_description,
            'image'           => $article->featured_image ? $siteUrl . $article->featured_image : null,
            'author'          => ['@type' => 'Organization', 'name' => $siteName, 'url' => $siteUrl],
            'publisher'       => ['@type' => 'Organization', 'name' => $siteName, 'url' => $siteUrl],
            'datePublished'   => $article->published_at?->toIso8601String(),
            'dateModified'    => $article->updated_at?->toIso8601String(),
            'mainEntityOfPage'=> ['@type' => 'WebPage', '@id' => $siteUrl . '/blog/' . $article->slug],
            'wordCount'       => $article->word_count,
            'articleSection'  => $article->category?->name,
            'inLanguage'      => 'id-ID',
        ];
    }

    /**
     * Build FAQ JSON-LD Schema
     */
    public function buildFaqSchema(array $faqs): array
    {
        $entities = [];
        foreach ($faqs as $faq) {
            $entities[] = [
                '@type'          => 'Question',
                'name'           => $faq['question'] ?? '',
                'acceptedAnswer' => ['@type' => 'Answer', 'text' => $faq['answer'] ?? ''],
            ];
        }

        return ['@context' => 'https://schema.org', '@type' => 'FAQPage', 'mainEntity' => $entities];
    }

    public function buildBreadcrumbs(Article $article): array
    {
        $siteUrl = config('app.url');
        $list    = [
            ['name' => 'Beranda', 'url' => $siteUrl],
            ['name' => 'Blog', 'url' => $siteUrl . '/blog'],
        ];

        if ($article->category) {
            $list[] = ['name' => $article->category->name, 'url' => $siteUrl . '/category/' . $article->category->slug];
        }

        $list[] = ['name' => $article->title, 'url' => $siteUrl . '/blog/' . $article->slug];

        return $list;
    }

    private function buildMetaTitle(string $title): string
    {
        $siteName = config('ai_engine.seo.site_name', 'Blog');
        $title    = Str::limit($title, 55, '');
        return "{$title} | {$siteName}";
    }

    private function buildMetaDescription(string $text): string
    {
        return Str::limit(strip_tags($text), 158, '...');
    }

    private function buildCanonical(string $slug): string
    {
        return config('app.url') . '/blog/' . $slug;
    }

    private function countSyllables(string $text): int
    {
        $words = str_word_count(strtolower($text), 1);
        $count = 0;
        foreach ($words as $word) {
            $count += max(1, preg_match_all('/[aeiouáéíóú]/u', $word, $m));
        }
        return $count;
    }
}
SEO_EOF

ok "SEO Service dibuat"

# ============================================================
# 10. SCRAPER SERVICE (KEYWORD RESEARCH)
# ============================================================

step "Membuat Keyword Scraper Service..."

cat > app/Services/Scraper/KeywordScraperService.php << 'SCRAPER_EOF'
<?php
namespace App\Services\Scraper;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class KeywordScraperService
{
    /**
     * Get Google Autocomplete suggestions
     */
    public function googleSuggest(string $keyword, string $lang = 'id'): array
    {
        $cacheKey = 'suggest_' . md5($keyword . $lang);

        return Cache::remember($cacheKey, 3600, function () use ($keyword, $lang) {
            try {
                $url = "https://suggestqueries.google.com/complete/search";
                $response = Http::timeout(10)->get($url, [
                    'client' => 'firefox',
                    'q'      => $keyword,
                    'hl'     => $lang,
                    'gl'     => 'id',
                ]);

                return $response->json()[1] ?? [];
            } catch (\Exception $e) {
                Log::warning("Google suggest failed: " . $e->getMessage());
                return [];
            }
        });
    }

    /**
     * Get "People Also Ask" style questions (simulated LSI expansion)
     */
    public function getLsiKeywords(string $keyword): array
    {
        $suggestions = $this->googleSuggest($keyword);
        $prefixes    = ['cara', 'tips', 'pengertian', 'manfaat', 'contoh', 'jenis', 'harga', 'review'];
        $lsi         = [];

        foreach ($prefixes as $prefix) {
            $extraSuggest = $this->googleSuggest("{$prefix} {$keyword}");
            $lsi          = array_merge($lsi, array_slice($extraSuggest, 0, 2));
        }

        return array_unique(array_merge($suggestions, $lsi));
    }

    /**
     * Get keyword suggestions from multiple sources
     */
    public function research(string $keyword): array
    {
        $suggestions = $this->googleSuggest($keyword);
        $lsi         = $this->getLsiKeywords($keyword);

        return [
            'primary'     => $keyword,
            'suggestions' => array_slice($suggestions, 0, 10),
            'lsi'         => array_slice($lsi, 0, 15),
            'questions'   => $this->generateQuestions($keyword),
        ];
    }

    private function generateQuestions(string $keyword): array
    {
        $prefixes = ['apa itu', 'bagaimana cara', 'mengapa', 'kapan', 'berapa', 'apakah', 'dimana'];
        return array_map(fn($p) => ucfirst("{$p} {$keyword}?"), $prefixes);
    }
}
SCRAPER_EOF

ok "Scraper Service dibuat"

# ============================================================
# 11. INTERNAL LINKING SERVICE
# ============================================================

step "Membuat Internal Linking Service..."

cat > app/Services/InternalLink/InternalLinkService.php << 'LINK_EOF'
<?php
namespace App\Services\InternalLink;

use App\Models\Article;
use Illuminate\Support\Str;

class InternalLinkService
{
    private int $maxLinks;

    public function __construct(int $maxLinks = 3)
    {
        $this->maxLinks = $maxLinks;
    }

    /**
     * Inject internal links into article content
     */
    public function inject(string $content, int $excludeArticleId = 0): string
    {
        $candidates = Article::published()
            ->where('id', '!=', $excludeArticleId)
            ->inRandomOrder()
            ->limit(20)
            ->get(['id', 'title', 'slug', 'keyword_id']);

        if ($candidates->isEmpty()) {
            return $content;
        }

        $injected = 0;
        $paragraphs = explode("\n\n", $content);

        foreach ($candidates as $article) {
            if ($injected >= $this->maxLinks) break;

            $anchor    = $article->title;
            $url       = '/blog/' . $article->slug;
            $linkBlock = "\n\n> 📖 **Baca juga:** [{$anchor}]({$url})\n\n";

            // Inject after random paragraph (not first or last)
            $insertAt = rand(2, max(2, count($paragraphs) - 2));

            if (isset($paragraphs[$insertAt]) && strlen($paragraphs[$insertAt]) > 100) {
                $paragraphs[$insertAt] .= $linkBlock;
                $injected++;
            }
        }

        return implode("\n\n", $paragraphs);
    }

    /**
     * Find and link keywords in content (contextual)
     */
    public function injectContextual(string $content, int $excludeArticleId = 0): string
    {
        $articles = Article::published()
            ->where('id', '!=', $excludeArticleId)
            ->with('keyword')
            ->limit(30)
            ->get();

        $linked   = 0;
        foreach ($articles as $article) {
            if ($linked >= $this->maxLinks) break;
            if (!$article->keyword) continue;

            $kw  = $article->keyword->keyword;
            $url = '/blog/' . $article->slug;

            // Case-insensitive, only first occurrence
            if (stripos($content, $kw) !== false && stripos($content, "href=\"{$url}\"") === false) {
                $content = preg_replace(
                    '/(' . preg_quote($kw, '/') . ')/i',
                    '<a href="' . $url . '" title="' . $article->title . '">' . '$1' . '</a>',
                    $content,
                    1
                );
                $linked++;
            }
        }

        return $content;
    }
}
LINK_EOF

ok "Internal Link Service dibuat"

# ============================================================
# 12. IMAGE SERVICE
# ============================================================

step "Membuat Image Service..."

cat > app/Services/Image/ArticleImageService.php << 'IMG_EOF'
<?php
namespace App\Services\Image;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ArticleImageService
{
    private string $provider;

    public function __construct()
    {
        $this->provider = config('ai_engine.article.image_provider', 'unsplash');
    }

    /**
     * Fetch and save a featured image for an article
     */
    public function fetchFeaturedImage(string $keyword, string $slug, string $aiPrompt = ''): ?string
    {
        $imageUrl = match($this->provider) {
            'unsplash' => $this->fetchUnsplash($keyword),
            'pexels'   => $this->fetchPexels($keyword),
            'dalle'    => $this->generateDalle($aiPrompt ?: $keyword),
            default    => $this->fetchUnsplash($keyword),
        };

        if (!$imageUrl) return null;

        return $this->downloadAndSave($imageUrl, $slug);
    }

    private function fetchUnsplash(string $keyword): ?string
    {
        $key = config('ai_engine.article.unsplash_key');
        if (!$key) return $this->getPlaceholderUrl($keyword);

        try {
            $response = Http::timeout(10)->get('https://api.unsplash.com/photos/random', [
                'query'       => $keyword,
                'orientation' => 'landscape',
                'client_id'   => $key,
            ]);

            return $response->json('urls.regular');
        } catch (\Exception $e) {
            Log::warning("Unsplash fetch failed: " . $e->getMessage());
            return $this->getPlaceholderUrl($keyword);
        }
    }

    private function fetchPexels(string $keyword): ?string
    {
        $key = config('ai_engine.article.pexels_key');
        if (!$key) return $this->getPlaceholderUrl($keyword);

        try {
            $response = Http::timeout(10)
                ->withHeaders(['Authorization' => $key])
                ->get('https://api.pexels.com/v1/search', [
                    'query'       => $keyword,
                    'orientation' => 'landscape',
                    'per_page'    => 1,
                ]);

            return $response->json('photos.0.src.large2x');
        } catch (\Exception $e) {
            Log::warning("Pexels fetch failed: " . $e->getMessage());
            return $this->getPlaceholderUrl($keyword);
        }
    }

    private function generateDalle(string $prompt): ?string
    {
        $key = config('ai_engine.providers.openai.api_key');
        if (!$key) return null;

        try {
            $response = Http::timeout(60)
                ->withHeaders(['Authorization' => 'Bearer ' . $key])
                ->post('https://api.openai.com/v1/images/generations', [
                    'model'   => 'dall-e-3',
                    'prompt'  => "High quality blog featured image, professional photography style. {$prompt}",
                    'n'       => 1,
                    'size'    => '1792x1024',
                    'quality' => 'standard',
                ]);

            return $response->json('data.0.url');
        } catch (\Exception $e) {
            Log::warning("DALL-E generation failed: " . $e->getMessage());
            return null;
        }
    }

    private function downloadAndSave(string $url, string $slug): ?string
    {
        try {
            $response = Http::timeout(30)->get($url);
            if (!$response->successful()) return null;

            $filename  = 'thumbnails/' . $slug . '-' . Str::random(6) . '.jpg';
            Storage::disk('public')->put($filename, $response->body());

            return '/storage/' . $filename;
        } catch (\Exception $e) {
            Log::warning("Image download failed: " . $e->getMessage());
            return null;
        }
    }

    private function getPlaceholderUrl(string $keyword): string
    {
        $encoded = urlencode($keyword);
        return "https://picsum.photos/seed/{$encoded}/1200/630";
    }
}
IMG_EOF

ok "Image Service dibuat"

# ============================================================
# 13. ANALYTICS SERVICE
# ============================================================

step "Membuat Analytics Service..."

cat > app/Services/Analytics/AnalyticsService.php << 'ANALYTICS_EOF'
<?php
namespace App\Services\Analytics;

use App\Models\Article;
use App\Models\ArticleView;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class AnalyticsService
{
    /**
     * Record a page view
     */
    public function recordView(Article $article, array $context = []): void
    {
        $ip       = request()->ip();
        $cacheKey = "viewed_{$article->id}_{$ip}";

        // Only count once per hour per IP
        if (cache()->has($cacheKey)) return;

        cache()->put($cacheKey, true, 3600);

        ArticleView::create([
            'article_id'  => $article->id,
            'ip_address'  => $ip,
            'user_agent'  => request()->userAgent(),
            'referer'     => request()->headers->get('referer'),
            'device_type' => $this->detectDevice(),
        ]);

        $article->increment('view_count');
    }

    /**
     * Get dashboard stats
     */
    public function getDashboardStats(): array
    {
        $totalArticles    = Article::published()->count();
        $totalViews       = Article::published()->sum('view_count');
        $totalKeywords    = \App\Models\Keyword::count();
        $pendingKeywords  = \App\Models\Keyword::where('status', 'pending')->count();

        $topArticles = Article::published()
            ->orderBy('view_count', 'desc')
            ->limit(10)
            ->get(['id', 'title', 'slug', 'view_count', 'published_at']);

        $viewsLast30Days = ArticleView::where('created_at', '>=', Carbon::now()->subDays(30))
            ->selectRaw('DATE(created_at) as date, COUNT(*) as views')
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('views', 'date');

        $deviceBreakdown = ArticleView::selectRaw('device_type, COUNT(*) as count')
            ->groupBy('device_type')
            ->pluck('count', 'device_type');

        return compact(
            'totalArticles', 'totalViews', 'totalKeywords', 'pendingKeywords',
            'topArticles', 'viewsLast30Days', 'deviceBreakdown'
        );
    }

    /**
     * Get article-level stats
     */
    public function getArticleStats(Article $article): array
    {
        $views = ArticleView::where('article_id', $article->id)
            ->selectRaw('DATE(created_at) as date, COUNT(*) as views')
            ->where('created_at', '>=', Carbon::now()->subDays(30))
            ->groupBy('date')
            ->pluck('views', 'date');

        $referrers = ArticleView::where('article_id', $article->id)
            ->whereNotNull('referer')
            ->selectRaw('referer, COUNT(*) as count')
            ->groupBy('referer')
            ->orderBy('count', 'desc')
            ->limit(10)
            ->pluck('count', 'referer');

        return [
            'total_views'   => $article->view_count,
            'daily_views'   => $views,
            'referrers'     => $referrers,
            'reading_time'  => $article->reading_time,
            'seo_score'     => $article->seo_score,
            'word_count'    => $article->word_count,
        ];
    }

    private function detectDevice(): string
    {
        $agent = request()->userAgent() ?? '';
        if (preg_match('/Mobile|Android|iPhone/i', $agent)) return 'mobile';
        if (preg_match('/Tablet|iPad/i', $agent)) return 'tablet';
        return 'desktop';
    }
}
ANALYTICS_EOF

ok "Analytics Service dibuat"

# ============================================================
# 14. ARTICLE GENERATOR JOB
# ============================================================

step "Membuat Jobs..."

cat > app/Jobs/GenerateArticleJob.php << 'JOB_EOF'
<?php
namespace App\Jobs;

use App\Models\Keyword;
use App\Models\Article;
use App\Services\AI\AIContentService;
use App\Services\SEO\SeoService;
use App\Services\InternalLink\InternalLinkService;
use App\Services\Image\ArticleImageService;
use App\Services\Scraper\KeywordScraperService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class GenerateArticleJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int    $tries   = 3;
    public int    $timeout = 300;
    public int    $backoff = 60;

    public function __construct(public readonly int $keywordId) {}

    public function handle(
        AIContentService     $ai,
        SeoService           $seo,
        InternalLinkService  $linker,
        ArticleImageService  $imageService,
        KeywordScraperService $scraper
    ): void {
        $keyword = Keyword::find($this->keywordId);

        if (!$keyword || $keyword->status === 'done') return;

        // Mark as processing
        $keyword->update(['status' => 'processing']);

        try {
            Log::info("Generating article for keyword: {$keyword->keyword}");

            // 1. Get LSI keywords
            $lsi = $scraper->getLsiKeywords($keyword->keyword);
            $keyword->update(['lsi_keywords' => $lsi]);

            // 2. Generate article content
            $aiProvider = new AIContentService($keyword->ai_provider);
            $generated  = $aiProvider->generateArticle($keyword->keyword, [
                'language'    => $keyword->language ?? 'id',
                'tone'        => $keyword->focus_tone ?? 'informatif',
                'word_count'  => $keyword->target_words ?? 1500,
                'lsi_keywords'=> $lsi,
            ]);

            $slug = Str::slug($generated['title'] ?: $keyword->keyword);

            // Ensure unique slug
            $originalSlug = $slug;
            $counter      = 1;
            while (Article::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $counter++;
            }

            // 3. Generate FAQ
            $faqs      = $aiProvider->generateFAQ($keyword->keyword);
            $faqSchema = !empty($faqs) ? $seo->buildFaqSchema($faqs) : null;

            // 4. Get featured image
            $featuredImage    = null;
            $featuredImageAlt = null;
            if (config('ai_engine.article.generate_image')) {
                $featuredImage    = $imageService->fetchFeaturedImage($keyword->keyword, $slug, $generated['image_prompt'] ?? '');
                $featuredImageAlt = $generated['title'] ?? $keyword->keyword;
            }

            // 5. Build content with internal links
            $contentWithLinks = $linker->inject($generated['content']);

            // 6. Create the article
            $status    = config('ai_engine.article.auto_publish') ? 'published' : 'review';
            $publishAt = $status === 'published' ? now() : null;

            $article = Article::create([
                'keyword_id'          => $keyword->id,
                'category_id'         => $keyword->category_id,
                'title'               => $generated['title'],
                'slug'                => $slug,
                'headline'            => $generated['headline'] ?? null,
                'excerpt'             => $generated['excerpt'] ?? null,
                'content'             => $contentWithLinks,
                'content_html'        => $contentWithLinks,
                'featured_image'      => $featuredImage,
                'featured_image_alt'  => $featuredImageAlt,
                'ai_provider'         => $keyword->ai_provider,
                'meta_title'          => $generated['title'],
                'meta_description'    => $generated['meta_description'] ?? null,
                'faq_schema'          => $faqSchema,
                'word_count'          => $generated['word_count'] ?? 0,
                'status'              => $status,
                'published_at'        => $publishAt,
            ]);

            // 7. Calculate SEO & readability scores
            $seoScore    = $seo->calculateSeoScore($article->fresh());
            $readability = $seo->calculateReadability($contentWithLinks);

            // 8. Build full SEO data & Schema
            $seoData     = $seo->buildSeoData($article->fresh());

            $article->update([
                'meta_title'         => $seoData['meta_title'],
                'meta_description'   => $seoData['meta_description'],
                'canonical_url'      => $seoData['canonical_url'],
                'og_title'           => $seoData['og_title'],
                'og_description'     => $seoData['og_description'],
                'og_image'           => $seoData['og_image'],
                'schema_org'         => $seoData['schema_org'],
                'breadcrumbs'        => $seoData['breadcrumbs'],
                'seo_score'          => $seoScore,
                'readability_score'  => $readability,
            ]);

            // 9. Update keyword status
            $keyword->update([
                'status'       => 'done',
                'generated_at' => now(),
            ]);

            // 10. Update category article count
            if ($keyword->category_id) {
                $keyword->category->increment('article_count');
            }

            Log::info("Article generated successfully: {$article->title} (ID: {$article->id}, SEO: {$seoScore}/100)");

        } catch (\Exception $e) {
            Log::error("Article generation failed for keyword [{$keyword->keyword}]: " . $e->getMessage());

            $keyword->update([
                'status'        => 'failed',
                'error_message' => $e->getMessage(),
            ]);

            throw $e; // Re-throw for queue retry
        }
    }

    public function failed(\Throwable $exception): void
    {
        Log::error("Job permanently failed for keyword ID {$this->keywordId}: " . $exception->getMessage());

        Keyword::find($this->keywordId)?->update([
            'status'        => 'failed',
            'error_message' => 'Max retries exceeded: ' . $exception->getMessage(),
        ]);
    }
}
JOB_EOF

cat > app/Jobs/GenerateBulkArticlesJob.php << 'JOB_EOF'
<?php
namespace App\Jobs;

use App\Models\Keyword;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateBulkArticlesJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        public readonly array $keywordIds = [],
        public readonly int   $delaySeconds = 5
    ) {}

    public function handle(): void
    {
        $ids = !empty($this->keywordIds)
            ? $this->keywordIds
            : Keyword::where('status', 'pending')->byPriority()->pluck('id')->toArray();

        Log::info("Dispatching bulk generation for " . count($ids) . " keywords");

        foreach ($ids as $index => $id) {
            $delay = $index * $this->delaySeconds;
            GenerateArticleJob::dispatch($id)->delay(now()->addSeconds($delay));
        }
    }
}
JOB_EOF

ok "Jobs dibuat"

# ============================================================
# 15. ARTISAN COMMANDS
# ============================================================

step "Membuat Artisan Commands..."

cat > app/Console/Commands/GenerateArticlesCommand.php << 'CMD_EOF'
<?php
namespace App\Console\Commands;

use App\Jobs\GenerateArticleJob;
use App\Jobs\GenerateBulkArticlesJob;
use App\Models\Keyword;
use Illuminate\Console\Command;

class GenerateArticlesCommand extends Command
{
    protected $signature = 'ai:generate
                            {--keyword= : Keyword ID to generate}
                            {--all : Generate all pending keywords}
                            {--limit=10 : Max keywords to generate}
                            {--provider= : AI provider to use (openai|claude|gemini|groq)}
                            {--delay=5 : Delay between jobs in seconds}';

    protected $description = 'Generate SEO articles using AI';

    public function handle(): int
    {
        $this->info('🚀 AI SEO Article Engine Pro');
        $this->newLine();

        if ($keywordId = $this->option('keyword')) {
            $keyword = Keyword::find($keywordId);
            if (!$keyword) {
                $this->error("Keyword ID {$keywordId} tidak ditemukan.");
                return 1;
            }

            if ($provider = $this->option('provider')) {
                $keyword->update(['ai_provider' => $provider]);
            }

            $this->info("📝 Dispatching job untuk: {$keyword->keyword}");
            GenerateArticleJob::dispatch($keyword->id);
            $this->info('✅ Job berhasil di-dispatch!');
            return 0;
        }

        $limit    = (int) $this->option('limit');
        $keywords = Keyword::where('status', 'pending')
            ->byPriority()
            ->limit($limit)
            ->get();

        if ($keywords->isEmpty()) {
            $this->warn('⚠️  Tidak ada keyword pending yang ditemukan.');
            return 0;
        }

        $this->info("📋 Ditemukan {$keywords->count()} keyword pending (limit: {$limit})");
        $this->newLine();

        $delay = (int) $this->option('delay');

        foreach ($keywords as $i => $keyword) {
            if ($provider = $this->option('provider')) {
                $keyword->update(['ai_provider' => $provider]);
            }

            GenerateArticleJob::dispatch($keyword->id)->delay(now()->addSeconds($i * $delay));
            $this->line("  ✓ Queued [{$keyword->ai_provider}] {$keyword->keyword}");
        }

        $this->newLine();
        $this->info("🎉 {$keywords->count()} jobs berhasil di-queue!");
        $this->warn("💡 Jalankan: php artisan queue:work --tries=3");

        return 0;
    }
}
CMD_EOF

cat > app/Console/Commands/ImportKeywordsCommand.php << 'CMD_EOF'
<?php
namespace App\Console\Commands;

use App\Models\Keyword;
use App\Models\Category;
use Illuminate\Console\Command;

class ImportKeywordsCommand extends Command
{
    protected $signature = 'ai:import-keywords
                            {file : Path to CSV file with keywords}
                            {--category= : Category name or ID}
                            {--provider=openai : AI provider to use}
                            {--priority=5 : Priority 1-10}';

    protected $description = 'Import keywords from CSV file';

    public function handle(): int
    {
        $file = $this->argument('file');

        if (!file_exists($file)) {
            $this->error("File tidak ditemukan: {$file}");
            return 1;
        }

        $categoryId = null;
        if ($catInput = $this->option('category')) {
            $category   = is_numeric($catInput)
                ? Category::find($catInput)
                : Category::firstOrCreate(['name' => $catInput], ['slug' => \Str::slug($catInput)]);
            $categoryId = $category?->id;
        }

        $rows    = array_map('str_getcsv', file($file));
        $header  = array_shift($rows);
        $count   = 0;
        $skipped = 0;

        $this->info("📥 Importing " . count($rows) . " keywords...");
        $bar = $this->output->createProgressBar(count($rows));
        $bar->start();

        foreach ($rows as $row) {
            $data = array_combine($header, $row);
            $kw   = trim($data['keyword'] ?? $data[0] ?? '');

            if (empty($kw)) { $skipped++; $bar->advance(); continue; }

            if (Keyword::where('keyword', $kw)->exists()) { $skipped++; $bar->advance(); continue; }

            Keyword::create([
                'keyword'     => $kw,
                'category_id' => $categoryId,
                'ai_provider' => $this->option('provider'),
                'priority'    => $this->option('priority'),
                'focus_tone'  => $data['tone'] ?? 'informatif',
                'status'      => 'pending',
            ]);

            $count++;
            $bar->advance();
        }

        $bar->finish();
        $this->newLine(2);
        $this->info("✅ Imported: {$count} keywords");
        if ($skipped > 0) $this->warn("⚠️  Skipped: {$skipped} (duplicate/invalid)");

        return 0;
    }
}
CMD_EOF

cat > app/Console/Commands/RegenerateSitemapCommand.php << 'CMD_EOF'
<?php
namespace App\Console\Commands;

use App\Models\Article;
use App\Models\Category;
use Illuminate\Console\Command;
use Spatie\Sitemap\Sitemap;
use Spatie\Sitemap\Tags\Url;

class RegenerateSitemapCommand extends Command
{
    protected $signature = 'ai:sitemap';
    protected $description = 'Regenerate XML Sitemap';

    public function handle(): int
    {
        $this->info('🗺️  Generating sitemap...');

        $sitemap = Sitemap::create();
        $baseUrl = config('app.url');

        // Homepage
        $sitemap->add(Url::create('/')->setPriority(1.0)->setChangeFrequency('daily'));
        $sitemap->add(Url::create('/blog')->setPriority(0.9)->setChangeFrequency('daily'));

        // Categories
        $categories = Category::where('active', true)->get();
        foreach ($categories as $cat) {
            $sitemap->add(
                Url::create("/category/{$cat->slug}")
                    ->setPriority(0.8)
                    ->setChangeFrequency('weekly')
                    ->setLastModificationDate($cat->updated_at)
            );
        }

        // Articles
        $articles = Article::published()->orderBy('published_at', 'desc')->get(['slug', 'published_at', 'updated_at', 'view_count']);
        foreach ($articles as $article) {
            $priority = $article->view_count > 1000 ? 0.9 : ($article->view_count > 100 ? 0.7 : 0.6);
            $sitemap->add(
                Url::create("/blog/{$article->slug}")
                    ->setPriority($priority)
                    ->setChangeFrequency('monthly')
                    ->setLastModificationDate($article->updated_at)
            );
        }

        $sitemap->writeToFile(public_path('sitemap.xml'));

        $this->info("✅ Sitemap generated with " . $articles->count() . " articles");

        return 0;
    }
}
CMD_EOF

ok "Commands dibuat"

# ============================================================
# 16. SCHEDULER
# ============================================================

step "Menambahkan Scheduler..."

cat > app/Console/Kernel.php << 'KERNEL_EOF'
<?php
namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    protected function schedule(Schedule $schedule): void
    {
        // Generate pending articles every day at 08:00
        $schedule->command('ai:generate --limit=5')
                 ->dailyAt('08:00')
                 ->withoutOverlapping()
                 ->runInBackground()
                 ->appendOutputTo(storage_path('logs/ai-generate.log'));

        // Regenerate sitemap daily at 02:00
        $schedule->command('ai:sitemap')
                 ->dailyAt('02:00')
                 ->withoutOverlapping();

        // Queue monitoring - restart worker if stuck
        $schedule->command('queue:restart')
                 ->hourly();

        // Clean old job records
        $schedule->command('queue:prune-failed --hours=72')
                 ->weekly();
    }

    protected function commands(): void
    {
        $this->load(__DIR__.'/Commands');
        require base_path('routes/console.php');
    }
}
KERNEL_EOF

ok "Scheduler dikonfigurasi"

# ============================================================
# 17. CONTROLLERS
# ============================================================

step "Membuat Controllers..."

cat > app/Http/Controllers/ArticleController.php << 'CTRL_EOF'
<?php
namespace App\Http\Controllers;

use App\Models\Article;
use App\Models\Category;
use App\Services\Analytics\AnalyticsService;
use Illuminate\Http\Request;

class ArticleController extends Controller
{
    public function __construct(private readonly AnalyticsService $analytics) {}

    public function index()
    {
        $articles   = Article::published()->with('category', 'keyword')->latest('published_at')->paginate(12);
        $categories = Category::where('active', true)->withCount('articles')->get();
        $popular    = Article::published()->orderBy('view_count', 'desc')->limit(5)->get();

        return view('blog.index', compact('articles', 'categories', 'popular'));
    }

    public function show(string $slug)
    {
        $article  = Article::where('slug', $slug)->published()->with('category', 'keyword')->firstOrFail();
        $related  = Article::published()
            ->where('id', '!=', $article->id)
            ->where('category_id', $article->category_id)
            ->inRandomOrder()
            ->limit(3)
            ->get();

        // Record view
        $this->analytics->recordView($article);

        return view('blog.show', compact('article', 'related'));
    }

    public function category(string $slug)
    {
        $category = Category::where('slug', $slug)->where('active', true)->firstOrFail();
        $articles = Article::published()
            ->where('category_id', $category->id)
            ->latest('published_at')
            ->paginate(12);

        return view('blog.category', compact('category', 'articles'));
    }

    public function sitemap()
    {
        $path = public_path('sitemap.xml');
        if (!file_exists($path)) {
            abort(404);
        }
        return response()->file($path, ['Content-Type' => 'application/xml']);
    }

    public function feed()
    {
        $articles = Article::published()->latest('published_at')->limit(20)->get();
        $content  = view('blog.rss', compact('articles'))->render();

        return response($content, 200, ['Content-Type' => 'application/rss+xml; charset=utf-8']);
    }
}
CTRL_EOF

cat > app/Http/Controllers/Admin/DashboardController.php << 'CTRL_EOF'
<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Keyword;
use App\Models\Category;
use App\Services\Analytics\AnalyticsService;

class DashboardController extends Controller
{
    public function index(AnalyticsService $analytics)
    {
        $stats = $analytics->getDashboardStats();
        $recentArticles = Article::with('keyword')->latest()->limit(10)->get();
        $failedKeywords = Keyword::where('status', 'failed')->latest()->limit(5)->get();

        return view('admin.dashboard', compact('stats', 'recentArticles', 'failedKeywords'));
    }
}
CTRL_EOF

cat > app/Http/Controllers/Admin/ArticleAdminController.php << 'CTRL_EOF'
<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Article;
use App\Models\Category;
use Illuminate\Http\Request;

class ArticleAdminController extends Controller
{
    public function index(Request $request)
    {
        $articles = Article::with('category', 'keyword')
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->when($request->search, fn($q, $s) => $q->where('title', 'like', "%{$s}%"))
            ->latest()
            ->paginate(20);

        return view('admin.articles.index', compact('articles'));
    }

    public function show(Article $article)
    {
        return view('admin.articles.show', compact('article'));
    }

    public function publish(Article $article)
    {
        $article->update(['status' => 'published', 'published_at' => now()]);
        return back()->with('success', 'Artikel berhasil dipublish!');
    }

    public function unpublish(Article $article)
    {
        $article->update(['status' => 'draft', 'published_at' => null]);
        return back()->with('success', 'Artikel di-unpublish.');
    }

    public function destroy(Article $article)
    {
        $article->delete();
        return redirect()->route('admin.articles.index')->with('success', 'Artikel dihapus.');
    }
}
CTRL_EOF

cat > app/Http/Controllers/Admin/KeywordAdminController.php << 'CTRL_EOF'
<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Jobs\GenerateArticleJob;
use App\Models\Category;
use App\Models\Keyword;
use Illuminate\Http\Request;

class KeywordAdminController extends Controller
{
    public function index(Request $request)
    {
        $keywords = Keyword::with('category', 'article')
            ->when($request->status, fn($q, $s) => $q->where('status', $s))
            ->when($request->search, fn($q, $s) => $q->where('keyword', 'like', "%{$s}%"))
            ->orderBy('priority', 'desc')
            ->paginate(25);

        return view('admin.keywords.index', compact('keywords'));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'keywords'    => 'required|string',
            'category_id' => 'nullable|exists:categories,id',
            'ai_provider' => 'required|in:openai,claude,gemini,groq',
            'focus_tone'  => 'required|in:informatif,persuasif,review,berita',
            'target_words'=> 'required|integer|min:500|max:5000',
            'priority'    => 'required|integer|min:1|max:10',
        ]);

        $lines   = array_filter(array_map('trim', explode("\n", $data['keywords'])));
        $created = 0;

        foreach ($lines as $kw) {
            if (Keyword::where('keyword', $kw)->exists()) continue;

            Keyword::create([
                'keyword'      => $kw,
                'category_id'  => $data['category_id'],
                'ai_provider'  => $data['ai_provider'],
                'focus_tone'   => $data['focus_tone'],
                'target_words' => $data['target_words'],
                'priority'     => $data['priority'],
                'status'       => 'pending',
            ]);
            $created++;
        }

        return back()->with('success', "{$created} keyword berhasil ditambahkan!");
    }

    public function generate(Keyword $keyword)
    {
        if ($keyword->status === 'done') {
            return back()->with('error', 'Keyword ini sudah pernah di-generate.');
        }

        GenerateArticleJob::dispatch($keyword->id);
        $keyword->update(['status' => 'processing']);

        return back()->with('success', "Artikel untuk '{$keyword->keyword}' sedang di-generate...");
    }

    public function generateAll()
    {
        $keywords = Keyword::where('status', 'pending')->byPriority()->limit(20)->get();

        foreach ($keywords as $i => $keyword) {
            GenerateArticleJob::dispatch($keyword->id)->delay(now()->addSeconds($i * 5));
        }

        return back()->with('success', "{$keywords->count()} keyword di-queue untuk di-generate!");
    }

    public function retry(Keyword $keyword)
    {
        $keyword->update(['status' => 'pending', 'error_message' => null]);
        GenerateArticleJob::dispatch($keyword->id);

        return back()->with('success', "Retry dispatched untuk '{$keyword->keyword}'");
    }

    public function destroy(Keyword $keyword)
    {
        $keyword->delete();
        return back()->with('success', 'Keyword dihapus.');
    }
}
CTRL_EOF

ok "Controllers dibuat"

# ============================================================
# 18. ROUTES
# ============================================================

step "Membuat Routes..."

cat > routes/web.php << 'ROUTES_EOF'
<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ArticleAdminController;
use App\Http\Controllers\Admin\KeywordAdminController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/
Route::get('/', [ArticleController::class, 'index'])->name('home');
Route::get('/blog', [ArticleController::class, 'index'])->name('blog.index');
Route::get('/blog/{slug}', [ArticleController::class, 'show'])->name('article.show');
Route::get('/category/{slug}', [ArticleController::class, 'category'])->name('category.show');
Route::get('/sitemap.xml', [ArticleController::class, 'sitemap'])->name('sitemap');
Route::get('/feed.rss', [ArticleController::class, 'feed'])->name('feed');

/*
|--------------------------------------------------------------------------
| Admin Routes (add auth middleware in production!)
|--------------------------------------------------------------------------
*/
Route::prefix('admin')->name('admin.')->group(function () {

    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Articles
    Route::prefix('articles')->name('articles.')->group(function () {
        Route::get('/', [ArticleAdminController::class, 'index'])->name('index');
        Route::get('/{article}', [ArticleAdminController::class, 'show'])->name('show');
        Route::post('/{article}/publish', [ArticleAdminController::class, 'publish'])->name('publish');
        Route::post('/{article}/unpublish', [ArticleAdminController::class, 'unpublish'])->name('unpublish');
        Route::delete('/{article}', [ArticleAdminController::class, 'destroy'])->name('destroy');
    });

    // Keywords
    Route::prefix('keywords')->name('keywords.')->group(function () {
        Route::get('/', [KeywordAdminController::class, 'index'])->name('index');
        Route::post('/', [KeywordAdminController::class, 'store'])->name('store');
        Route::post('/generate-all', [KeywordAdminController::class, 'generateAll'])->name('generate-all');
        Route::post('/{keyword}/generate', [KeywordAdminController::class, 'generate'])->name('generate');
        Route::post('/{keyword}/retry', [KeywordAdminController::class, 'retry'])->name('retry');
        Route::delete('/{keyword}', [KeywordAdminController::class, 'destroy'])->name('destroy');
    });
});
ROUTES_EOF

ok "Routes dibuat"

# ============================================================
# 19. VIEWS (ADMIN DASHBOARD)
# ============================================================

step "Membuat Views..."

mkdir -p resources/views/layouts
mkdir -p resources/views/blog
mkdir -p resources/views/admin/articles
mkdir -p resources/views/admin/keywords
mkdir -p resources/views/components

# Layout Admin
cat > resources/views/layouts/admin.blade.php << 'BLADE_EOF'
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>@yield('title', 'Admin') - AI SEO Engine Pro</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
    <style>
        :root { --primary: #6366f1; --dark: #0f172a; }
        body { background: #0f172a; color: #e2e8f0; font-family: 'Inter', sans-serif; }
        .sidebar { background: #1e293b; border-right: 1px solid #334155; }
        .nav-link { @apply flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-400 hover:bg-indigo-600/20 hover:text-indigo-400 transition-all text-sm font-medium; }
        .nav-link.active { @apply bg-indigo-600/30 text-indigo-400; }
        .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; }
        .btn-primary { @apply bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all; }
        .btn-danger { @apply bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded text-xs font-medium transition-all; }
        .btn-success { @apply bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded text-xs font-medium transition-all; }
        .badge { @apply inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium; }
    </style>
</head>
<body>
<div class="flex h-screen overflow-hidden">

    <!-- Sidebar -->
    <aside class="sidebar w-64 flex-shrink-0 flex flex-col overflow-y-auto">
        <div class="p-5 border-b border-slate-700">
            <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                    <i class="fas fa-robot text-white text-sm"></i>
                </div>
                <div>
                    <div class="font-bold text-white text-sm">AI SEO Engine</div>
                    <div class="text-xs text-slate-500">Pro v2.0</div>
                </div>
            </div>
        </div>

        <nav class="p-3 flex-1 space-y-1">
            <a href="{{ route('admin.dashboard') }}" class="nav-link {{ request()->routeIs('admin.dashboard') ? 'active' : '' }}">
                <i class="fas fa-chart-line w-4"></i> Dashboard
            </a>
            <a href="{{ route('admin.keywords.index') }}" class="nav-link {{ request()->routeIs('admin.keywords.*') ? 'active' : '' }}">
                <i class="fas fa-key w-4"></i> Keywords
            </a>
            <a href="{{ route('admin.articles.index') }}" class="nav-link {{ request()->routeIs('admin.articles.*') ? 'active' : '' }}">
                <i class="fas fa-newspaper w-4"></i> Artikel
            </a>
            <div class="pt-3 border-t border-slate-700 mt-3">
                <a href="{{ route('blog.index') }}" target="_blank" class="nav-link">
                    <i class="fas fa-external-link-alt w-4"></i> Lihat Blog
                </a>
                <a href="/sitemap.xml" target="_blank" class="nav-link">
                    <i class="fas fa-sitemap w-4"></i> Sitemap
                </a>
                <a href="/feed.rss" target="_blank" class="nav-link">
                    <i class="fas fa-rss w-4"></i> RSS Feed
                </a>
            </div>
        </nav>
    </aside>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
        <header class="flex items-center justify-between px-6 py-4 border-b border-slate-700 bg-slate-900">
            <h1 class="text-lg font-semibold text-white">@yield('page-title', 'Dashboard')</h1>
            <div class="flex items-center gap-3">
                @yield('header-actions')
            </div>
        </header>

        <main class="flex-1 overflow-y-auto p-6">
            @if(session('success'))
                <div class="mb-4 p-3 bg-emerald-900/30 border border-emerald-700 rounded-lg text-emerald-400 text-sm flex items-center gap-2">
                    <i class="fas fa-check-circle"></i> {{ session('success') }}
                </div>
            @endif
            @if(session('error'))
                <div class="mb-4 p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm flex items-center gap-2">
                    <i class="fas fa-exclamation-circle"></i> {{ session('error') }}
                </div>
            @endif

            @yield('content')
        </main>
    </div>
</div>
</body>
</html>
BLADE_EOF

# Admin Dashboard View
cat > resources/views/admin/dashboard.blade.php << 'BLADE_EOF'
@extends('layouts.admin')
@section('page-title', 'Dashboard')

@section('header-actions')
    <form action="{{ route('admin.keywords.generate-all') }}" method="POST">
        @csrf
        <button type="submit" class="btn-primary">
            <i class="fas fa-bolt mr-2"></i>Generate All Pending
        </button>
    </form>
@endsection

@section('content')
<!-- Stats Grid -->
<div class="grid grid-cols-4 gap-4 mb-6">
    @foreach([
        ['label'=>'Total Artikel', 'value'=>$stats['totalArticles'], 'icon'=>'newspaper', 'color'=>'indigo'],
        ['label'=>'Total Views', 'value'=>number_format($stats['totalViews']), 'icon'=>'eye', 'color'=>'emerald'],
        ['label'=>'Total Keywords', 'value'=>$stats['totalKeywords'], 'icon'=>'key', 'color'=>'yellow'],
        ['label'=>'Keyword Pending', 'value'=>$stats['pendingKeywords'], 'icon'=>'clock', 'color'=>'red'],
    ] as $stat)
    <div class="card p-5">
        <div class="flex items-center justify-between mb-3">
            <div class="text-slate-400 text-sm">{{ $stat['label'] }}</div>
            <div class="w-9 h-9 rounded-lg bg-{{ $stat['color'] }}-600/20 flex items-center justify-center">
                <i class="fas fa-{{ $stat['icon'] }} text-{{ $stat['color'] }}-400 text-sm"></i>
            </div>
        </div>
        <div class="text-2xl font-bold text-white">{{ $stat['value'] }}</div>
    </div>
    @endforeach
</div>

<div class="grid grid-cols-2 gap-6">
    <!-- Top Articles -->
    <div class="card p-5">
        <h2 class="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <i class="fas fa-fire text-orange-400"></i> Artikel Terpopuler
        </h2>
        <div class="space-y-3">
            @foreach($stats['topArticles'] as $i => $article)
            <div class="flex items-center gap-3">
                <span class="text-slate-600 text-xs w-5">{{ $i+1 }}</span>
                <div class="flex-1 min-w-0">
                    <a href="{{ route('article.show', $article->slug) }}" target="_blank"
                       class="text-sm text-slate-300 hover:text-indigo-400 truncate block">
                        {{ $article->title }}
                    </a>
                </div>
                <span class="text-xs text-slate-500">{{ number_format($article->view_count) }} views</span>
            </div>
            @endforeach
        </div>
    </div>

    <!-- Recent Articles -->
    <div class="card p-5">
        <h2 class="text-sm font-semibold text-slate-300 mb-4 flex items-center gap-2">
            <i class="fas fa-clock text-indigo-400"></i> Artikel Terbaru
        </h2>
        <div class="space-y-3">
            @foreach($recentArticles as $article)
            <div class="flex items-center justify-between gap-3">
                <div class="flex-1 min-w-0">
                    <div class="text-sm text-slate-300 truncate">{{ $article->title }}</div>
                    <div class="text-xs text-slate-500">{{ $article->created_at->diffForHumans() }}</div>
                </div>
                @php
                    $colors = ['published'=>'emerald','review'=>'yellow','draft'=>'slate','failed'=>'red','processing'=>'blue'];
                    $color = $colors[$article->status] ?? 'slate';
                @endphp
                <span class="badge bg-{{ $color }}-900/50 text-{{ $color }}-400">{{ $article->status }}</span>
            </div>
            @endforeach
        </div>
    </div>
</div>
@endsection
BLADE_EOF

# Keyword Admin View
cat > resources/views/admin/keywords/index.blade.php << 'BLADE_EOF'
@extends('layouts.admin')
@section('page-title', 'Manajemen Keywords')

@section('header-actions')
    <form action="{{ route('admin.keywords.generate-all') }}" method="POST">
        @csrf
        <button type="submit" class="btn-primary">
            <i class="fas fa-bolt mr-1"></i> Generate All
        </button>
    </form>
@endsection

@section('content')
<div class="grid grid-cols-3 gap-6">

    <!-- Add Keywords Form -->
    <div class="col-span-1">
        <div class="card p-5">
            <h2 class="text-sm font-bold text-white mb-4 flex items-center gap-2">
                <i class="fas fa-plus-circle text-indigo-400"></i> Tambah Keyword
            </h2>
            <form action="{{ route('admin.keywords.store') }}" method="POST" class="space-y-3">
                @csrf

                <div>
                    <label class="block text-xs text-slate-400 mb-1">Keywords (1 per baris)</label>
                    <textarea name="keywords" rows="6"
                        class="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 focus:border-indigo-500 focus:outline-none"
                        placeholder="cara membuat website&#10;tips SEO pemula&#10;..."></textarea>
                </div>

                <div>
                    <label class="block text-xs text-slate-400 mb-1">AI Provider</label>
                    <select name="ai_provider" class="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white">
                        <option value="openai">OpenAI GPT-4o</option>
                        <option value="claude">Anthropic Claude</option>
                        <option value="gemini">Google Gemini</option>
                        <option value="groq">Groq (Fast)</option>
                    </select>
                </div>

                <div class="grid grid-cols-2 gap-2">
                    <div>
                        <label class="block text-xs text-slate-400 mb-1">Tone</label>
                        <select name="focus_tone" class="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white">
                            <option value="informatif">Informatif</option>
                            <option value="persuasif">Persuasif</option>
                            <option value="review">Review</option>
                            <option value="berita">Berita</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs text-slate-400 mb-1">Kata (target)</label>
                        <input type="number" name="target_words" value="1500" min="500" max="5000"
                            class="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white">
                    </div>
                </div>

                <div>
                    <label class="block text-xs text-slate-400 mb-1">Prioritas (1-10)</label>
                    <input type="range" name="priority" min="1" max="10" value="5" class="w-full">
                </div>

                <button type="submit" class="btn-primary w-full">
                    <i class="fas fa-save mr-2"></i>Tambahkan Keywords
                </button>
            </form>
        </div>
    </div>

    <!-- Keywords Table -->
    <div class="col-span-2">
        <div class="card overflow-hidden">
            <div class="p-4 border-b border-slate-700 flex items-center justify-between">
                <h2 class="text-sm font-bold text-white">Daftar Keywords</h2>
                <form class="flex gap-2" method="GET">
                    <select name="status" onchange="this.form.submit()"
                        class="bg-slate-800 border border-slate-600 rounded px-3 py-1.5 text-xs text-white">
                        <option value="">Semua Status</option>
                        <option value="pending" {{ request('status')=='pending'?'selected':'' }}>Pending</option>
                        <option value="processing" {{ request('status')=='processing'?'selected':'' }}>Processing</option>
                        <option value="done" {{ request('status')=='done'?'selected':'' }}>Done</option>
                        <option value="failed" {{ request('status')=='failed'?'selected':'' }}>Failed</option>
                    </select>
                </form>
            </div>

            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b border-slate-700">
                        <th class="text-left px-4 py-3 text-xs text-slate-500 uppercase">Keyword</th>
                        <th class="text-left px-4 py-3 text-xs text-slate-500 uppercase">Provider</th>
                        <th class="text-left px-4 py-3 text-xs text-slate-500 uppercase">Status</th>
                        <th class="text-left px-4 py-3 text-xs text-slate-500 uppercase">Aksi</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-700/50">
                    @foreach($keywords as $kw)
                    <tr class="hover:bg-slate-700/20 transition-colors">
                        <td class="px-4 py-3">
                            <div class="text-slate-200 font-medium">{{ $kw->keyword }}</div>
                            @if($kw->error_message)
                                <div class="text-xs text-red-400 mt-0.5 truncate max-w-xs" title="{{ $kw->error_message }}">
                                    ⚠ {{ Str::limit($kw->error_message, 60) }}
                                </div>
                            @endif
                        </td>
                        <td class="px-4 py-3">
                            <span class="badge bg-slate-700 text-slate-300">{{ $kw->ai_provider }}</span>
                        </td>
                        <td class="px-4 py-3">
                            @php
                                $colors = ['pending'=>'yellow','processing'=>'blue','done'=>'emerald','failed'=>'red'];
                                $color = $colors[$kw->status] ?? 'slate';
                            @endphp
                            <span class="badge bg-{{ $color }}-900/50 text-{{ $color }}-400">{{ $kw->status }}</span>
                        </td>
                        <td class="px-4 py-3">
                            <div class="flex items-center gap-1.5">
                                @if($kw->status === 'pending')
                                    <form action="{{ route('admin.keywords.generate', $kw) }}" method="POST">
                                        @csrf
                                        <button type="submit" class="btn-primary text-xs px-2.5 py-1">
                                            <i class="fas fa-play"></i>
                                        </button>
                                    </form>
                                @endif
                                @if($kw->status === 'failed')
                                    <form action="{{ route('admin.keywords.retry', $kw) }}" method="POST">
                                        @csrf
                                        <button type="submit" class="btn-success text-xs px-2.5 py-1">
                                            <i class="fas fa-redo"></i>
                                        </button>
                                    </form>
                                @endif
                                @if($kw->article)
                                    <a href="{{ route('admin.articles.show', $kw->article) }}" class="badge bg-indigo-900/50 text-indigo-400 px-2 py-1">
                                        <i class="fas fa-eye text-xs"></i>
                                    </a>
                                @endif
                                <form action="{{ route('admin.keywords.destroy', $kw) }}" method="POST" onsubmit="return confirm('Hapus?')">
                                    @csrf @method('DELETE')
                                    <button type="submit" class="btn-danger text-xs px-2.5 py-1">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                    @endforeach
                </tbody>
            </table>

            <div class="p-4 border-t border-slate-700">
                {{ $keywords->links() }}
            </div>
        </div>
    </div>
</div>
@endsection
BLADE_EOF

# Blog Layout
cat > resources/views/layouts/blog.blade.php << 'BLADE_EOF'
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- SEO Meta Tags -->
    <title>@yield('meta_title', config('ai_engine.seo.site_name'))</title>
    <meta name="description" content="@yield('meta_description', '')">
    @hasSection('meta_keywords')
    <meta name="keywords" content="@yield('meta_keywords')">
    @endif
    @hasSection('canonical')
    <link rel="canonical" href="@yield('canonical')">
    @endif

    <!-- OG Tags -->
    <meta property="og:title" content="@yield('og_title', config('ai_engine.seo.site_name'))">
    <meta property="og:description" content="@yield('og_description', '')">
    <meta property="og:image" content="@yield('og_image', config('ai_engine.seo.default_og_image'))">
    <meta property="og:type" content="@yield('og_type', 'website')">
    <meta property="og:url" content="{{ url()->current() }}">

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="@yield('og_title', '')">
    <meta name="twitter:description" content="@yield('og_description', '')">
    <meta name="twitter:image" content="@yield('og_image', '')">

    <!-- Schema.org -->
    @hasSection('schema_org')
    <script type="application/ld+json">@yield('schema_org')</script>
    @endif
    @hasSection('faq_schema')
    <script type="application/ld+json">@yield('faq_schema')</script>
    @endif

    @if(config('ai_engine.seo.google_analytics'))
    <script async src="https://www.googletagmanager.com/gtag/js?id={{ config('ai_engine.seo.google_analytics') }}"></script>
    <script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','{{ config('ai_engine.seo.google_analytics') }}');</script>
    @endif

    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Merriweather:wght@700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body { font-family: 'Inter', sans-serif; }
        h1,h2,h3 { font-family: 'Merriweather', serif; }
        .prose h2 { @apply text-2xl font-bold mt-8 mb-4 text-gray-900; }
        .prose h3 { @apply text-xl font-bold mt-6 mb-3 text-gray-800; }
        .prose p  { @apply mb-4 leading-relaxed text-gray-700; }
        .prose ul { @apply list-disc pl-6 mb-4 space-y-1 text-gray-700; }
        .prose ol { @apply list-decimal pl-6 mb-4 space-y-1 text-gray-700; }
        .prose blockquote { @apply border-l-4 border-indigo-500 pl-4 italic my-6 text-gray-600; }
        .prose a { @apply text-indigo-600 hover:underline; }
        .prose strong { @apply font-semibold text-gray-900; }
    </style>
</head>
<body class="bg-gray-50 text-gray-900">

<header class="bg-white border-b border-gray-200 sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="{{ route('home') }}" class="text-xl font-bold text-indigo-600">
            {{ config('ai_engine.seo.site_name') }}
        </a>
        <nav class="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="{{ route('blog.index') }}" class="hover:text-indigo-600">Blog</a>
            <a href="/feed.rss" class="hover:text-indigo-600 flex items-center gap-1">
                <svg class="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.38 20 6.18 20C4.98 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/></svg>
                RSS
            </a>
        </nav>
    </div>
</header>

<main>@yield('content')</main>

<footer class="bg-gray-900 text-gray-400 py-12 mt-16">
    <div class="max-w-6xl mx-auto px-4 text-center">
        <div class="text-white font-bold text-lg mb-2">{{ config('ai_engine.seo.site_name') }}</div>
        <p class="text-sm">© {{ date('Y') }} {{ config('ai_engine.seo.site_name') }}. All rights reserved.</p>
        <div class="mt-4 flex items-center justify-center gap-4 text-xs">
            <a href="/sitemap.xml" class="hover:text-white">Sitemap</a>
            <a href="/feed.rss" class="hover:text-white">RSS Feed</a>
        </div>
    </div>
</footer>

</body>
</html>
BLADE_EOF

# Blog Index
cat > resources/views/blog/index.blade.php << 'BLADE_EOF'
@extends('layouts.blog')
@section('meta_title', config('ai_engine.seo.site_name') . ' - Blog SEO')
@section('og_type', 'website')

@section('content')
<div class="max-w-6xl mx-auto px-4 py-10">
    <div class="flex gap-8">

        <!-- Articles Grid -->
        <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900 mb-8">Artikel Terbaru</h1>

            <div class="grid md:grid-cols-2 gap-6">
                @foreach($articles as $article)
                <article class="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    @if($article->featured_image)
                    <img src="{{ $article->featured_image }}" alt="{{ $article->featured_image_alt }}"
                         class="w-full h-48 object-cover">
                    @endif
                    <div class="p-5">
                        @if($article->category)
                        <a href="{{ route('category.show', $article->category->slug) }}"
                           class="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                            {{ $article->category->name }}
                        </a>
                        @endif
                        <h2 class="text-lg font-bold text-gray-900 mt-1 mb-2 leading-tight">
                            <a href="{{ $article->url }}" class="hover:text-indigo-600">{{ $article->title }}</a>
                        </h2>
                        <p class="text-sm text-gray-600 mb-3 line-clamp-2">{{ $article->excerpt }}</p>
                        <div class="flex items-center justify-between text-xs text-gray-400">
                            <span>{{ $article->published_at?->format('d M Y') }}</span>
                            <span>{{ $article->reading_time }} menit baca · {{ number_format($article->view_count) }} views</span>
                        </div>
                    </div>
                </article>
                @endforeach
            </div>

            <div class="mt-8">{{ $articles->links() }}</div>
        </div>

        <!-- Sidebar -->
        <aside class="w-72 flex-shrink-0">
            <!-- Categories -->
            <div class="bg-white rounded-xl border border-gray-200 p-5 mb-6">
                <h2 class="font-bold text-gray-900 mb-4">Kategori</h2>
                <ul class="space-y-2">
                    @foreach($categories as $cat)
                    <li>
                        <a href="{{ route('category.show', $cat->slug) }}"
                           class="flex items-center justify-between text-sm text-gray-600 hover:text-indigo-600">
                            <span>{{ $cat->name }}</span>
                            <span class="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{{ $cat->articles_count }}</span>
                        </a>
                    </li>
                    @endforeach
                </ul>
            </div>

            <!-- Popular Articles -->
            <div class="bg-white rounded-xl border border-gray-200 p-5">
                <h2 class="font-bold text-gray-900 mb-4">Artikel Populer</h2>
                <ul class="space-y-3">
                    @foreach($popular as $i => $p)
                    <li class="flex gap-3">
                        <span class="text-2xl font-bold text-gray-200 leading-none">{{ $i+1 }}</span>
                        <a href="{{ $p->url }}" class="text-sm text-gray-700 hover:text-indigo-600 leading-snug">
                            {{ Str::limit($p->title, 55) }}
                        </a>
                    </li>
                    @endforeach
                </ul>
            </div>
        </aside>
    </div>
</div>
@endsection
BLADE_EOF

# Article Show
cat > resources/views/blog/show.blade.php << 'BLADE_EOF'
@extends('layouts.blog')

@section('meta_title', $article->meta_title)
@section('meta_description', $article->meta_description)
@section('canonical', $article->canonical_url)
@section('og_title', $article->og_title ?? $article->title)
@section('og_description', $article->og_description ?? $article->meta_description)
@section('og_image', $article->og_image ?? $article->featured_image)
@section('og_type', 'article')

@if($article->schema_org)
@section('schema_org', json_encode($article->schema_org, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT))
@endif

@if($article->faq_schema)
@section('faq_schema', json_encode($article->faq_schema, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT))
@endif

@section('content')
<div class="max-w-4xl mx-auto px-4 py-10">

    <!-- Breadcrumbs -->
    @if($article->breadcrumbs)
    <nav class="mb-6 text-sm text-gray-500">
        @foreach($article->breadcrumbs as $i => $crumb)
            @if($i < count($article->breadcrumbs) - 1)
                <a href="{{ $crumb['url'] }}" class="hover:text-indigo-600">{{ $crumb['name'] }}</a>
                <span class="mx-2">›</span>
            @else
                <span class="text-gray-800">{{ $crumb['name'] }}</span>
            @endif
        @endforeach
    </nav>
    @endif

    <!-- Article Header -->
    <header class="mb-8">
        @if($article->category)
        <a href="{{ route('category.show', $article->category->slug) }}"
           class="inline-block text-xs font-bold text-indigo-600 uppercase tracking-widest mb-3">
            {{ $article->category->name }}
        </a>
        @endif

        <h1 class="text-4xl font-bold text-gray-900 leading-tight mb-4">{{ $article->title }}</h1>

        @if($article->headline)
        <p class="text-xl text-gray-600 leading-relaxed mb-4">{{ $article->headline }}</p>
        @endif

        <div class="flex items-center gap-4 text-sm text-gray-500 border-y border-gray-200 py-3">
            <span>📅 {{ $article->published_at?->format('d F Y') }}</span>
            <span>📖 {{ $article->reading_time }} menit baca</span>
            <span>📊 {{ $article->word_count }} kata</span>
            <span>👁 {{ number_format($article->view_count) }} views</span>
            @if($article->seo_score > 0)
            <span class="ml-auto inline-flex items-center gap-1 text-xs">
                <span class="w-2 h-2 rounded-full {{ $article->seo_score >= 80 ? 'bg-green-400' : ($article->seo_score >= 60 ? 'bg-yellow-400' : 'bg-red-400') }}"></span>
                SEO {{ $article->seo_score }}/100
            </span>
            @endif
        </div>
    </header>

    <!-- Featured Image -->
    @if($article->featured_image)
    <figure class="mb-8">
        <img src="{{ $article->featured_image }}" alt="{{ $article->featured_image_alt }}"
             class="w-full rounded-xl shadow-sm object-cover max-h-96">
    </figure>
    @endif

    <!-- Article Content -->
    <div class="prose prose-lg max-w-none mb-10">
        {!! \Illuminate\Support\Str::markdown($article->content) !!}
    </div>

    <!-- FAQ Section (if exists) -->
    @if($article->faq_schema && isset($article->faq_schema['mainEntity']))
    <section class="bg-indigo-50 rounded-xl p-6 mb-8">
        <h2 class="text-xl font-bold text-gray-900 mb-5 flex items-center gap-2">
            ❓ Pertanyaan yang Sering Ditanyakan
        </h2>
        <div class="space-y-4">
            @foreach($article->faq_schema['mainEntity'] as $faq)
            <details class="group bg-white rounded-lg border border-indigo-100">
                <summary class="flex items-center justify-between p-4 cursor-pointer text-gray-900 font-medium">
                    {{ $faq['name'] }}
                    <span class="text-indigo-600 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <div class="px-4 pb-4 text-gray-700 text-sm leading-relaxed">
                    {{ $faq['acceptedAnswer']['text'] }}
                </div>
            </details>
            @endforeach
        </div>
    </section>
    @endif

    <!-- Related Articles -->
    @if($related->isNotEmpty())
    <section>
        <h2 class="text-xl font-bold text-gray-900 mb-5">Artikel Terkait</h2>
        <div class="grid sm:grid-cols-3 gap-4">
            @foreach($related as $rel)
            <a href="{{ $rel->url }}" class="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                @if($rel->featured_image)
                <img src="{{ $rel->featured_image }}" alt="{{ $rel->featured_image_alt }}" class="w-full h-32 object-cover">
                @endif
                <div class="p-3">
                    <h3 class="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 leading-snug line-clamp-2">
                        {{ $rel->title }}
                    </h3>
                </div>
            </a>
            @endforeach
        </div>
    </section>
    @endif
</div>
@endsection
BLADE_EOF

# RSS Feed
cat > resources/views/blog/rss.blade.php << 'BLADE_EOF'
<?= '<?xml version="1.0" encoding="UTF-8"?>' ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
    <channel>
        <title>{{ config('ai_engine.seo.site_name') }}</title>
        <link>{{ config('app.url') }}</link>
        <description>RSS Feed - {{ config('ai_engine.seo.site_name') }}</description>
        <language>id</language>
        <lastBuildDate>{{ now()->toRssString() }}</lastBuildDate>
        <atom:link href="{{ url('/feed.rss') }}" rel="self" type="application/rss+xml"/>
        @foreach($articles as $article)
        <item>
            <title><![CDATA[{{ $article->title }}]]></title>
            <link>{{ $article->url }}</link>
            <description><![CDATA[{{ $article->excerpt }}]]></description>
            <pubDate>{{ $article->published_at?->toRssString() }}</pubDate>
            <guid>{{ $article->url }}</guid>
        </item>
        @endforeach
    </channel>
</rss>
BLADE_EOF

ok "Views dibuat"

# ============================================================
# 20. DATABASE SEEDER
# ============================================================

step "Membuat Seeders..."

cat > database/seeders/DatabaseSeeder.php << 'SEED_EOF'
<?php
namespace Database\Seeders;

use App\Models\Category;
use App\Models\Keyword;
use App\Models\Setting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Categories
        $categories = [
            ['name' => 'Digital Marketing', 'description' => 'Tips dan strategi digital marketing'],
            ['name' => 'SEO & SEM', 'description' => 'Panduan optimasi mesin pencari'],
            ['name' => 'Bisnis Online', 'description' => 'Tips sukses bisnis di era digital'],
            ['name' => 'Teknologi', 'description' => 'Berita dan ulasan teknologi terkini'],
            ['name' => 'Tutorial', 'description' => 'Panduan step-by-step berbagai topik'],
        ];

        foreach ($categories as $cat) {
            Category::firstOrCreate(
                ['slug' => Str::slug($cat['name'])],
                $cat + ['slug' => Str::slug($cat['name'])]
            );
        }

        $this->command->info('✓ Categories seeded');

        // Sample Keywords
        $sampleKeywords = [
            ['keyword' => 'cara membuat website gratis untuk pemula', 'category' => 'Tutorial', 'provider' => 'openai'],
            ['keyword' => 'strategi SEO terbaik 2025', 'category' => 'SEO & SEM', 'provider' => 'claude'],
            ['keyword' => 'tips digital marketing untuk UMKM', 'category' => 'Digital Marketing', 'provider' => 'openai'],
            ['keyword' => 'cara jualan online di shopee', 'category' => 'Bisnis Online', 'provider' => 'groq'],
            ['keyword' => 'apa itu artificial intelligence', 'category' => 'Teknologi', 'provider' => 'gemini'],
        ];

        foreach ($sampleKeywords as $kw) {
            $cat = Category::where('name', $kw['category'])->first();
            Keyword::firstOrCreate(
                ['keyword' => $kw['keyword']],
                [
                    'keyword'      => $kw['keyword'],
                    'category_id'  => $cat?->id,
                    'ai_provider'  => $kw['provider'],
                    'focus_tone'   => 'informatif',
                    'target_words' => 1500,
                    'priority'     => 5,
                    'status'       => 'pending',
                ]
            );
        }

        $this->command->info('✓ Sample keywords seeded');

        // Default Settings
        $settings = [
            ['key' => 'site_name', 'value' => 'AI SEO Blog', 'type' => 'string', 'group' => 'seo'],
            ['key' => 'articles_per_page', 'value' => '12', 'type' => 'integer', 'group' => 'blog'],
            ['key' => 'auto_publish', 'value' => '0', 'type' => 'boolean', 'group' => 'engine'],
        ];

        foreach ($settings as $s) {
            Setting::firstOrCreate(['key' => $s['key']], $s);
        }

        $this->command->info('✓ Settings seeded');
    }
}
SEED_EOF

ok "Seeder dibuat"

# ============================================================
# 21. .ENV SETUP
# ============================================================

step "Menambahkan variabel ke .env..."

cat >> .env << 'ENV_EOF'

# ============================
# AI SEO ENGINE PRO CONFIG
# ============================

# AI PROVIDERS (isi salah satu atau lebih)
AI_PROVIDER=openai
OPENAI_API_KEY=sk-your-openai-key-here
OPENAI_MODEL=gpt-4o

ANTHROPIC_API_KEY=sk-ant-your-claude-key-here
CLAUDE_MODEL=claude-3-5-sonnet-20241022

GEMINI_API_KEY=your-gemini-key-here
GEMINI_MODEL=gemini-1.5-pro

GROQ_API_KEY=your-groq-key-here
GROQ_MODEL=llama-3.3-70b-versatile

# ARTICLE SETTINGS
ARTICLE_MIN_WORDS=1500
ARTICLE_MAX_WORDS=2500
ARTICLE_LANGUAGE=id
ARTICLE_AUTO_PUBLISH=false
ARTICLE_GENERATE_IMAGE=true
ARTICLE_GENERATE_DELAY=5

# IMAGE PROVIDER (unsplash | pexels | dalle)
IMAGE_PROVIDER=unsplash
UNSPLASH_ACCESS_KEY=your-unsplash-key-here
PEXELS_API_KEY=your-pexels-key-here

# SEO CONFIG
SITE_NAME="AI SEO Blog Pro"
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
GSC_VERIFY_CODE=your-gsc-verification-code

# QUEUE (gunakan database atau redis)
QUEUE_CONNECTION=database

# SCHEDULER
KEYWORD_SCHEDULE=true
KEYWORD_CRON="0 8 * * *"
ENV_EOF

ok ".env dikonfigurasi"

# ============================================================
# 22. FINAL MIGRATION & SEED
# ============================================================

step "Menjalankan Migration & Seed..."

php artisan migrate --force
php artisan db:seed --force
php artisan storage:link

ok "Database siap"

# ============================================================
# 23. QUEUE TABLES
# ============================================================

step "Setup Queue Tables..."

php artisan queue:table 2>/dev/null || true
php artisan queue:failed-table 2>/dev/null || true
php artisan migrate --force

ok "Queue tables siap"

# ============================================================
# 24. BUAT README PANDUAN
# ============================================================

cat > PANDUAN.md << 'README_EOF'
# AI SEO Auto Article Engine Pro v2.0

## 🚀 Quick Start

### 1. Setup .env
```env
AI_PROVIDER=openai          # Pilih: openai | claude | gemini | groq
OPENAI_API_KEY=sk-...       # Isi API key provider pilihan
DB_DATABASE=ai_seo_engine   # Set database
```

### 2. Tambah Keyword via Admin Panel
```
http://localhost:8000/admin
```

### 3. Generate Artikel via CLI
```bash
# Generate semua keyword pending (limit 10)
php artisan ai:generate --limit=10

# Generate keyword spesifik
php artisan ai:generate --keyword=5

# Gunakan provider tertentu
php artisan ai:generate --provider=claude --limit=5

# Generate dengan delay 10 detik antar artikel
php artisan ai:generate --delay=10
```

### 4. Jalankan Queue Worker
```bash
php artisan queue:work --tries=3 --timeout=300
```

### 5. Import Keywords dari CSV
```bash
# Format CSV: keyword,tone
php artisan ai:import-keywords keywords.csv --provider=claude --priority=8
```

### 6. Generate Sitemap
```bash
php artisan ai:sitemap
```

---

## 🤖 AI Providers Tersedia

| Provider | Model Default | Kecepatan | Kualitas | Harga |
|----------|--------------|-----------|----------|-------|
| OpenAI   | gpt-4o | Sedang | Sangat Tinggi | Mahal |
| Claude   | claude-3-5-sonnet | Sedang | Sangat Tinggi | Sedang |
| Gemini   | gemini-1.5-pro | Cepat | Tinggi | Murah |
| Groq     | llama-3.3-70b | Sangat Cepat | Baik | Gratis |

---

## 📁 Struktur Utama

```
app/
├── Services/
│   ├── AI/AIContentService.php         # Multi-provider AI
│   ├── SEO/SeoService.php              # SEO scoring & schema
│   ├── InternalLink/InternalLinkService.php
│   ├── Image/ArticleImageService.php   # Auto featured image
│   ├── Scraper/KeywordScraperService.php  # Keyword research
│   └── Analytics/AnalyticsService.php
├── Jobs/
│   ├── GenerateArticleJob.php          # Main job (ShouldQueue)
│   └── GenerateBulkArticlesJob.php
├── Console/Commands/
│   ├── GenerateArticlesCommand.php
│   ├── ImportKeywordsCommand.php
│   └── RegenerateSitemapCommand.php
```

---

## 🗺️ URLs

| URL | Keterangan |
|-----|-----------|
| `/` | Blog homepage |
| `/blog/{slug}` | Artikel detail |
| `/category/{slug}` | Kategori |
| `/sitemap.xml` | XML Sitemap |
| `/feed.rss` | RSS Feed |
| `/admin` | Admin Dashboard |
| `/admin/keywords` | Manajemen Keywords |
| `/admin/articles` | Manajemen Artikel |

---

## 📊 Fitur SEO yang Di-generate Otomatis

- ✅ Meta Title & Description (optimal length)
- ✅ OG Tags (Facebook, WhatsApp)
- ✅ Twitter Card
- ✅ Canonical URL
- ✅ Article Schema.org (JSON-LD)
- ✅ FAQ Schema.org (JSON-LD)
- ✅ Breadcrumb Schema
- ✅ XML Sitemap (auto-update)
- ✅ RSS Feed
- ✅ SEO Score (0-100)
- ✅ Readability Score
- ✅ Internal Linking Otomatis
- ✅ Featured Image Otomatis

---

## ⚙️ Cron Job (Production)

```bash
# Tambah ke crontab server
* * * * * cd /path-to-project && php artisan schedule:run >> /dev/null 2>&1
```

Scheduler akan otomatis:
- Generate 5 artikel pending setiap pukul 08:00
- Regenerate sitemap setiap pukul 02:00

---

## 📋 Format CSV Import Keywords

```csv
keyword,tone
cara membuat website gratis,informatif
tips SEO pemula 2025,informatif
review hosting terbaik indonesia,review
cara jualan online untuk pemula,persuasif
```

README_EOF

ok "Panduan dibuat (PANDUAN.md)"

# ============================================================
# DONE!
# ============================================================

echo ""
echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║         ✅  INSTALASI BERHASIL!  ✅                      ║${NC}"
echo -e "${CYAN}╠══════════════════════════════════════════════════════════╣${NC}"
echo -e "${CYAN}║  AI SEO Auto Article Engine Pro v2.0                     ║${NC}"
echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}📋 YANG SUDAH DIBUAT:${NC}"
echo -e "  ✓ Laravel Project + Packages (Guzzle, Sitemap, Feed, Image)"
echo -e "  ✓ Multi-AI Service (OpenAI, Claude, Gemini, Groq)"
echo -e "  ✓ SEO Service + Schema.org + FAQ Schema"
echo -e "  ✓ Article Image Service (Unsplash/Pexels/DALL-E)"
echo -e "  ✓ Internal Linking Engine"
echo -e "  ✓ Keyword Scraper (Google Suggest + LSI)"
echo -e "  ✓ Analytics & View Tracking"
echo -e "  ✓ Queue System (ShouldQueue + Retry)"
echo -e "  ✓ Admin Panel (Dashboard, Keywords, Articles)"
echo -e "  ✓ Blog Frontend + RSS Feed + Sitemap"
echo -e "  ✓ Artisan Commands (generate, import, sitemap)"
echo -e "  ✓ Scheduler (auto-generate + auto-sitemap)"
echo -e "  ✓ Database (6 tables + migrations + seeder)"
echo ""
echo -e "${YELLOW}⚡ LANGKAH BERIKUTNYA:${NC}"
echo -e "  1. Edit ${GREEN}.env${NC} → isi DB_DATABASE dan API keys"
echo -e "  2. Jalankan: ${GREEN}php artisan serve${NC}"
echo -e "  3. Buka: ${BLUE}http://localhost:8000/admin${NC}"
echo -e "  4. Tambah keyword di Admin > Keywords"
echo -e "  5. Jalankan: ${GREEN}php artisan ai:generate${NC}"
echo -e "  6. Worker: ${GREEN}php artisan queue:work --tries=3${NC}"
echo ""
echo -e "${BLUE}📖 Baca PANDUAN.md untuk dokumentasi lengkap${NC}"
echo ""
