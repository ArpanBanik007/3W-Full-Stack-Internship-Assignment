import React from 'react'
import UpperFeedpage from '../feed/UpperFeed'
import MainFeed from '../feed/MainFeed'
import Navbar from '../home/Navbar'

function HomePage() {
  return (
    <>
      <Navbar/>
      <UpperFeedpage/>
      <MainFeed/>
    </>
  )
}

export default HomePage
