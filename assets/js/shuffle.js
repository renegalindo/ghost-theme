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

  const {posts} = await fetch('/ghost/api/v3/content/posts/?limit=all&fields=url&filter=tag:-hash-newsletter&key=' + contentApiKey)
  .then(response => response.json());

  const post = posts[getRandom(0, posts.length)];

  shuffler.href = post.url;
  shuffler.classList.remove('disabled');
})()