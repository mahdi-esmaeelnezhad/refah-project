import { Button } from '../../Ui/Button/button'
import Input from '../../Ui/Input/input'

export function Content({ children = '' }) {
  return (
    <section
      style={{
        position: 'fixed',
        width: '1575px',
        height: '848px',
        left: '53px',
        top: '100px'
      }}
    >
      {children}
      <div
        style={{
          position: 'absolute',
          width: '988px',
          height: '846px',
          right: 0,
          top: 0,
          background: '#FFFFFF',
          borderRadius: '10px'
        }}
        className='p-8'
      >
        <div className='flex items-center justify-between gap-8 max-h-10'>
          <Input
            placeholder='بارکد کالا را وارد کنید'
            hasButton
            buttonText='ثبت بارکد'
            value=''
            onChange={() => {}}
            style={{
              minWidth: '441px'
            }}
          />

          <Button label='مشتری' color='#DAA51A'></Button>
          <Button label='ذخیره' color='#4973DE'></Button>
          <Button label='حذف' color='#DE4949'></Button>
        </div>

        <div className='flex items-center justify-between gap-8 max-h-10 mt-8'>
          <span className='bg-[#D1D1D1] font-21 text-black px-4 py-2 rounded-md'>
            فاکتور فروش 256
          </span>
          <Input
            placeholder='معصومه ده بالا'
            value=''
            onChange={() => {}}
            style={{
              minWidth: '441px'
            }}
          />
          <span className='bg-[#D1D1D1] font-21 text-black px-4 py-2 rounded-md'>
            تعداد اقلام ۳
          </span>
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          width: '568px',
          height: '846px',
          left: 0,
          top: 0,
          background: '#FFFFFF',
          borderRadius: '10px'
        }}
        className='p-8'
      >
        left
      </div>
    </section>
  )
}
