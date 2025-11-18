import express from "express";
import axios from "axios";
import * as cheerio from "cheerio";

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());

class FinalSpotifyPlaylistScraper {
  constructor() {
    this.cookieJar = new Map(); // Simple cookie storage
  }

  // Extract playlist ID from various URL formats
  extractPlaylistId(url) {
    const patterns = [
      /playlist\/([a-zA-Z0-9]+)/,
      /\/([a-zA-Z0-9]{22})/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  }

  // Try alternative data sources and techniques
  async scrapePlaylist(url) {
    const playlistId = this.extractPlaylistId(url);
    if (!playlistId) {
      throw new Error('Could not extract playlist ID from URL');
    }

    console.log(`🎯 Final attempt for playlist: ${playlistId}`);

    const strategies = [
      // Strategy 1: Try with cookies and referrer chain
      {
        name: 'Cookie-based Session',
        method: () => this.scrapeWithCookies(playlistId)
      },
      // Strategy 2: Try the embed endpoint with different parameters
      {
        name: 'Enhanced Embed',
        method: () => this.scrapeEmbed(playlistId)
      },
      // Strategy 3: Try accessing playlist metadata via different endpoints
      {
        name: 'Metadata Scraping',
        method: () => this.scrapeMetadata(playlistId)
      },
      // Strategy 4: Try with Accept: application/json
      {
        name: 'JSON Request',
        method: () => this.requestAsJSON(playlistId)
      },
      // Strategy 5: Search-based approach
      {
        name: 'Search-based',
        method: () => this.searchBasedApproach(playlistId)
      }
    ];

    const results = [];
    
    for (const strategy of strategies) {
      try {
        console.log(`\n🔄 Trying: ${strategy.name}`);
        const result = await strategy.method();
        
        if (result) {
          console.log(`✅ ${strategy.name} returned data`);
          result.method = strategy.name;
          results.push(result);
          
          // If we got tracks, return immediately
          if (result.tracks && result.tracks.length > 0) {
            return result;
          }
        }
      } catch (error) {
        console.log(`❌ ${strategy.name} failed: ${error.message}`);
      }
      
      // Small delay between attempts
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Return the best result we got, even if no tracks
    if (results.length > 0) {
      return {
        ...results[0],
        allAttempts: results.length,
        warning: "Could not extract track data - Spotify's protection is very strong"
      };
    }

    throw new Error('All extraction strategies failed');
  }

  // Strategy 1: Enhanced cookie-based session
  async scrapeWithCookies(playlistId) {
    console.log('🍪 Attempting cookie-based session...');
    
    // Step 1: Get initial cookies from homepage
    const homeHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };

    let cookies = '';
    
    try {
      const homeResponse = await axios.get('https://open.spotify.com', { 
        headers: homeHeaders,
        timeout: 10000 
      });
      
      if (homeResponse.headers['set-cookie']) {
        cookies = homeResponse.headers['set-cookie']
          .map(cookie => cookie.split(';')[0])
          .join('; ');
        console.log('🍪 Got cookies from homepage');
      }
    } catch (e) {
      console.log('⚠️ Homepage request failed, continuing without cookies');
    }

    // Step 2: Request playlist with cookies
    const playlistHeaders = {
      ...homeHeaders,
      'Referer': 'https://open.spotify.com/',
      'Cookie': cookies
    };

    const response = await axios.get(
      `https://open.spotify.com/playlist/${playlistId}`,
      { headers: playlistHeaders, timeout: 15000 }
    );

    return this.parseResponse(response.data, 'Cookie Session');
  }

  // Strategy 2: Enhanced embed approach
  async scrapeEmbed(playlistId) {
    console.log('🔗 Trying embed approach...');
    
    const embedUrls = [
      `https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`,
      `https://open.spotify.com/embed/playlist/${playlistId}?theme=0`,
      `https://open.spotify.com/embed/playlist/${playlistId}?si=web_player&nd=1`,
    ];

    for (const embedUrl of embedUrls) {
      try {
        console.log(`🔗 Trying: ${embedUrl}`);
        
        const response = await axios.get(embedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; EmbedBot/1.0)',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Referer': 'https://example.com/'
          },
          timeout: 10000
        });

        const result = this.parseResponse(response.data, `Embed: ${embedUrl}`);
        if (result.tracks.length > 0) {
          return result;
        }
      } catch (e) {
        console.log(`❌ Embed URL failed: ${e.message}`);
      }
    }

    return null;
  }

  // Strategy 3: Try to get metadata from different sources
  async scrapeMetadata(playlistId) {
    console.log('📊 Trying metadata extraction...');
    
    // Try oEmbed endpoint (if it exists)
    const oEmbedUrls = [
      `https://open.spotify.com/oembed?url=https://open.spotify.com/playlist/${playlistId}`,
      `https://embed.spotify.com/oembed/?url=https://open.spotify.com/playlist/${playlistId}`,
    ];

    for (const oEmbedUrl of oEmbedUrls) {
      try {
        console.log(`📊 Trying oEmbed: ${oEmbedUrl}`);
        const response = await axios.get(oEmbedUrl, { timeout: 10000 });
        
        if (response.data && response.data.title) {
          console.log('✅ oEmbed data found');
          return {
            name: response.data.title.replace(' - playlist by', '').replace(' | Spotify', ''),
            description: response.data.author_name ? `Created by ${response.data.author_name}` : '',
            tracks: [],
            trackCount: 0,
            source: 'oEmbed',
            rawData: response.data
          };
        }
      } catch (e) {
        console.log(`❌ oEmbed failed: ${e.message}`);
      }
    }

    return null;
  }

  // Strategy 4: Request as JSON
  async requestAsJSON(playlistId) {
    console.log('📄 Trying JSON request...');
    
    const jsonHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Content-Type': 'application/json',
    };

    try {
      const response = await axios.get(
        `https://open.spotify.com/playlist/${playlistId}`,
        { headers: jsonHeaders, timeout: 10000 }
      );

      // Even if we get HTML, try to parse it differently
      return this.parseResponse(response.data, 'JSON Request');
    } catch (e) {
      console.log(`❌ JSON request failed: ${e.message}`);
      return null;
    }
  }

  // Strategy 5: Search-based approach (try to find playlist via search)
  async searchBasedApproach(playlistId) {
    console.log('🔍 Trying search-based approach...');
    
    // This is a long shot - try to search for playlists
    const searchEndpoints = [
      `https://open.spotify.com/search/${playlistId}`,
      `https://open.spotify.com/search/playlist:${playlistId}`,
    ];

    for (const searchUrl of searchEndpoints) {
      try {
        const response = await axios.get(searchUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          },
          timeout: 10000
        });

        const result = this.parseResponse(response.data, 'Search-based');
        if (result.name !== 'Unknown Playlist') {
          return result;
        }
      } catch (e) {
        console.log(`❌ Search failed: ${e.message}`);
      }
    }

    return null;
  }

  // Enhanced response parsing
  parseResponse(html, method) {
    console.log(`📊 Parsing ${method} - Length: ${html.length}`);
    
    const $ = cheerio.load(html);
    
    // Extract basic info
    const title = $('title').text() || '';
    const ogTitle = $('meta[property="og:title"]').attr('content') || '';
    const ogDescription = $('meta[property="og:description"]').attr('content') || '';
    const description = $('meta[name="description"]').attr('content') || '';
    
    // Debug info
    console.log(`📋 Title: "${title}"`);
    console.log(`📋 OG Title: "${ogTitle}"`);
    console.log(`📋 Description: "${description}"`);

    // Look for any JSON data more aggressively
    const allScripts = [];
    $('script').each((i, elem) => {
      const content = $(elem).html();
      if (content && content.length > 50) {
        allScripts.push({
          index: i,
          length: content.length,
          hasJSON: content.trim().startsWith('{') || content.trim().startsWith('['),
          hasPlaylist: content.toLowerCase().includes('playlist'),
          hasTrack: content.toLowerCase().includes('track'),
          preview: content.substring(0, 100)
        });
      }
    });

    console.log(`🔍 Found ${allScripts.length} substantial scripts`);
    
    // Try to extract tracks from any JSON-like content
    let tracks = [];
    let bestName = 'Unknown Playlist';
    
    // Determine best name
    if (ogTitle && !ogTitle.includes('Spotify') && ogTitle !== 'Spotify – Web Player') {
      bestName = ogTitle;
    } else if (title && !title.includes('Web Player') && title !== 'Spotify') {
      bestName = title.replace(' | Spotify', '').replace(' - playlist by', '');
    }

    // Try to parse any promising scripts
    for (const script of allScripts) {
      if (script.hasJSON || script.hasPlaylist || script.hasTrack) {
        try {
          const scriptContent = $('script').eq(script.index).html();
          console.log(`🔍 Examining script ${script.index} (${script.length} chars)`);
          
          // Try to find JSON within the script
          const jsonMatches = scriptContent.match(/\{[^}]*"name"[^}]*\}/g) || [];
          const arrayMatches = scriptContent.match(/\[[^\]]*"name"[^\]]*\]/g) || [];
          
          console.log(`  Found ${jsonMatches.length} JSON objects and ${arrayMatches.length} arrays with "name"`);
          
          for (const match of [...jsonMatches, ...arrayMatches]) {
            try {
              const parsed = JSON.parse(match);
              if (parsed.name && parsed.artists) {
                tracks.push({
                  title: parsed.name,
                  artist: Array.isArray(parsed.artists) ? 
                    parsed.artists.map(a => a.name || a).join(', ') : 
                    parsed.artists.name || parsed.artists,
                  album: parsed.album?.name || parsed.album || 'Unknown Album',
                  duration: this.formatDuration(parsed.duration_ms || 0)
                });
              }
            } catch (e) {
              // Continue trying other matches
            }
          }
        } catch (e) {
          console.log(`❌ Error parsing script ${script.index}: ${e.message}`);
        }
      }
    }

    return {
      name: bestName,
      description: ogDescription || description || '',
      tracks: tracks.slice(0, 50), // Limit tracks
      trackCount: tracks.length,
      scrapedAt: new Date().toISOString(),
      debug: {
        htmlLength: html.length,
        scriptsFound: allScripts.length,
        title: title,
        ogTitle: ogTitle,
        method: method,
        tracksExtracted: tracks.length
      }
    };
  }

  formatDuration(ms) {
    if (!ms) return '0:00';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

// Alternative: Create a simple working demo with mock data
class MockPlaylistGenerator {
  generateMockPlaylist(url) {
    const playlistId = url.match(/playlist\/([a-zA-Z0-9]+)/)?.[1] || 'unknown';
    
    // Generate some realistic-looking mock data
    const mockTracks = [
      { title: "Shape of You", artist: "Ed Sheeran", album: "÷ (Divide)", duration: "3:53" },
      { title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: "3:20" },
      { title: "Someone Like You", artist: "Adele", album: "21", duration: "4:45" },
      { title: "Uptown Funk", artist: "Mark Ronson, Bruno Mars", album: "Uptown Special", duration: "4:30" },
      { title: "Bad Guy", artist: "Billie Eilish", album: "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?", duration: "3:14" }
    ];

    return {
      name: `Demo Playlist ${playlistId.substring(0, 8)}`,
      description: "This is a demo response since Spotify blocks scraping. Real implementation would require official API or browser automation.",
      tracks: mockTracks,
      trackCount: mockTracks.length,
      url: url,
      method: "Demo/Mock Data",
      scrapedAt: new Date().toISOString(),
      warning: "⚠️ This is mock data. Spotify actively blocks web scraping.",
      alternatives: [
        "Use Spotify Web API with proper authentication",
        "Use a browser extension that runs in user context",
        "Use services like last.fm or musicbrainz for metadata",
        "Consider other music platforms that are more scraping-friendly"
      ]
    };
  }
}

const scraper = new FinalSpotifyPlaylistScraper();
const mockGenerator = new MockPlaylistGenerator();

// Routes
app.get("/", (req, res) => {
  res.json({
    status: "Final Spotify Scraper + Demo Service",
    message: "Spotify actively blocks web scraping. This service tries advanced techniques but also provides demo functionality.",
    endpoints: {
      "/scrape": "GET - Attempt real scraping with all techniques",
      "/demo": "GET - Return mock data to show expected format",
      "/info": "GET - Information about why Spotify scraping is difficult"
    }
  });
});

app.get("/scrape", async (req, res) => {
  const { url, mock } = req.query;

  if (!url) {
    return res.status(400).json({
      error: "URL parameter is required",
      example: "/scrape?url=https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M"
    });
  }

  // If mock parameter is provided, return mock data
  if (mock === 'true') {
    return res.json(mockGenerator.generateMockPlaylist(url));
  }

  try {
    console.log(`\n🚀 Final scraping attempt for: ${url}`);
    const result = await scraper.scrapePlaylist(url);
    
    res.json({
      ...result,
      metadata: {
        success: true,
        timestamp: new Date().toISOString(),
        realData: result.tracks.length > 0
      }
    });

  } catch (error) {
    console.error('❌ All strategies failed:', error.message);
    
    // Return mock data as fallback with explanation
    const mockResult = mockGenerator.generateMockPlaylist(url);
    res.json({
      ...mockResult,
      error: "Real scraping failed - returning demo data",
      errorDetails: error.message,
      realScrapingFailed: true
    });
  }
});

app.get("/demo", (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).json({ error: "URL parameter required" });
  }
  
  res.json(mockGenerator.generateMockPlaylist(url));
});

app.get("/info", (req, res) => {
  res.json({
    title: "Why Spotify Scraping Is Nearly Impossible",
    challenges: [
      "Advanced bot detection systems",
      "Dynamic content loading via JavaScript",
      "Sophisticated fingerprinting techniques",
      "Rate limiting and IP blocking",
      "Legal restrictions and Terms of Service",
      "Frequent changes to page structure"
    ],
    recommendations: [
      {
        option: "Spotify Web API",
        pros: ["Official", "Reliable", "Legal"],
        cons: ["Requires authentication", "Rate limited", "Not truly public"],
        url: "https://developer.spotify.com/documentation/web-api"
      },
      {
        option: "Browser Extension",
        pros: ["Runs in user context", "No bot detection"],
        cons: ["Requires user installation", "Platform specific"]
      },
      {
        option: "Alternative Services",
        pros: ["More scraping-friendly", "Different data sources"],
        cons: ["Different ecosystems", "May not have same content"],
        examples: ["Last.fm", "MusicBrainz", "YouTube Music"]
      }
    ]
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Final Spotify Solution running on http://localhost:${PORT}`);
  console.log(`💡 Try: /scrape?url=PLAYLIST_URL&mock=true for demo data`);
  console.log(`📚 Info: /info for explanation of challenges`);
});