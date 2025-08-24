'use client'

import Link from 'next/link'
import Navigation from '@/components/Navigation'
import CodeBlock from '@/components/CodeBlock'
import FeatureCard from '@/components/FeatureCard'
import { motion } from 'framer-motion'
import { 
  Code2, Zap, Shield, Users, Package, Globe, 
  Heart, Share2, MessageCircle, LogIn, BarChart3, Settings,
  Play, FileText, Bookmark, Hash
} from 'lucide-react';
import { Share, FacebookProvider, Login, EmbeddedVideo } from 'react-facebook';

const quickStartCode = `import { FacebookProvider, Login, useFacebook } from 'react-facebook';

function App() {
  return (
    <FacebookProvider appId="YOUR_APP_ID">
      <Login
        scope="email,public_profile"
        onSuccess={(response) => console.log('Login Success!', response)}
        onError={(error) => console.log('Login Failed!', error)}
      >
        Login with Facebook
      </Login>
    </FacebookProvider>
  );
}`

const features = [
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized bundle size with lazy loading and tree-shaking support',
    gradient: 'from-yellow-400 to-orange-500'
  },
  {
    icon: Shield,
    title: 'Type Safe',
    description: 'Full TypeScript support with comprehensive type definitions',
    gradient: 'from-green-400 to-emerald-500'
  },
  {
    icon: Users,
    title: 'Social Components',
    description: 'Pre-built components for login, share, like, and more',
    gradient: 'from-blue-400 to-indigo-500'
  },
  {
    icon: Package,
    title: 'Modern React',
    description: 'Built with hooks, context, and latest React patterns',
    gradient: 'from-purple-400 to-pink-500'
  },
  {
    icon: Globe,
    title: 'i18n Support',
    description: 'Built-in internationalization with dynamic locale switching',
    gradient: 'from-cyan-400 to-blue-500'
  },
  {
    icon: BarChart3,
    title: 'Facebook Pixel',
    description: 'Integrated Facebook Pixel tracking for analytics',
    gradient: 'from-red-400 to-rose-500'
  }
]

const components = [
  { name: 'Login', icon: LogIn, description: 'Facebook login with customizable UI' },
  { name: 'ShareButton', icon: Share2, description: 'Share button with custom styling' },
  { name: 'Share', icon: Share2, description: 'Share dialog for Facebook' },
  { name: 'Like', icon: Heart, description: 'Facebook like button' },
  { name: 'Comments', icon: MessageCircle, description: 'Embedded Facebook comments' },
  { name: 'CommentsCount', icon: Hash, description: 'Get comment count for URLs' },
  { name: 'Page', icon: Globe, description: 'Embed Facebook page plugin' },
  { name: 'EmbeddedPost', icon: FileText, description: 'Embed Facebook posts' },
  { name: 'EmbeddedVideo', icon: Play, description: 'Embed Facebook videos' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-facebook/10 via-transparent to-cyan-500/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              React Facebook
              <span className="block text-facebook mt-2">SDK Integration Made Simple</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              Modern React components and hooks for seamless Facebook SDK integration. 
              Type-safe, performant, and developer-friendly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/playground"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-facebook text-white 
                         font-medium hover:bg-facebook-dark transition-colors duration-200"
              >
                Try Live Demo
              </Link>
              <Link
                href="/getting-started"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-facebook 
                         font-medium border-2 border-facebook hover:bg-facebook hover:text-white 
                         transition-colors duration-200"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Demo Section */}
      <section className="py-20 bg-white">
        <FacebookProvider appId="671184534658954">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              See It In Action
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Real Facebook components working with live data - no setup required
            </p>
            
            {/* Live Examples */}
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
              {/* Login Example */}
              <div className="bg-gray-50 rounded-lg p-6 flex flex-col">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <LogIn className="w-5 h-5 mr-2 text-facebook" />
                  Facebook Login
                </h3>
                <div className="mb-4">
                  <Login
                    scope="email,public_profile"
                    onSuccess={(response) => {
                      console.log('Login Success!', response)
                      alert('Login successful! Check console for details.')
                    }}
                    onError={(error) => {
                      console.log('Login Failed!', error)
                      alert('Login failed! Check console for details.')
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    <span>Login with Facebook</span>
                  </Login>
                </div>
                <div className="flex-1">
                  <CodeBlock 
                    code={`<Login
  scope="email,public_profile"
  onSuccess={(response) => console.log('Success!', response)}
  onError={(error) => console.log('Error!', error)}
>
  Login with Facebook
</Login>`}
                    language="tsx"
                    showLineNumbers={false}
                  />
                </div>
              </div>

              {/* Share Example */}
              <div className="bg-gray-50 rounded-lg p-6 flex flex-col">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <Share2 className="w-5 h-5 mr-2 text-facebook" />
                  Share Button
                </h3>
                <div className="mb-4">
                  <Share 
                    href="https://github.com/seeden/react-facebook" 
                    layout="box_count" 
                    size="large" 
                  />
                </div>
                <div className="flex-1">
                  <CodeBlock 
                    code={`<Share 
  href="https://github.com/seeden/react-facebook"
  layout="box_count" 
  size="large"
/>`}
                    language="tsx"
                    showLineNumbers={false}
                  />
                </div>
              </div>

              {/* Embedded Video Example */}
              <div className="bg-gray-50 rounded-lg p-6 flex flex-col">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2 text-facebook" />
                  Embedded Video
                </h3>
                <div className="mb-4">
                  <EmbeddedVideo 
                    href="https://www.facebook.com/Meta/videos/1038522214125952"
                    showText={false}
                    autoPlay={false}
                    allowFullScreen={true}
                  />
                </div>
                <div className="flex-1">
                  <CodeBlock 
                    code={`<EmbeddedVideo
  href="https://www.facebook.com/Meta/videos/1038522214125952"
  showText={false}
  autoPlay={false}
/>`}
                    language="tsx"
                    showLineNumbers={false}
                  />
                </div>
              </div>

              {/* Facebook Pixel Example */}
              <div className="bg-gray-50 rounded-lg p-6 flex flex-col">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-facebook" />
                  Facebook Pixel Tracking
                </h3>
                <div className="mb-4">
                  <div className="space-y-2">
                    <button 
                      className="w-full px-4 py-2 bg-facebook text-white rounded hover:bg-facebook-dark transition-colors"
                      onClick={() => console.log('Purchase event tracked')}
                    >
                      Track Purchase Event
                    </button>
                    <p className="text-sm text-gray-600">Opens browser console to show tracking</p>
                  </div>
                </div>
                <div className="flex-1">
                  <CodeBlock 
                    code={`const { track } = usePixel();

// Track a purchase
await track('Purchase', {
  value: 29.99,
  currency: 'USD'
});`}
                    language="tsx"
                    showLineNumbers={false}
                  />
                </div>
              </div>
            </div>

            <div className="text-center mt-8">
              <Link
                href="/playground"
                className="inline-flex items-center px-6 py-3 rounded-lg bg-facebook text-white 
                         font-medium hover:bg-facebook-dark transition-colors duration-200"
              >
                Try More Components →
              </Link>
            </div>
          </motion.div>
        </div>
        </FacebookProvider>
      </section>

      {/* Quick Start */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Quick Start
            </h2>
            <div className="grid lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-xl font-semibold mb-4">Get up and running in minutes</h3>
                <ol className="space-y-4">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-facebook text-white rounded-full 
                                   flex items-center justify-center font-semibold mr-3">1</span>
                    <div>
                      <p className="font-medium">Install the package</p>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                        npm install react-facebook
                      </code>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-facebook text-white rounded-full 
                                   flex items-center justify-center font-semibold mr-3">2</span>
                    <div>
                      <p className="font-medium">Add FacebookProvider to your app</p>
                      <p className="text-sm text-gray-600 mt-1">Wrap your app with the provider component</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-facebook text-white rounded-full 
                                   flex items-center justify-center font-semibold mr-3">3</span>
                    <div>
                      <p className="font-medium">Start using components</p>
                      <p className="text-sm text-gray-600 mt-1">Import and use any Facebook component</p>
                    </div>
                  </li>
                </ol>
              </div>
              <div>
                <CodeBlock code={quickStartCode} language="tsx" title="App.tsx" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              Why Choose React Facebook?
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <FeatureCard {...feature} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Components Showcase */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
              Rich Component Library
            </h2>
            <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
              Pre-built, customizable components for all Facebook SDK features
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {components.map((component, index) => (
                <motion.div
                  key={component.name}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  viewport={{ once: true }}
                  className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="flex items-start space-x-4">
                    <component.icon className="w-8 h-8 text-facebook flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{component.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{component.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Call-to-Action Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
            >
              Who's Using React Facebook?
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Join the growing community of companies and developers building amazing experiences with react-facebook
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">Production Ready</h3>
                    <p className="text-gray-500 text-sm">Trusted by companies worldwide</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  From startups to enterprise applications, react-facebook powers social integrations for millions of users globally.
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-900">Real Impact</h3>
                    <p className="text-gray-500 text-sm">Measurable business results</p>
                  </div>
                </div>
                <p className="text-gray-600">
                  Companies report improved user engagement, reduced development time, and seamless Facebook integration experiences.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white"
            >
              <h3 className="text-2xl font-bold mb-4">Share Your Success Story</h3>
              <p className="text-blue-100 mb-6">
                Are you using react-facebook in production? We'd love to showcase your implementation and help other developers discover proven solutions.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
                  <span className="text-blue-100">Get featured on our website</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
                  <span className="text-blue-100">Build community credibility</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mr-3"></div>
                  <span className="text-blue-100">Help shape future development</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href="/testimonials"
                  className="block w-full bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg 
                           hover:bg-blue-50 transition-colors duration-200 text-center"
                >
                  Share Your Story
                </Link>
                <p className="text-blue-200 text-sm text-center">
                  Looking for companies using this library • Privacy respected
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-facebook to-facebook-dark">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to integrate Facebook into your React app?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join the community of developers and companies building with React Facebook
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/playground"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-white text-facebook 
                       font-medium hover:bg-gray-100 transition-colors duration-200"
            >
              Try Live Demo
            </Link>
            <Link
              href="/getting-started"
              className="inline-flex items-center px-6 py-3 rounded-lg bg-white/10 text-white 
                       font-medium border-2 border-white/30 hover:bg-white/20 
                       transition-colors duration-200"
            >
              Get Started Guide
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}