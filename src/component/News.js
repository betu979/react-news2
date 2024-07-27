import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component'

const News = (props) => {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
    updateNews();
    // eslint-disable-next-line
  }, [])
 
  const updateNews = async () =>{
    props.setProgress(0)
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`
    let data = await fetch(url);
    props.setProgress(30)
    let parsedData = await data.json()

    await setArticles(articles.concat(parsedData.articles))
    await setLoading(false)
    await setPage(page + 1)
    await setTotalResults(parsedData.totalResults)
    props.setProgress(100)
  }
 /*
  const handlePrevClick = async ()=>{
    await setPage(page - 1)
    updateNews()
  }

  const handleNextClick = async ()=>{
    await setPage(page + 1)
    updateNews()
  } */

  const fetchMoreData = async ()=> await updateNews();
  

 
    return (
      <div>
      {/* <div className='container my-2 my-md-3'> */}
        <h1 className='text-center mb-3 mb-md-4' style={{marginTop: '90px'}}>NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines</h1>
         {loading && <Spinner/>}
         {/* <div className='row'> */}
          {/* {!loading && articles.map((element)=>{
            return <div className="col-12 col-md-4 mb-3" key={element.url}>
              <NewsItem title={element.title?element.title.slice(0, 45):''} description={element.description?element.description.slice(0, 88):''} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
          </div>
          })} */}
          
           <InfiniteScroll 
            dataLength={articles.length}
            next={fetchMoreData} 
            hasMore={articles.length !== totalResults}
            loader={<Spinner/>}
          > 
            <div className='container my-2'>
              <div className='row'>
              
          {articles.map((element)=>{
            return <div className="col-12 col-md-4 mb-3" key={element.url} >
              <NewsItem title={element.title?element.title.slice(0, 45):''} description={element.description?element.description.slice(0, 88):''} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
          </div>
          })}
          </div>
            </div>
          </InfiniteScroll>
         {/* </div> */}
        {/* <div className='conrainer d-flex justify-content-between'>
          <button disabled={page<=1} type='button' className='btn btn-dark' onClick={handlePrevClick}> &larr; Previous</button>
          <button disabled={page + 1 > Math.ceil(totalResults/props.pageSize)} type='button' className='btn btn-dark' onClick={handleNextClick}> Next &rarr; </button>
        </div> */}
       {/* </div> */}
       </div>
    )
}

News.defaultProps = {
  country: 'in',
  pageSize: 8,
  category: 'general',
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
}

export default News
