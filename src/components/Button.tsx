import type { IconType } from 'react-icons'

type ButtonProps = {
  id?: string
  title: string
  leftIcon?: React.ReactElement<IconType>
  rightIcon?: React.ReactElement<IconType>
  containerClass?: string
  onClick?: () => void
}

export default function Button({
  id,
  title,
  leftIcon,
  rightIcon,
  containerClass = '',
  onClick
}: ButtonProps) {
  return (
    <button
      id={id}
      className={`group relative z-10 w-fit cursor-pointer overflow-hidden rounded-full bg-violet-50 px-7 py-3 text-black ${containerClass}`}
      onClick={onClick}
      type="button"
    >
      {leftIcon && <span className="">{leftIcon}</span>}
      <span className="relative inline-flex overflow-hidden font-general text-xs uppercase">
        <div>{title}</div>
      </span>
      {rightIcon && <span className="">{rightIcon}</span>}
    </button>
  )
}
