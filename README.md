# Rene's Blog Theme

This is a blog theme created for Rene based off the Casper Ghost theme that was included as part of the 4.9.0 Release.

# Notable things

The `routes.yaml` file included in the root of this repository needs to manually be uploaded. [Ghost Dynamic Routing documentation](https://ghost.org/docs/themes/routing/)

Posts will have the route `/{year}/{month}/{slug}/`, unless it has the `#newsletter` tag, in which case it will have the route `/newsletter/{slug}/`.

For the shuffler to work, you need to create a [Custom Front-End Integration](https://ghost.org/integrations/custom-integrations/), and add this script to your `Code Injection Head`:

```html
<script>window.contentApiKey = 'CONTENT_API_Key';</script>
```

Note that the shuffler runs on the client (since Ghost doesn't support random posts on the server side), and will exclude newsletter posts. The shuffler code is located in `assets/js/shuffle.js`

# Deployment

There is a GitHub Action set up to automatically deploy your theme whenever you commit.

The `GHOST_ADMIN_API_KEY` (Admin API Key) and `GHOST_ADMIN_API_URL` secrets need to be configured in GitHub for this to work. You can get both of these values from the Custom Integration which you need to create for this.

# Development

The styles are compiled using Gulp/PostCSS to polyfill future CSS spec. You'll need [Node](https://nodejs.org/), [Yarn](https://yarnpkg.com/) and [Gulp](https://gulpjs.com) installed globally. After that, from the theme's root directory:

```bash
# install dependencies
yarn install

# run development server
yarn dev
```

Now you can edit `/assets/css/` files, which will be compiled to `/assets/built/` automatically.

The `zip` Gulp task packages the theme files into `dist/<theme-name>.zip`, which you can then upload to your site.

```bash
# create .zip file
yarn zip
```

# PostCSS Features Used

- Autoprefixer - Don't worry about writing browser prefixes of any kind, it's all done automatically with support for the latest 2 major versions of every browser.
- [Color Mod](https://github.com/jonathantneal/postcss-color-mod-function)
