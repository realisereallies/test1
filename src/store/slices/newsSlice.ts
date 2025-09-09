import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

export interface NewsItem {
  abstract: string
  web_url: string
  multimedia: Array<{
    url: string
    format: string
    height: number
    width: number
    type: string
    subtype: string
    caption: string
    copyright: string
  }>
  pub_date: string
  source: string
  headline?: {
    main: string
  }
  byline?: {
    original: string
  }
}

export interface NewsState {
  items: NewsItem[]
  allItems: NewsItem[]
  displayedCount: number
  loading: boolean
  autoLoading: boolean
  error: string | null
  hasMore: boolean
  lastFetchTime: number | null
  isInitialLoad: boolean
}

const initialState: NewsState = {
  items: [],
  allItems: [],
  displayedCount: 10,
  loading: false,
  autoLoading: false,
  error: null,
  hasMore: true,
  lastFetchTime: null,
  isInitialLoad: true,
}

// Async thunk for fetching news
export const fetchNews = createAsyncThunk(
  'news/fetchNews',
  async ({ year, month }: { year: number; month: number }) => {
    const apiKey = import.meta.env.VITE_NYT_API_KEY || 'gVajdQX2lW2Qdn7LMOdBpYDYd5owBo2e'
    const url = `https://api.nytimes.com/svc/archive/v1/${year}/${month}.json?api-key=${apiKey}`
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      }
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    return data.response.docs
  }
)

// Async thunk for fetching latest news (Top Stories)
export const fetchLatestNews = createAsyncThunk(
  'news/fetchLatestNews',
  async () => {
    const apiKey = import.meta.env.VITE_NYT_API_KEY || 'gVajdQX2lW2Qdn7LMOdBpYDYd5owBo2e'
    const url = `https://api.nytimes.com/svc/topstories/v2/home.json?api-key=${apiKey}`
    
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      }
    })
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Convert Top Stories to NewsItem format
    const mappedStories = data.results.map((story: {
      abstract: string;
      url: string;
      multimedia?: Array<{
        url: string;
        subtype?: string;
      }>;
      published_date: string;
      source: string;
      title: string;
      byline: string;
    }) => ({
      abstract: story.abstract,
      web_url: story.url,
      multimedia: story.multimedia || [],
      pub_date: story.published_date,
      source: story.source,
      headline: { main: story.title },
      byline: { original: story.byline },
    }))
    
    return { stories: mappedStories, timestamp: Date.now() }
  }
)

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    showMoreNews: (state) => {
      if (state.displayedCount < state.allItems.length) {
        state.displayedCount += 10
        state.items = state.allItems.slice(0, state.displayedCount)
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNews.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = false
        state.items = [...state.items, ...action.payload]
        state.hasMore = action.payload.length > 0
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch news'
      })
      .addCase(fetchLatestNews.pending, (state) => {
        if (state.isInitialLoad) {
          state.loading = true
        } else {
          state.autoLoading = true
        }
        state.error = null
      })
      .addCase(fetchLatestNews.fulfilled, (state, action) => {
        state.loading = false
        state.autoLoading = false
        state.lastFetchTime = action.payload.timestamp
        
        // Use all stories from API response
        
        if (state.isInitialLoad) {
          // First load: store all stories and show first 10
          state.allItems = action.payload.stories
          state.displayedCount = 10 // Reset to 10 for first load
          state.items = state.allItems.slice(0, state.displayedCount)
          state.isInitialLoad = false
        } else {
          // Auto-refresh: show 10 more stories
          if (state.displayedCount < state.allItems.length) {
            state.displayedCount += 10
            state.items = state.allItems.slice(0, state.displayedCount)
          }
        }
      })
      .addCase(fetchLatestNews.rejected, (state, action) => {
        state.loading = false
        state.autoLoading = false
        state.error = action.error.message || 'Failed to fetch latest news'
      })
  },
})

export const { clearError, showMoreNews } = newsSlice.actions
export default newsSlice.reducer
