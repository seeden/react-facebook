'use client'

import { useState, useEffect } from 'react'
import { useFacebook } from 'react-facebook'
import { 
  FacebookProvider, 
  Like, 
  Share, 
  Login,
  Comments, 
  CommentsCount,
  Page, 
  EmbeddedPost, 
  EmbeddedVideo,
  ShareButton
} from 'react-facebook'
import Navigation from '@/components/Navigation'
import LiveExample from '@/components/LiveExample'
import { PropControl, TextInput, Select, Checkbox, NumberInput } from '@/components/PropControl'
import { motion } from 'framer-motion'
import Link from 'next/link'

const FACEBOOK_APP_ID = '671184534658954'

function PixelDemo() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => alert('Pixel tracking demo - Install react-facebook in your project to see real tracking!')}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Track Purchase
        </button>
        <button
          onClick={() => alert('Pixel tracking demo - Install react-facebook in your project to see real tracking!')}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Track ViewContent
        </button>
        <button
          onClick={() => alert('Pixel tracking demo - Install react-facebook in your project to see real tracking!')}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
        >
          Track Custom Event
        </button>
        <button
          onClick={() => alert('Pixel tracking demo - Install react-facebook in your project to see real tracking!')}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          Track PageView
        </button>
        <button
          onClick={() => alert('Pixel tracking demo - Install react-facebook in your project to see real tracking!')}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
        >
          Grant Consent
        </button>
        <button
          onClick={() => alert('Pixel tracking demo - Install react-facebook in your project to see real tracking!')}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Revoke Consent
        </button>
      </div>
      <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
        <strong>Demo:</strong> These buttons simulate Facebook Pixel events. In your app with the react-facebook package, these would trigger real tracking events to Facebook.
      </div>
    </div>
  )
}


function PlaygroundPageContent({ appId, setAppId, locale, setLocale }: { appId: string, setAppId: (id: string) => void, locale: string, setLocale: (locale: string) => void }) {
  // Like Button Props
  const [likeHref, setLikeHref] = useState('https://github.com/seeden/react-facebook')
  const [likeLayout, setLikeLayout] = useState<'standard' | 'box_count' | 'button_count' | 'button'>('standard')
  const [likeSize, setLikeSize] = useState<'small' | 'large'>('small')
  const [likeShowFaces, setLikeShowFaces] = useState(false)
  const [likeShare, setLikeShare] = useState(false)
  const [likeColorScheme, setLikeColorScheme] = useState<'light' | 'dark'>('light')

  // Share Button Props
  const [shareHref, setShareHref] = useState('https://github.com/seeden/react-facebook')
  const [shareSize, setShareSize] = useState<'small' | 'large'>('small');
  const [shareLayout, setShareLayout] = useState<'box_count' | 'button_count' | 'button' | 'icon_link'>('button');

  // Login Button Props
  const [loginScope, setLoginScope] = useState('public_profile,email')
  const [loginRenderType, setLoginRenderType] = useState<'default' | 'custom' | 'function'>('default')
  const [loginButtonText, setLoginButtonText] = useState('Login with Facebook')
  const [loginFields, setLoginFields] = useState('id,name,email,picture')

  // Comments Props
  const [commentsHref, setCommentsHref] = useState('https://github.com/seeden/react-facebook')
  const [commentsNumPosts, setCommentsNumPosts] = useState(10)
  const [commentsOrderBy, setCommentsOrderBy] = useState<'reverse_time' | 'time'>('reverse_time')
  const [commentsWidth, setCommentsWidth] = useState('550')
  const [commentsColorScheme, setCommentsColorScheme] = useState<'light' | 'dark'>('light')

  // Page Plugin Props
  const [pageHref, setPageHref] = useState('https://www.facebook.com/meta')
  const [pageTabs, setPageTabs] = useState('timeline')
  const [pageWidth, setPageWidth] = useState(340)
  const [pageHeight, setPageHeight] = useState(500)
  const [pageSmallHeader, setPageSmallHeader] = useState(false)
  const [pageHideCover, setPageHideCover] = useState(false)
  const [pageShowFacepile, setPageShowFacepile] = useState(true)

  // Embedded Post Props
  const [postHref, setPostHref] = useState('https://www.facebook.com/reel/1730774764310324')
  const [postWidth, setPostWidth] = useState('500')
  const [postShowText, setPostShowText] = useState(true)

  // Embedded Video Props
  const [videoHref, setVideoHref] = useState('https://www.facebook.com/Meta/videos/1038522214125952')
  const [videoWidth, setVideoWidth] = useState('500')
  const [videoShowText, setVideoShowText] = useState(true)
  const [videoAutoPlay, setVideoAutoPlay] = useState(false)
  const [videoShowCaptions, setVideoShowCaptions] = useState(false)
  const [videoAllowFullScreen, setVideoAllowFullScreen] = useState(true)

  // Comments Count Props
  const [commentsCountHref, setCommentsCountHref] = useState('https://github.com/seeden/react-facebook')



  // ShareButton Props
  const [shareButtonHref, setShareButtonHref] = useState('https://github.com/seeden/react-facebook')
  const [shareButtonHashtag, setShareButtonHashtag] = useState('#reactfacebook')



  const generateLikeCode = () => `<Like
  href="${likeHref}"
  layout="${likeLayout}"
  size="${likeSize}"
  showFaces={${likeShowFaces}}
  share={${likeShare}}
  colorScheme="${likeColorScheme}"
/>`

  const generateShareCode = () => `<Share 
  href="${shareHref}"
  size="${shareSize}"
  layout="${shareLayout}"
/>`

  const generateLoginCode = () => {
    const scopeArray = loginScope.split(',').map(s => `'${s.trim()}'`).join(', ')
    const fieldsArray = loginFields.split(',').map(s => `'${s.trim()}'`).join(', ')
    
    if (loginRenderType === 'function') {
      return `<Login
  scope={[${scopeArray}]}
  fields={[${fieldsArray}]}
  onSuccess={(response) => console.log('Login Success!', response)}
  onError={(error) => console.log('Login Failed!', error)}
  onProfileSuccess={(profile) => console.log('Profile:', profile)}
>
  {({ onClick, isLoading, isDisabled }) => (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
    >
      {isLoading ? 'Loading...' : '${loginButtonText}'}
    </button>
  )}
</Login>`
    } else if (loginRenderType === 'custom') {
      return `<Login
  scope={[${scopeArray}]}
  fields={[${fieldsArray}]}
  onSuccess={(response) => console.log('Login Success!', response)}
  onError={(error) => console.log('Login Failed!', error)}
  onProfileSuccess={(profile) => console.log('Profile:', profile)}
  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800"
>
  ${loginButtonText}
</Login>`
    } else {
      return `<Login
  scope={[${scopeArray}]}
  fields={[${fieldsArray}]}
  onSuccess={(response) => console.log('Login Success!', response)}
  onError={(error) => console.log('Login Failed!', error)}
  onProfileSuccess={(profile) => console.log('Profile:', profile)}
>
  ${loginButtonText}
</Login>`
    }
  }

  const generateCommentsCode = () => `<Comments
  href="${commentsHref}"
  numPosts={${commentsNumPosts}}
  orderBy="${commentsOrderBy}"
  width={${commentsWidth}}
  colorScheme="${commentsColorScheme}"
/>`

  const generatePageCode = () => `<Page
  href="${pageHref}"
  tabs="${pageTabs}"
  width={${pageWidth}}
  height={${pageHeight}}
  smallHeader={${pageSmallHeader}}
  hideCover={${pageHideCover}}
  showFacepile={${pageShowFacepile}}
/>`

  const generatePostCode = () => `<EmbeddedPost
  href="${postHref}"
  width={${postWidth}}
  showText={${postShowText}}
/>`

  const generateVideoCode = () => `<EmbeddedVideo
  href="${videoHref}"
  width={${videoWidth}}
  showText={${videoShowText}}
  autoPlay={${videoAutoPlay}}
  showCaptions={${videoShowCaptions}}
  allowFullScreen={${videoAllowFullScreen}}
/>`

  const generateCommentsCountCode = () => `<CommentsCount href="${commentsCountHref}" />`


  const generateShareButtonCode = () => `<ShareButton 
  href="${shareButtonHref}"${shareButtonHashtag ? `
  hashtag="${shareButtonHashtag}"` : ''}
  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
>
  Share on Facebook
</ShareButton>`


  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Live Demo</h1>
            <p className="text-lg text-gray-600">
              Interactive Facebook components with real API integration. Modify properties and see instant results.
            </p>

            {/* App ID Configuration */}
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-3 flex items-center">
                <svg className="w-5 h-5 text-gray-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                </svg>
                Facebook App Configuration
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook App ID
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={appId}
                      onChange={(e) => setAppId(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="Enter your Facebook App ID"
                    />
                    <button
                      onClick={() => setAppId(FACEBOOK_APP_ID)}
                      className="px-3 py-2 text-xs bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors whitespace-nowrap"
                    >
                      Reset
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Locale
                  </label>
                  <select
                    value={locale}
                    onChange={(e) => setLocale(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="en_US">English (US)</option>
                    <option value="en_GB">English (UK)</option>
                    <option value="es_ES">Español (España)</option>
                    <option value="es_LA">Español (Latinoamérica)</option>
                    <option value="fr_FR">Français (France)</option>
                    <option value="de_DE">Deutsch</option>
                    <option value="it_IT">Italiano</option>
                    <option value="pt_BR">Português (Brasil)</option>
                    <option value="pt_PT">Português (Portugal)</option>
                    <option value="ru_RU">Русский</option>
                    <option value="ja_JP">日本語</option>
                    <option value="ko_KR">한국어</option>
                    <option value="zh_CN">中文(简体)</option>
                    <option value="zh_TW">中文(繁體)</option>
                    <option value="ar_AR">العربية</option>
                    <option value="hi_IN">हिन्दी</option>
                    <option value="tr_TR">Türkçe</option>
                    <option value="pl_PL">Polski</option>
                    <option value="nl_NL">Nederlands</option>
                    <option value="sv_SE">Svenska</option>
                    <option value="da_DK">Dansk</option>
                    <option value="no_NO">Norsk</option>
                    <option value="fi_FI">Suomi</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                💡 Use your own Facebook App ID to test with your app's configuration. Components will update immediately when you change the App ID or locale.
              </p>
            </div>
          </div>

          <div className="space-y-12">
            {/* Share Dialog */}
            <LiveExample
              title="Share Dialog"
              description="Open Facebook's share dialog with custom parameters"
              code={generateShareCode()}
              controls={
                <>
                  <PropControl label="URL to Share" description="The URL that will be shared">
                    <TextInput
                      value={shareHref}
                      onChange={setShareHref}
                      placeholder="https://example.com"
                    />
                  </PropControl>

                  <PropControl label="Layout" description="Button layout style">
                    <Select
                      value={shareLayout}
                      onChange={(value) => setShareLayout(value as any)}
                      options={[
                        { value: 'box_count', label: 'Box Count' },
                        { value: 'button_count', label: 'Button Count' },
                        { value: 'button', label: 'Button' },
                        { value: 'icon_link', label: 'Icon Link' }
                      ]}
                    />
                  </PropControl>

                  <PropControl label="Size" description="Button size">
                    <Select
                      value={shareSize}
                      onChange={(value) => setShareSize(value as any)}
                      options={[
                        { value: 'small', label: 'Small' },
                        { value: 'large', label: 'Large' }
                      ]}
                    />
                  </PropControl>
                </>
              }
            >
              <Share 
                href={shareHref}
                size={shareSize}
                layout={shareLayout}
              />
            </LiveExample>

            {/* Share Button */}
            <LiveExample
              title="Share Button"
              description="Alternative share button implementation using JavaScript SDK"
              code={generateShareButtonCode()}
              controls={
                <>
                  <PropControl label="URL to Share" description="The URL that will be shared">
                    <TextInput
                      value={shareButtonHref}
                      onChange={setShareButtonHref}
                      placeholder="https://example.com"
                    />
                  </PropControl>
                  
                  <PropControl label="Hashtag" description="Optional hashtag for the share (e.g., #reactfacebook)">
                    <TextInput
                      value={shareButtonHashtag}
                      onChange={setShareButtonHashtag}
                      placeholder="#reactfacebook"
                    />
                  </PropControl>
                </>
              }
            >
              <ShareButton 
                href={shareButtonHref}
                hashtag={shareButtonHashtag || undefined}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/>
                </svg>
                <span>Share on Facebook</span>
              </ShareButton>
            </LiveExample>

            {/* Login Button */}
            <LiveExample
              title="Login Button"
              description="Facebook login with custom scope permissions"
              code={generateLoginCode()}
              controls={
                <>
                  <PropControl label="Render Type" description="How to render the login component">
                    <Select
                      value={loginRenderType}
                      onChange={setLoginRenderType}
                      options={[
                        { value: 'default', label: 'Default Button' },
                        { value: 'custom', label: 'Custom Styled' },
                        { value: 'function', label: 'Children Function' }
                      ]}
                    />
                  </PropControl>

                  <PropControl label="Button Text" description="Text to display in the button">
                    <TextInput
                      value={loginButtonText}
                      onChange={setLoginButtonText}
                      placeholder="Login with Facebook"
                    />
                  </PropControl>

                  <PropControl label="Permissions Scope" description="Comma-separated list of permissions">
                    <TextInput
                      value={loginScope}
                      onChange={setLoginScope}
                      placeholder="public_profile,email"
                    />
                  </PropControl>

                  <PropControl label="Profile Fields" description="Fields to fetch from user profile">
                    <TextInput
                      value={loginFields}
                      onChange={setLoginFields}
                      placeholder="id,name,email,picture"
                    />
                  </PropControl>
                </>
              }
            >
              {loginRenderType === 'function' ? (
                <Login
                  scope={loginScope.split(',').map(s => s.trim())}
                  fields={loginFields.split(',').map(s => s.trim())}
                  onSuccess={(response) => {
                    console.log('Login Success!', response)
                    alert('Login successful! Check console for details.')
                  }}
                  onError={(error) => {
                    console.log('Login Failed!', error)
                    alert('Login failed! Check console for details.')
                  }}
                  onProfileSuccess={(profile) => {
                    console.log('Profile:', profile)
                    alert('Profile fetched! Check console for details.')
                  }}
                >
                  {({ onClick, isLoading, isDisabled }) => (
                    <button
                      onClick={onClick}
                      disabled={isDisabled}
                      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      {isLoading ? 'Loading...' : loginButtonText}
                    </button>
                  )}
                </Login>
              ) : (
                <Login
                  scope={loginScope.split(',').map(s => s.trim())}
                  fields={loginFields.split(',').map(s => s.trim())}
                  onSuccess={(response) => {
                    console.log('Login Success!', response)
                    alert('Login successful! Check console for details.')
                  }}
                  onError={(error) => {
                    console.log('Login Failed!', error)
                    alert('Login failed! Check console for details.')
                  }}
                  onProfileSuccess={(profile) => {
                    console.log('Profile:', profile)
                    alert('Profile fetched! Check console for details.')
                  }}
                  className={loginRenderType === 'custom' 
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all" 
                    : "bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                  }
                >
                  {loginRenderType === 'custom' ? (
                    loginButtonText
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                      <span>{loginButtonText}</span>
                    </>
                  )}
                </Login>
              )}
            </LiveExample>

            {/* Like Button */}
            <LiveExample
              title="Like Button"
              description={
                <div>
                  <p className="text-sm text-gray-600">Facebook like button with customizable layout and appearance</p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="w-4 h-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-2">
                        <p className="text-xs text-amber-700">
                          Users in EU/EEA countries and the UK will not see this component unless they are logged into Facebook and have consented to cookies.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              }
              code={generateLikeCode()}
              controls={
                <>
                  <PropControl label="URL to Like" description="The URL that will be liked">
                    <TextInput
                      value={likeHref}
                      onChange={setLikeHref}
                      placeholder="https://example.com"
                    />
                  </PropControl>
                  
                  <PropControl label="Layout" description="Button layout style">
                    <Select
                      value={likeLayout}
                      onChange={(value) => setLikeLayout(value as any)}
                      options={[
                        { value: 'standard', label: 'Standard' },
                        { value: 'box_count', label: 'Box Count' },
                        { value: 'button_count', label: 'Button Count' },
                        { value: 'button', label: 'Button' }
                      ]}
                    />
                  </PropControl>

                  <PropControl label="Size" description="Button size">
                    <Select
                      value={likeSize}
                      onChange={(value) => setLikeSize(value as any)}
                      options={[
                        { value: 'small', label: 'Small' },
                        { value: 'large', label: 'Large' }
                      ]}
                    />
                  </PropControl>

                  <PropControl label="Color Scheme" description="Light or dark theme">
                    <Select
                      value={likeColorScheme}
                      onChange={(value) => setLikeColorScheme(value as any)}
                      options={[
                        { value: 'light', label: 'Light' },
                        { value: 'dark', label: 'Dark' }
                      ]}
                    />
                  </PropControl>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={likeShowFaces}
                      onChange={setLikeShowFaces}
                    />
                    <span className="text-sm">Show faces</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={likeShare}
                      onChange={setLikeShare}
                    />
                    <span className="text-sm">Include share button</span>
                  </div>
                </>
              }
            >
              <Like
                href={likeHref}
                layout={likeLayout}
                size={likeSize}
                showFaces={likeShowFaces}
                share={likeShare}
                colorScheme={likeColorScheme}
              />
            </LiveExample>

            {/* Comments */}
            <LiveExample
              title="Comments Plugin"
              description={
                <div>
                  <p className="text-sm text-gray-600">Embedded Facebook comments for any URL</p>
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mt-2">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="w-4 h-4 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-2">
                        <p className="text-xs text-amber-700">
                          Users in EU/EEA countries and the UK will not see this component unless they are logged into Facebook and have consented to cookies.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              }
              code={generateCommentsCode()}
              controls={
                <>
                  <PropControl label="URL for Comments" description="The URL to show comments for">
                    <TextInput
                      value={commentsHref}
                      onChange={setCommentsHref}
                      placeholder="https://example.com"
                    />
                  </PropControl>
                  
                  <PropControl label="Number of Posts" description="How many comments to show">
                    <NumberInput
                      value={commentsNumPosts}
                      onChange={setCommentsNumPosts}
                      min={1}
                      max={100}
                    />
                  </PropControl>

                  <PropControl label="Order By" description="How to sort comments">
                    <Select
                      value={commentsOrderBy}
                      onChange={(value) => setCommentsOrderBy(value as any)}
                      options={[
                        { value: 'reverse_time', label: 'Reverse Time' },
                        { value: 'time', label: 'Time' }
                      ]}
                    />
                  </PropControl>

                  <PropControl label="Width" description="Plugin width in pixels">
                    <TextInput
                      value={commentsWidth}
                      onChange={setCommentsWidth}
                    />
                  </PropControl>

                  <PropControl label="Color Scheme" description="Light or dark theme">
                    <Select
                      value={commentsColorScheme}
                      onChange={(value) => setCommentsColorScheme(value as any)}
                      options={[
                        { value: 'light', label: 'Light' },
                        { value: 'dark', label: 'Dark' }
                      ]}
                    />
                  </PropControl>
                </>
              }
            >
              <Comments
                href={commentsHref}
                numPosts={commentsNumPosts}
                orderBy={commentsOrderBy}
                width={commentsWidth}
                colorScheme={commentsColorScheme}
              />
            </LiveExample>

            {/* Page Plugin */}
            <LiveExample
              title="Page Plugin"
              description="Embed a Facebook page in your website"
              code={generatePageCode()}
              controls={
                <>
                  <PropControl label="Facebook Page URL" description="URL of the Facebook page">
                    <TextInput
                      value={pageHref}
                      onChange={setPageHref}
                      placeholder="https://www.facebook.com/meta"
                    />
                  </PropControl>
                  
                  <PropControl label="Tabs" description="Which tabs to show">
                    <TextInput
                      value={pageTabs}
                      onChange={setPageTabs}
                      placeholder="timeline,events,messages"
                    />
                  </PropControl>

                  <PropControl label="Width" description="Plugin width in pixels">
                    <NumberInput
                      value={pageWidth}
                      onChange={setPageWidth}
                      min={280}
                      max={500}
                    />
                  </PropControl>

                  <PropControl label="Height" description="Plugin height in pixels">
                    <NumberInput
                      value={pageHeight}
                      onChange={setPageHeight}
                      min={130}
                      max={800}
                    />
                  </PropControl>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={pageSmallHeader}
                      onChange={setPageSmallHeader}
                    />
                    <span className="text-sm">Small header</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={pageHideCover}
                      onChange={setPageHideCover}
                    />
                    <span className="text-sm">Hide cover photo</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={pageShowFacepile}
                      onChange={setPageShowFacepile}
                    />
                    <span className="text-sm">Show friend's faces</span>
                  </div>
                </>
              }
            >
              <Page
                href={pageHref}
                tabs={pageTabs}
                width={pageWidth}
                height={pageHeight}
                smallHeader={pageSmallHeader}
                hideCover={pageHideCover}
                showFacepile={pageShowFacepile}
              />
            </LiveExample>

            {/* Embedded Post */}
            <LiveExample
              title="Embedded Post"
              description="Embed a Facebook post in your website"
              code={generatePostCode()}
              controls={
                <>
                  <PropControl label="Post URL" description="URL of the Facebook post">
                    <TextInput
                      value={postHref}
                      onChange={setPostHref}
                      placeholder="https://www.facebook.com/share/r/15pT6eVV1v/"
                    />
                  </PropControl>
                  
                  <PropControl label="Width" description="Plugin width in pixels">
                    <NumberInput
                      value={postWidth}
                      onChange={setPostWidth}
                      min={350}
                      max={750}
                    />
                  </PropControl>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={postShowText}
                      onChange={setPostShowText}
                    />
                    <span className="text-sm">Show full post text</span>
                  </div>
                </>
              }
            >
              <EmbeddedPost
                href={postHref}
                width={postWidth}
                showText={postShowText}
              />
            </LiveExample>

            {/* Embedded Video */}
            <LiveExample
              title="Embedded Video"
              description="Embed a Facebook video in your website"
              code={generateVideoCode()}
              controls={
                <>
                  <PropControl label="Video URL" description="URL of the Facebook video">
                    <TextInput
                      value={videoHref}
                      onChange={setVideoHref}
                      placeholder="https://www.facebook.com/Meta/videos/1038522214125952"
                    />
                  </PropControl>
                  
                  <PropControl label="Width" description="Plugin width in pixels">
                    <TextInput
                      value={videoWidth}
                      onChange={setVideoWidth}
                    />
                  </PropControl>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={videoShowText}
                      onChange={setVideoShowText}
                    />
                    <span className="text-sm">Show video text</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={videoAutoPlay}
                      onChange={setVideoAutoPlay}
                    />
                    <span className="text-sm">Auto play</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={videoShowCaptions}
                      onChange={setVideoShowCaptions}
                    />
                    <span className="text-sm">Show captions</span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={videoAllowFullScreen}
                      onChange={setVideoAllowFullScreen}
                    />
                    <span className="text-sm">Allow full screen</span>
                  </div>
                </>
              }
            >
              <EmbeddedVideo
                href={videoHref}
                width={videoWidth}
                showText={videoShowText}
                autoPlay={videoAutoPlay}
                showCaptions={videoShowCaptions}
                allowFullScreen={videoAllowFullScreen}
              />
            </LiveExample>

            {/* Comments Count */}
            <LiveExample
              title="Comments Count"
              description="Show the number of comments for any URL"
              code={generateCommentsCountCode()}
              controls={
                <>
                  <PropControl label="URL for Comment Count" description="URL to get comment count for">
                    <TextInput
                      value={commentsCountHref}
                      onChange={setCommentsCountHref}
                      placeholder="https://example.com"
                    />
                  </PropControl>
                </>
              }
            >
              <CommentsCount href={commentsCountHref} />
            </LiveExample>





            {/* Facebook Pixel Demo */}
            <LiveExample
              title="Facebook Pixel Tracking"
              description="Real Facebook Pixel integration with comprehensive event tracking"
              code={`import { usePixel } from 'react-facebook';

function PixelDemo() {
  const { track, trackCustom, pageView, grantConsent } = usePixel();

  const handlePurchase = () => {
    track('Purchase', {
      value: 29.99,
      currency: 'USD',
      contents: [{ id: 'product-123', quantity: 1 }]
    });
  };

  return (
    <div className="space-y-4">
      <button onClick={handlePurchase}>Track Purchase</button>
      <button onClick={() => trackCustom('CustomEvent')}>Custom Event</button>
    </div>
  );
}`}
            >
              <PixelDemo />
            </LiveExample>
          </div>

          <div className="mt-12 p-6 bg-gradient-to-r from-facebook/10 to-cyan-500/10 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Ready to use in your project?</h3>
            <p className="text-gray-600 mb-4">
              Replace the demo App ID with your own Facebook App ID for production use.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/getting-started"
                className="inline-flex items-center px-4 py-2 bg-facebook text-white rounded-lg hover:bg-facebook-dark transition-colors"
              >
                Setup Guide
              </Link>
              <Link
                href="/api"
                className="inline-flex items-center px-4 py-2 border border-facebook text-facebook rounded-lg hover:bg-facebook hover:text-white transition-colors"
              >
                API Reference
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function PlaygroundPage() {
  const [appId, setAppId] = useState(FACEBOOK_APP_ID)
  const [locale, setLocale] = useState('en_US')
  
  return (
    <FacebookProvider 
      appId={appId} 
      language={locale}
      debug={true}
      key={`${appId}-${locale}`}
    >
      <PlaygroundPageContent appId={appId} setAppId={setAppId} locale={locale} setLocale={setLocale} />
    </FacebookProvider>
  )
}