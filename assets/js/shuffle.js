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

  const tag = shuffler.dataset.tag;
  const filter = tag ? `tag:${tag}` : 'tag:-hash-newsletter';
  const {posts} = await fetch(`/ghost/api/content/posts/?limit=all&fields=url&filter=${filter}&key=${contentApiKey}`)
  .then(response => response.json());

  const post = posts[getRandom(0, posts.length)];

  shuffler.href = post.url;
  shuffler.classList.remove('disabled');
})()