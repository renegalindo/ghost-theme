import generateToken from '@tryghost/admin-api/lib/token.js';

if (!process.env.ADMIN_URL) {
	throw new Error('Missing ADMIN_URL');
}

if (!process.env.ADMIN_API_KEY) {
	throw new Error('Missing ADMIN_API_KEY');
}

if (!process.env.CONTENT_API_KEY) {
	throw new Error('Missing CONTENT_API_KEY');
}

if (!process.env.FALLBACK_TAG_ID) {
	throw new Error('Missing FALLBACK_TAG_ID');
}

const contentKey = process.env.CONTENT_API_KEY;
const adminKey = process.env.ADMIN_API_KEY;
const url = process.env.API_URL;
const tagId = process.env.FALLBACK_TAG_ID;

const adminJwt = generateToken(adminKey, '/admin/');
const {posts} = await fetch(`${url}/ghost/api/content/posts/?key=${contentKey}&include=tags&filter=tag:-hash-newsletter%2Bstatus:published&limit=all&fields=id,slug,title,updated_at`).then(response => response.json())

const TAG_TO_ADD = {id: tagId};

function addTag(post) {
	post.tags ??= [];
	for (const tag of post.tags) {
		if (tag.id === tagId) {
			return;
		}
	}

	post.tags.push(TAG_TO_ADD);
	return fetch(`${url}/ghost/api/admin/posts/${post.id}`, {
		method: 'PUT',
		headers: {
			'content-type': 'application/json',
			'authorization': `Ghost ${adminJwt}`,
		},
		body: JSON.stringify({posts: [post]})
	}).then(response => response.json()).then(response => {
		if (response.errors || response.error) {
			console.log(post.id, JSON.stringify(response))
		}
	});
}

for (const post of posts) {
	let hasTag = false;
	const tags = post.tags.filter(tag => {
		hasTag ||= tag.id === tagId;
		return tag.visibility === 'public'
	});

	if (tags.length == 0 && !hasTag) {
		console.log('.');
		await addTag(post);
	}
}
