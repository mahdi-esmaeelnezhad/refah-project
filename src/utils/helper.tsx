// 1403 - 07 - 08 / 13:55
import { useEffect, useState } from 'react'

const JalaliDate = () => {
  const [dateTime, setDateTime] = useState('')

  useEffect(() => {
    const formatJalali = () => {
      const now = new Date()

      const dateFormatter = new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })

      const timeFormatter = new Intl.DateTimeFormat('fa-IR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })

      const [year, month, day] = dateFormatter.format(now).split('/')
      const time = timeFormatter.format(now)

      setDateTime(`${year} - ${month} - ${day} / ${time}`)
    }

    formatJalali()
    const interval = setInterval(formatJalali, 60000) // update every minute

    return () => clearInterval(interval)
  }, [])

  return <div>{dateTime}</div>
}

export default JalaliDate
