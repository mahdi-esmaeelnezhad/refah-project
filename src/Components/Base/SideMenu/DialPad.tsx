import { EnterIcon, TickIcon } from '../../icons'

type DialButtonProps = {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

const DialButton = ({ children, className = '', onClick }: DialButtonProps) => (
  <button
    onClick={onClick}
    className={`rounded-lg flex items-center justify-center h-16 w-16 active:opacity-75 transition-transform ${className}`}
  >
    {children}
  </button>
)

export function DialPad({
  value,
  onChange
}: {
  value: string
  onChange: (newValue: string) => void
}) {
  const handlePress = (input: string) => {
    if (input === 'enter') {
      // optionally handle enter key if needed
      console.log('enter')
    } else if (input === 'tick') {
      // optionally handle tick key if needed
      console.log('tick')
    } else {
      onChange(value + input)
    }
  }

  return (
    <div className='w-[330px] h-[320px] p-4 font-23 flex flex-col gap-2'>
      {/* Top Row */}
      <div className='flex items-center justify-between gap-2'>
        <DialButton
          className='bg-coming-soon h-16 w-20'
          onClick={() => handlePress('enter')}
        >
          <EnterIcon />
        </DialButton>
        <DialButton className='bg-our-choice' onClick={() => handlePress('3')}>
          3
        </DialButton>
        <DialButton className='bg-our-choice' onClick={() => handlePress('2')}>
          2
        </DialButton>
        <DialButton className='bg-our-choice' onClick={() => handlePress('1')}>
          1
        </DialButton>
      </div>

      {/* Remaining Pad */}
      <div className='flex gap-2'>
        <DialButton
          className='bg-success h-[214px] min-w-20'
          onClick={() => handlePress('tick')}
        >
          <TickIcon />
        </DialButton>
        <div className='flex flex-col gap-2'>
          <div className='flex gap-2'>
            <DialButton
              className='bg-our-choice'
              onClick={() => handlePress('6')}
            >
              6
            </DialButton>
            <DialButton
              className='bg-our-choice'
              onClick={() => handlePress('5')}
            >
              5
            </DialButton>
            <DialButton
              className='bg-our-choice'
              onClick={() => handlePress('4')}
            >
              4
            </DialButton>
          </div>
          <div className='flex gap-2'>
            <DialButton
              className='bg-our-choice'
              onClick={() => handlePress('9')}
            >
              9
            </DialButton>
            <DialButton
              className='bg-our-choice'
              onClick={() => handlePress('8')}
            >
              8
            </DialButton>
            <DialButton
              className='bg-our-choice'
              onClick={() => handlePress('7')}
            >
              7
            </DialButton>
          </div>
          <div className='flex gap-2'>
            <DialButton
              className='bg-our-choice'
              onClick={() => handlePress('.')}
            >
              .
            </DialButton>
            <DialButton
              className='bg-our-choice w-[138px]'
              onClick={() => handlePress('0')}
            >
              0
            </DialButton>
          </div>
        </div>
      </div>
    </div>
  )
}
