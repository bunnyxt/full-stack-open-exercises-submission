const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let sum = 0
  blogs.forEach(blog => sum += blog.likes)
  return sum
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  let maxLikeCount = -1
  let maxLikeBlog = null
  blogs.forEach(blog => {
    if (blog.likes > maxLikeCount) {
      maxLikeCount = blog.likes
      maxLikeBlog = blog
    }
  })

  return {
    title: maxLikeBlog.title,
    author: maxLikeBlog.author,
    likes: maxLikeBlog.likes
  }
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const blogsGroupByAuthor = _.groupBy(blogs, 'author')
  const authorBlogsCountList = _.map(blogsGroupByAuthor, (blogs, author) => {
    return {
      author: author,
      blogs: blogs.length
    }
  })
  authorBlogsCountList.sort((a, b) => (b.blogs - a.blogs))

  return authorBlogsCountList[0]
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const blogsGroupByAuthor = _.groupBy(blogs, 'author')
  const authorLikesCountList = _.map(blogsGroupByAuthor, (blogs, author) => {
    let likesCount = 0
    blogs.forEach(blog => likesCount += blog.likes)

    return {
      author: author,
      likes: likesCount
    }
  })
  authorLikesCountList.sort((a, b) => (b.likes - a.likes))
  
  return authorLikesCountList[0]
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}