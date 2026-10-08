import React from 'react'
import { ABOUT, EXPERTISE } from '@/data/profile'

const SubHeader = () => {
  return (
    <div className='relative w-full md:flex-1 z-10 flex flex-col items-start'>
      <div className='w-full text-base sm:text-lg md:text-xl lg:text-2xl flex flex-col gap-4 md:gap-5 leading-relaxed text-left'>
        {ABOUT.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className='about-inline-services w-full mt-8 md:mt-12 h-auto'>
        <div className='about-inline-services__head'>
          <span className='about-inline-services__label'>EXPERTISE</span>
        </div>
        <div className='about-inline-services__grid'>
          {EXPERTISE.map((item) => (
            <article key={item.title} className='about-inline-services__item'>
              <h4>{item.title}</h4>
              <p>{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}

export default SubHeader
