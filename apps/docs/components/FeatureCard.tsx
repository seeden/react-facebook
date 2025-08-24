import { LucideIcon } from 'lucide-react'

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  gradient?: string
}

export default function FeatureCard({ icon: Icon, title, description, gradient = 'from-blue-500 to-cyan-500' }: FeatureCardProps) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 
                      blur transition duration-500 group-hover:duration-200 rounded-xl"
           style={{
             backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`
           }}
      />
      <div className="relative bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-shadow duration-300">
        <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${gradient} flex items-center justify-center mb-4`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  )
}