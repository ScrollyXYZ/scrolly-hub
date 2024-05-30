# Scrolly Hub

Scrolly Hub is a web3 app based on the [Iggy](https://iggy.social) framework. It uses [Orbis SDK](https://useorbis.com) and [Ceramic Network](https://ceramic.network/) in the background. For usernames it uses [Scrolly Domains](https://sns.scrolly.xyz/).

Link: https://hub.scrolly.xyz/ 

## .env

Create a `.env` file from `.env.example`.

> Make sure to also enter these vars in your hosting settings!

## Hosting

We recommend to use Netlify for hosting the site. Netlify allows you to easily deploy the site from this repo (or from a fork of this repository).

Make sure to use the the `npm run generate` command instead of `npm run build` for build instructions on Netlify.

If you want to use optional features such as GIFs and image upload, make sure to enter proper environment variables (see `.env.example`).

Make sure to also select the proper serverless functions services in your environment variables, for example:

```bash
FILE_UPLOAD_SERVICE=vercel
LINK_PREVIEW_SERVICE=vercel
```

You can also set these in the Nuxt config file (`nuxt.config.ts`).

## GIFs (Tenor)

If you want to have GIF search implemented, create your own Tenor API Key on Google Cloud Console. Follow the instructions here: https://developers.google.com/tenor/guides/quickstart#setup. 

Then enter the key in environment variables (`TENOR_KEY`).

## Image upload (ThirdWeb/IPFS)

To support image uploads on IPFS please create an API key on ThirdWeb: https://thirdweb.com/dashboard/settings/api-keys 

Make sure to whitelist only your website domain/URL. And also restrict (toggle off) the API key usage for other services apart from Storage Upload service (even Storage Download is not needed).

Then add the Client ID of your API key to your environment variables:

```bash
THIRDWEB_CLIENT_ID=
```

## Image upload fallback

It is recommended to use ImageKit as the fallback option, in case ThirdWeb has technical issues.

For this to work, create an account at [ImageKit.io](https://imagekit.io/) and add these environment variables to your project:

```bash
IMAGEKIT_ENDPOINT=
IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
```

## Customize

- Project-specific settings in `nuxt.config.ts`
- CSS files in the `/public/css/` folder
- Favicon and cover/preview images in `/public/img/` folder

## Setup

Make sure to install the dependencies:

```bash
# yarn
yarn install

# npm
npm install

# pnpm
pnpm install --shamefully-hoist
```

## Development Server

Start the development server on http://localhost:3000

```bash
npm run dev
```

Or run Netlify dev server on http://localhost:8888 (to get link previews):

```bash
netlify dev
```

## Production

Build the application for production:

```bash
npm run generate
```

Locally preview production build:

```bash
npm run preview
```

Checkout the [deployment documentation](https://v3.nuxtjs.org/guide/deploy/presets) for more information.

## Testing

Orbis test group:

```bash
https://app.orbis.club/group/kjzl6cwe1jw145e1i1agcrjp9375sjpyyk7imu281koehrpve0pr46lvr5e9xco
```
