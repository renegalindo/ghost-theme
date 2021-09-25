import date from 'dayjs';
import 'dayjs/locale/es-mx.js';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';
import AdminApi from '@tryghost/admin-api';
import {toMobiledoc} from '@tryghost/html-to-mobiledoc';

// Add support for computing the current week of the year
date.extend(weekOfYear);
// Set the default locale to Spanish (Mexico)
date.locale('es-mx');

// Converts a post object (from Ghost API) to the markup used in the weekly
// newsletter template. Note that all the fields accessed here are explicitly
// listed in the `api.posts.browse` `fields` parameter.
const makePostBlock = post => {
  return `
    <h3>${post.title}</h3>
    ${post.html}
    <em>${date(post.published_at).format('D [de] MMMM, YYYY')}</em>
    <hr />
  `.replace(/\n?\s+\</g, '<');
};

const api = new AdminApi({
  url: process.env.GHOST_ADMIN_API_URL,
  key: process.env.GHOST_ADMIN_API_KEY,
  version: 'v4',
});

const lastWeek = date().subtract(7, 'days');

// Get the list of posts that have been published in the last 7 days
// (excluding #newsletter posts), oldest first
const posts = await api.posts.browse({
  filter: `published_at:>=${lastWeek.format('YYYY-MM-DD')}+tag:-hash-newsletter`,
  fields: 'title,published_at,html',
  formats: 'html',
  order: 'published_at asc',
});

// Create the markup - the template is list of posts from last week + a few CTAs
const html = `
  ${posts.map(post => makePostBlock(post)).join('')}
  <p>
    <a href="mailto:mail@renegalindo.com?subject=Encontrando+el+formato">Responder →</a>
  </p>
  <p>
    <a href="mailto:?subject=Encontrando+el+formato+de+René+Galindo&amp;body=https://renegalindo.com/">Recomendar a alguien →</a>
  </p>
`;

let published_at = undefined;

if (posts.length < 7) {
  console.warn('There are only %d posts', posts.length);
} else {
  console.log('Rolling up %d posts', posts.length);

  published_at = date()
    .set('minute', 59)
    .set('hour', 23)
    .locale('utc')
    .toISOString();
}

let post;

try {
  post = await api.posts.add({
    title: `Encontrando el formato ${lastWeek.week()}/${lastWeek.year()}`,
    mobiledoc: JSON.stringify(toMobiledoc(html)),
    tags: ['#newsletter'],
  });

  if (!published_at) {
    console.log('Successfully created draft post');
  }
} catch (error) {
  console.error('Failed to create draft post');
  console.error(error);
  process.exit(1);
}

if (published_at) {
  const email_recipient_filter = 'status:-free';
  try {
    await api.posts.edit({
      id: post.id,
      status: 'scheduled',
      updated_at: post.updated_at,
      published_at
    }, {
      email_recipient_filter,
    });

    console.log('Successfully scheduled post to send to filter:', email_recipient_filter);
  } catch (error) {
    console.error('Failed to schedule post to be sent out');
    console.error(error);
  }
}