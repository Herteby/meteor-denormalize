var speed = 100

Posts = new Mongo.Collection('posts')
Comments = new Mongo.Collection('comments')
Denormalize.debug = true


//collection.cacheDoc()

/*
Tinytest.add("cacheDoc: Comments.cacheDoc('post', Posts, ['title'])", function(test) {
	Posts.remove({})
	Comments.remove({})
	Comments.attachSchema(new SimpleSchema({
		_id: {
			type: String,
			optional: true,
		},
		post_id: {
			type: String,
			optional: true,
		},
		content: {
			type: String,
			optional: true,
		},
	}))
	Comments.cacheDoc('post', Posts, {title:1, author:{username:1, role:1, profile:1}})
})

Tinytest.addAsync("cacheDoc: Insert comment", function(test, next) {
	Comments.insert({
		_id: 'comment1',
		post_id: 'post1',
		content: 'Great post!',
	})
	Meteor.setTimeout(function() {
		test.equal(Comments.findOne('comment1')._post, undefined)
		next()
	}, speed)
})

Tinytest.addAsync("cacheDoc: Insert post", function(test, next) {
	Posts.insert({
		_id: 'post1',
		title: 'My first post',
		content: 'This is my first post',
		author:{
			username:'Simon',
			role:'admin',
			profile:{
				name:'Simon herteby'
			}
		}
	})
	Meteor.setTimeout(function() {
		test.notEqual(Comments.findOne('comment1')._post, undefined)
		test.equal(Comments.findOne('comment1')._post.title, Posts.findOne('post1').title)
		test.equal(Comments.findOne('comment1')._post.author, Posts.findOne('post1').author)
		next()
	}, speed)
})

Tinytest.addAsync("cacheDoc: Insert another comment", function(test, next) {
	Comments.insert({
		_id: 'comment2',
		post_id: 'post1',
		content: 'Love it!',
	})
	Meteor.setTimeout(function() {
		test.notEqual(Comments.findOne('comment2')._post, undefined)
		test.equal(Comments.findOne('comment2')._post.title, Posts.findOne('post1').title)
		next()
	}, speed)
})

Tinytest.addAsync("cacheDoc: Update post title", function(test, next) {
	Posts.update('post1', {$set: {
		title: 'Not my first post',
	}})
	Meteor.setTimeout(function() {
		test.notEqual(Comments.findOne('comment1')._post, undefined)
		test.equal(Comments.findOne('comment1')._post.title, Posts.findOne('post1').title)
		next()
	}, speed)
})

Tinytest.addAsync("cacheDoc: Update comment post_id", function(test, next) {
	Comments.update('comment1', {$set: {
		post_id: 'post2',
	}})
	Meteor.setTimeout(function() {
		test.equal(Comments.findOne('comment1')._post, undefined)
		//reset:
		Comments.update('comment1', {$set: {
			post_id: 'post1',
		}})
		Meteor.setTimeout(function() {
			test.notEqual(Comments.findOne('comment1')._post, undefined)
			test.equal(Comments.findOne('comment1')._post.title, Posts.findOne('post1').title)
			next()
		}, speed)
	}, speed)
})

Tinytest.addAsync("cacheDoc: Remove post", function(test, next) {
	Posts.remove('post1')
	Meteor.setTimeout(function() {
		test.equal(Comments.findOne('comment1')._post, undefined)
		next()
	}, speed)
})


//collection.cacheCount()


Tinytest.add("cacheCount: Posts.cacheCount('commentsCount', Comments, 'post_id')", function(test) {
	Posts.remove({})
	Comments.remove({})
	Posts.cacheCount('commentsCount', Comments, 'post_id')
})

Tinytest.addAsync("cacheCount: Insert comment", function(test, next) {
	Comments.insert({
		_id: 'comment1',
		post_id: 'post1',
		content: 'Great post!',
	})
	Posts.insert({
		_id: 'post1',
		title: 'My first post',
		content: 'This is my first post'
	})
	Meteor.setTimeout(function() {
		test.equal(Posts.findOne('post1').commentsCount, 1)
		next()
	}, speed)
})

Tinytest.addAsync("cacheCount: Insert comment again", function(test, next) {
	Comments.insert({
		_id: 'comment2',
		post_id: 'post1',
		content: 'Love it!',
	})
	Meteor.setTimeout(function() {
		test.equal(Posts.findOne('post1').commentsCount, 2)
		next()
	}, speed)
})

Tinytest.addAsync("cacheCount: Insert comment on other post", function(test, next) {
	Comments.insert({
		_id: 'comment3',
		post_id: 'post2',
		content: 'Love it!',
	})
	Meteor.setTimeout(function() {
		test.equal(Posts.findOne('post1').commentsCount, 2)
		next()
	}, speed)
})

Tinytest.addAsync("cacheCount: Remove comment", function(test, next) {
	Comments.remove('comment2')
	Meteor.setTimeout(function() {
		test.equal(Posts.findOne('post1').commentsCount, 1)
		next()
	}, speed)
})

Tinytest.addAsync("cacheCount: Update comment post_id", function(test, next) {
	Comments.update('comment1', {$set: {post_id: 'post2'}})
	Meteor.setTimeout(function() {
		test.equal(Posts.findOne('post1').commentsCount, 0)
		next()
	}, speed)
})


//collection.cacheField()


Tinytest.add("cacheField: Posts.cacheField('_text', ['title', 'content'])", function(test) {
	Posts.remove({})
	Comments.remove({})
	Posts.cacheField('_text', ['title', 'content'])
})

Tinytest.addAsync("cacheField: Insert post", function(test, next) {
	Posts.insert({
		_id: 'post1',
		title: 'ABC',
		content: 'DEF'
	})
	Meteor.setTimeout(function() {
		test.equal(Posts.findOne('post1')._text, 'ABC, DEF')
		next()
	}, speed)
})

Tinytest.addAsync("cacheField: value callback doc", function(test, next) {
	Posts.cacheField('_doc', ['title', 'content'], function(doc, fields) {
		return doc
	})
	Posts.insert({
		_id: 'post2',
		title: 'ABC',
		content: 'DEF'
	})
	Meteor.setTimeout(function() {
		test.equal(Posts.findOne('post2')._doc._id, Posts.findOne('post2')._id)
		next()
	}, speed)
})

Tinytest.addAsync("cacheField: value callback fields", function(test, next) {
	Posts.cacheField('_fields', ['title', 'content'], function(doc, fields) {
		return fields.join(',')
	})
	Posts.insert({
		_id: 'post3',
		title: 'ABC',
		content: 'DEF'
	})
	Meteor.setTimeout(function() {
		test.equal(Posts.findOne('post3')._fields, 'title,content')
		next()
	}, speed)
})
*/

Tinytest.add("Many-links", function(test) {
	Posts.remove({})
	Comments.remove({})
	Posts.cacheDoc('comments', Comments, ['_id', 'content'])
})
Posts.after.insert(()=>console.log('HEJ!'))
Posts.after.insert(()=>console.log('HEJ2!'))
Tinytest.addAsync('Many-link: insert post', (test, next) => {
	
	Posts.insert({
		_id: 'post1',
		title: 'My first post',
		content: 'This is my first post',
		comments_id:['comment1', 'comment2']
	})
	Comments.insert({
		_id: 'comment1',
		post_id: 'post1',
		content: 'Great post!',
	})
	Comments.insert({
		_id: 'comment2',
		post_id: 'post1',
		content: 'Great post!',
	})
	

	Meteor.setTimeout(function() {
		console.log(Posts.findOne('post1'))
		test.equal(Posts.findOne('post1')._comments, [{_id:'comment1', content:'Great post!'}, {_id:'comment2', content:'Great post!'}])
		next()
	}, speed)	
})
