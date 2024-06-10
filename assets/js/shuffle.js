const getRandom = (min, max) => Math.floor(Math.random() * max + min);
(async () => {
  const shuffler = document.getElementById('shuffler');

  if (!shuffler) {
    return;
  }

  if (!window.contentApiKey) {
    console.log('Error! No content API key was supplied. Shuffle posts button will not work');
    return;
  }

  const tag = new URLSearchParams(location.search).get('tag') || shuffler.dataset.tag;
  const href = tag ? '?tag=' + tag : '';
  const currentPost = shuffler.dataset.post;
  let filter = 'tag:' + (tag || '-hash-newsletter');
  filter = currentPost ? ('id:-' + currentPost + '+' + filter) : '';
  filter = encodeURIComponent(filter)
  const {posts} = await fetch('/ghost/api/content/posts/?limit=all&fields=url&filter=' + filter + '&key=' + window.contentApiKey)
  .then(response => response.json());

  const post = posts[getRandom(0, posts.length)];

  shuffler.href = post.url + href;
  shuffler.classList.remove('disabled');

  if (tag) {
    const querySelector = '.menu a[href="' + window.location.origin + '/tag/' + tagUrl + '/"]';
    document.querySelectorAll(querySelector).forEach(element => element.classList.toggle('active', true))
  }
})()