import React from 'react';
import { FacebookProvider, Like, Share, ShareButton, Comments, Page } from 'react-facebook';

export default function SitePage() {
  return (
    <FacebookProvider appId="671184534658954" debug>
      <div data-testid="site-page">
        <section data-testid="page-section">
          <Page href="https://www.facebook.com/facebook" tabs="timeline" data-testid="facebook-page" />
        </section>

        <section data-testid="like-section">
          <Like href="https://www.facebook.com/facebook" share data-testid="facebook-like" />
        </section>

        <section data-testid="share-button-section">
          <ShareButton href="https://www.facebook.com" data-testid="facebook-share-button">
            Share Button
          </ShareButton>
        </section>

        <section data-testid="share-section">
          <Share
            href="https://developers.facebook.com/docs/plugins/"
            layout="button_count"
            data-testid="facebook-share"
          />
        </section>

        <section data-testid="comments-section">
          <Comments href="http://www.facebook.com" data-testid="facebook-comments" />
        </section>
      </div>
    </FacebookProvider>
  );
}
