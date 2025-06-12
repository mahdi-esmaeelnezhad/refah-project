import { useState } from 'react'
import JalaliDate from '../../../utils/helper'
import {
  CalendarIcon,
  NofiIcon,
  SavedFactorsIcon,
  WifiIcon,
  ProductsIcon,
  SearchIcon
} from '../../icons'
import Input from '../../Ui/Input/input'

export function NavBar({ children = '' }) {
  const [searchProduct, setSearchProduct] = useState('')

  return (
    <>
      <section
        style={{
          position: 'fixed',
          width: '1575px',
          height: '42px',
          left: '53px',
          top: '22px'
        }}
        className='flex items-center gap-[26px]'
      >
        {children}
        <span
          className='bg-primary text-white rounded-2xl h-10 p-2 flex justify-center items-center gap-3 px-4 min-w-[286px] font-23'
          onClick={() => console.log('Clicked')}
        >
          <SavedFactorsIcon />
          فاکتورهای ذخیره شده
        </span>

        <span
          className='bg-primary text-white rounded-2xl h-10 p-2 flex justify-center items-center gap-3 px-4 min-w-[186px] font-23'
          onClick={() => console.log('Clicked')}
        >
          <ProductsIcon />
          محصولات
        </span>

        <Input
          value={searchProduct}
          onChange={(e) => setSearchProduct(e.target.value)}
          placeholder='کالای مورد نظر خود را جستجو کنید'
          style={{ minWidth: '484px', marginBottom: 0 }}
          suffix={<SearchIcon />}
          height={42}
        />

        <span
          className='bg-primary text-white rounded-2xl h-10 p-2 flex justify-center items-center gap-3 font-23 px-4 min-w-36'
          onClick={() => console.log('Clicked')}
        >
          <NofiIcon />
          اعلانات
        </span>

        <span
          className='bg-primary text-white rounded-2xl h-10 p-2 flex justify-center items-center gap-4 font-23 px-4  min-w-[302px]'
          onClick={() => console.log('Clicked')}
        >
          <JalaliDate />
          <CalendarIcon />
        </span>

        <span
          className='bg-primary rounded-2xl h-10 w-10 p-2 flex justify-center items-center'
          onClick={() => console.log('Clicked')}
        >
          <WifiIcon />
        </span>
      </section>
    </>
  )
}
