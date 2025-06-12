import JalaliDate from '../../../utils/helper'
import {
  CalendarIcon,
  NofiIcon,
  SavedFactorsIcon,
  WifiIcon,
  ProductsIcon
} from '../../icons'
import Input from '../../Ui/Input/input'

export function NavBar({ children = '' }) {
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
        className='flex items-center gap-[18px]'
      >
        {children}
        <span
          className='bg-primary text-white rounded-2xl h-10 p-2 flex justify-center items-center gap-2 px-4'
          onClick={() => console.log('Clicked')}
        >
          <SavedFactorsIcon />
          فاکتورهای ذخیره شده
        </span>

        <span
          className='bg-primary text-white rounded-2xl h-10 p-2 flex justify-center items-center gap-2 px-4'
          onClick={() => console.log('Clicked')}
        >
          <ProductsIcon />
          محصولات
        </span>

        <Input
          value={''}
          onChange={function (e: React.ChangeEvent<HTMLInputElement>): void {
            throw new Error('Function not implemented.')
          }}
        />

        <span
          className='bg-primary text-white rounded-2xl h-10 p-2 flex justify-center items-center gap-2 px-4'
          onClick={() => console.log('Clicked')}
        >
          <NofiIcon />
          اعلانات
        </span>

        <span
          className='bg-primary text-white rounded-2xl h-10 p-2 flex justify-center items-center gap-4 px-4'
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
