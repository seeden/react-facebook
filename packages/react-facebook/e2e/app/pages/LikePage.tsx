import React from 'react';
import { FacebookProvider, Like, Comments } from 'react-facebook';

export default function LikePage() {
  return (
    <FacebookProvider appId="671184534658954" debug>
      <div data-testid="like-page" style={{ padding: 20 }}>
        <h1>Like Component Tests</h1>

        {/* Scenario 1: Basic Like with colorScheme */}
        <section style={{ marginBottom: 20 }}>
          <h2>Basic Like</h2>
          <div data-testid="like-button">
            <Like
              href="https://github.com/seeden/react-facebook"
              colorScheme="dark"
            />
          </div>
        </section>

        {/* Scenario 2: Like with share and layout */}
        <section style={{ marginBottom: 20 }}>
          <h2>Like with Share</h2>
          <div data-testid="like-share-button">
            <Like
              href="https://reactjs.org"
              share={true}
              layout="button_count"
            />
          </div>
        </section>

        {/* Scenario 3: Comments widget */}
        <section style={{ marginBottom: 20 }}>
          <h2>Comments</h2>
          <div data-testid="comments-widget">
            <Comments
              href="https://github.com/seeden/react-facebook"
              numPosts={5}
              width={500}
              colorScheme="dark"
            />
          </div>
        </section>

        {/* Scenario 4: Multiple likes with different layouts */}
        <section style={{ marginBottom: 20 }}>
          <h2>Multiple Likes</h2>
          <div data-testid="like-1">
            <Like
              href="https://github.com/seeden/react-facebook"
              layout="standard"
            />
          </div>
          <div data-testid="like-2">
            <Like
              href="https://github.com/seeden/react-facebook"
              layout="box_count"
            />
          </div>
          <div data-testid="like-3">
            <Like
              href="https://github.com/seeden/react-facebook"
              layout="button"
            />
          </div>
        </section>
      </div>
    </FacebookProvider>
  );
}
