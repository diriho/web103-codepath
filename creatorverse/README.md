# WEB103 Prework - *👉🏿 Creatorverse *

Submitted by: **👉🏿 Don Destin Iriho**

GitHub username: **👉🏿 diriho**

About this web app: **👉🏿 Creatorverse is a multi-user web app where each authenticated user curates a private collection of content creators — YouTubers, Twitch streamers, TikTokers, podcasters, Substack writers, anyone whose work shapes their world. Each user signs up, builds their own list, and can add, view, edit, and delete creators. Every Creatorverse is private to its owner, enforced server-side by Supabase Row Level Security.**

Time spent: **👉🏿 30** hours

## Description

Creatorverse is a multi-user web app where each authenticated user curates a private collection of content creators — YouTubers, Twitch streamers, TikTokers, podcasters, Substack writers, anyone whose work shapes their world. Each user signs up, builds their own list, and can add, view, edit, and delete creators. Every Creatorverse is private to its owner, enforced server-side by Supabase Row Level Security.

The aesthetic is intentional: a dark editorial zine — near-black background, off-white text, electric-lime accent, Fraunces display + DM Sans body — meant to feel like a personal magazine, not a CRUD dashboard.

## Features

### Required Features

The following **required** functionality is completed:

- [x] **A logical component structure in React is used to create the frontend of the app**
- [ ] **At least five content creators are displayed on the homepage of the app**
- [x] **Each content creator item includes their name, a link to their channel/page, and a short description of their content**
- [x] **API calls use the async/await design pattern via Axios or fetch()**
- [x] **Clicking on a content creator item takes the user to their details page, which includes their name, url, and description**
- [x] **Each content creator has their own unique URL**
- [x] **The user can edit a content creator to change their name, url, or description**
- [x] **The user can delete a content creator**
- [x] **The user can add a new content creator by entering a name, url, or description and then it is displayed on the homepage**


The following **optional** features are implemented:

- [x] Picocss is used to style HTML elements
- [x] The content creator items are displayed in a creative format, like cards instead of a list
- [x] An image of each content creator is shown on their content creator card


The following **additional** features are implemented:

- [x] **Multi-user authentication** — Supabase email/password auth with Row Level Security; each user only sees their own creators
- [x] **Client-side auth validation** 
- [x] **Routing via React Router** (Landing, Login, SignUp, ShowCreators, ViewCreator, AddCreator, EditCreator)
- [x] **Fully responsive layout** — 1 / 2 / 3 column grid at mobile / tablet / desktop; navbar collapses email at narrow widths

### Tech Stack

- **Frontend**: React 19 + Vite 8 (TypeScript + React Compiler)
- **Database & Auth**: Supabase (PostgreSQL + Auth + Row Level Security)
- **Routing**: React Router 
- **Styling**: PicoCSS (base) + custom global stylesheet

## Video Walkthrough




## Notes

I decided to use a client faced interface to make it more fun and make it more user-oriented. To mitigate online robot agents from interacting with the database, upon registration, I added a **Email confirmation** for the user to confirm before you access their workspace.  

In order to connect the user to their database of creators, I am using their **uiid** (unique ID) generated upon authentication to access the rows corresponding to their creatorverse data, within the supabase creators table.


## License

Copyright [👉🏿 2026] [👉🏿 diriho]

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

