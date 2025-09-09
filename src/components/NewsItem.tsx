import React from 'react'
import { type NewsItem as NewsItemType } from '../store/slices/newsSlice'
import './NewsItem.css'

interface NewsItemProps {
  news: NewsItemType
}

const NewsItem: React.FC<NewsItemProps> = ({ news }) => {
  const handleClick = () => {
    window.open(news.web_url, '_blank')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    })
  }

  const getImageUrl = () => {
    if (news.multimedia && news.multimedia.length > 0) {
      const image = news.multimedia.find(img => img.subtype === 'thumbnail') || 
                   news.multimedia.find(img => img.subtype === 'thumbLarge') ||
                   news.multimedia[0]
      
      if (image) {
        return image.url.startsWith('http') ? image.url : `https://www.nytimes.com/${image.url}`
      }
    }
    return null
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = '/load-img'
    e.currentTarget.alt = 'Изображение недоступно'
  }

  return (
    <div className="news-item" onClick={handleClick}>
      <div className="news-item__image">
        {getImageUrl() ? (
          <img 
            src={getImageUrl()!} 
            alt={news.abstract} 
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <img 
            src="/load-img" 
            alt="Изображение недоступно"
            loading="lazy"
          />
        )}
      </div>
      <div className="news-item__content">
        <span className="news-item__subtitle">CNN</span>
        <h3 className="news-item__title">{news.abstract}</h3>
        <p className="news-item__source">{news.source}</p>
        <p className="news-item__date">{formatDate(news.pub_date)}</p>
      </div>
    </div>
  )
}

export default NewsItem
