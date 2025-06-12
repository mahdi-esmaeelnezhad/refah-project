import React from 'react'
import styles from './radioButton.module.css'

interface RadioButtonProps {
  name: string
  value: string
  selected: boolean
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  children?: React.ReactNode
}

export const Radio: React.FC<RadioButtonProps> = ({
  name,
  value,
  selected,
  onChange,
  disabled = false,
  children = null
}) => {
  const id = `${name}-${value}`

  return (
    <div className={`${styles.wrapper} ${disabled ? styles.disabled : ''}`}>
      <input
        type='radio'
        id={id}
        name={name}
        value={value}
        checked={selected}
        onChange={onChange}
        disabled={disabled}
        className={styles.hiddenRadio}
      />
      <label
        role='radio'
        htmlFor={id}
        aria-checked={selected}
        className={`${styles.customRadio} ${selected ? styles.selected : ''}`}
      >
        {children}
      </label>
    </div>
  )
}
