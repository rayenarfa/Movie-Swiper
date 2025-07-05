import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Heart, User, Zap } from 'lucide-react'

const BottomNav = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      path: '/home',
    },
    {
      id: 'swipe',
      label: 'Swipe',
      icon: Zap,
      path: '/swipe',
    },
    {
      id: 'saved',
      label: 'Saved',
      icon: Heart,
      path: '/saved',
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/profile',
    }
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 pt-2">
      <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-md mx-auto">
        <div className="flex items-center justify-around py-3">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon

            return (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate(item.path)}
                className={`relative flex flex-col items-center space-y-1 py-2 px-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'text-white' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {/* Active Background */}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl shadow-lg"
                  />
                )}
                
                {/* Icon */}
                <div className="relative z-10">
                  <Icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full shadow-sm"
                    />
                  )}
                </div>
                
                {/* Label */}
                <span className={`text-xs font-medium relative z-10 ${
                  isActive ? 'text-white' : 'text-white/60'
                }`}>
                  {item.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default BottomNav 