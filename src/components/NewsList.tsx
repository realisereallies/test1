import React, { useEffect, useState, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchLatestNews, showMoreNews } from '../store/slices/newsSlice'
import NewsItem from './NewsItem'
import loadIcon from '../assets/load.svg'
import './NewsList.css'

const NewsList: React.FC = () => {
  const dispatch = useAppDispatch()
  const { items, allItems, displayedCount, loading, error, isInitialLoad } = useAppSelector((state) => state.news)
  const [newGroups, setNewGroups] = useState<Set<string>>(new Set())
  const prevDisplayedCount = useRef(0)


  useEffect(() => {
    dispatch(fetchLatestNews())
  }, [dispatch])

  // Auto-refresh every 30 seconds - show 10 more stories
  useEffect(() => {
    const interval = setInterval(() => {
      if (displayedCount < allItems.length) {
        dispatch(showMoreNews())
      }
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [dispatch, displayedCount, allItems.length])

  // Track new groups when displayedCount changes
  useEffect(() => {
    if (displayedCount > prevDisplayedCount.current && prevDisplayedCount.current > 0) {
      const newItems = items.slice(prevDisplayedCount.current)
      const newGroupDates = new Set(newItems.map(news => new Date(news.pub_date).toDateString()))
      setNewGroups(newGroupDates)
      
      // Clear animation after 1 second
      setTimeout(() => {
        setNewGroups(new Set())
      }, 1000)
    }
    prevDisplayedCount.current = displayedCount
  }, [displayedCount, items])

  const groupedNews = items.reduce((groups, news) => {
    const date = new Date(news.pub_date).toDateString()
    if (!groups[date]) {
      groups[date] = []
    }
    groups[date].push(news)
    return groups
  }, {} as Record<string, typeof items>)

  const formatGroupDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `News for ${day}.${month}.${year}`
  }

  if (error) {
    return (
      <div className="news-list__error">
        <p>Ошибка загрузки новостей: {error}</p>
        <button onClick={() => window.location.reload()}>
          Попробовать снова
        </button>
      </div>
    )
  }

  if (isInitialLoad && loading) {
    return (
      <div className="news-list__loading">
        <div className="news-list__loading-dots">
          <div className="news-list__loading-dot"></div>
          <div className="news-list__loading-dot"></div>
          <div className="news-list__loading-dot"></div>
        </div>
      </div>
    )
  }


  return (
    <div className="news-list">
      {Object.entries(groupedNews)
        .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
        .map(([date, newsItems]) => (
        <div 
          key={date} 
          className={`news-list__group ${newGroups.has(date) ? 'news-list__group--new' : ''}`}
        >
          <h2 className="news-list__group-date">{formatGroupDate(date)}</h2>
          {newsItems.map((news, index) => (
            <NewsItem key={`${news.web_url}-${index}`} news={news} />
          ))}
        </div>
      ))}
      
      <div className="news-list__auto-loading">
        <img src={loadIcon} alt="Loading..." className="news-list__loading-icon" />
      </div>
    </div>
  )
}

export default NewsList
