import { useEffect } from 'react'

interface ToastProps {
  message: string
  type?: 'error' | 'success' | 'info'
  onClose: () => void
}

export const Toast = ({ message, type = 'error', onClose }: ToastProps) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500)
    return () => clearTimeout(timer)
  }, [onClose])

  const colors = {
    error: {
      bg: 'linear-gradient(135deg, rgba(220, 38, 38, 0.9) 0%, rgba(185, 28, 28, 0.9) 100%)',
      border: '#ef4444',
      shadow: 'rgba(220, 38, 38, 0.5)',
    },
    success: {
      bg: 'linear-gradient(135deg, rgba(34, 197, 94, 0.9) 0%, rgba(22, 163, 74, 0.9) 100%)',
      border: '#22c55e',
      shadow: 'rgba(34, 197, 94, 0.5)',
    },
    info: {
      bg: 'linear-gradient(135deg, rgba(59, 130, 246, 0.9) 0%, rgba(37, 99, 235, 0.9) 100%)',
      border: '#3b82f6',
      shadow: 'rgba(59, 130, 246, 0.5)',
    },
  }

  const style = colors[type]

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: style.bg,
        color: '#fff',
        padding: '16px 32px',
        borderRadius: '12px',
        border: `2px solid ${style.border}`,
        boxShadow: `0 8px 25px ${style.shadow}, inset 0 1px 0 rgba(255, 255, 255, 0.2)`,
        fontFamily: '"Cinzel", serif',
        fontSize: '1.1rem',
        fontWeight: 600,
        letterSpacing: '1px',
        zIndex: 9999,
        animation: 'slideDown 0.3s ease-out',
      }}
    >
      {message}
      <style>
        {`
          @keyframes slideDown {
            from {
              transform: translateX(-50%) translateY(-100px);
              opacity: 0;
            }
            to {
              transform: translateX(-50%) translateY(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  )
}
