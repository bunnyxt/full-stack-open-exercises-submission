describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'bunnyxt',
      username: 'bunnyxt',
      password: 'passw0rd'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.visit('http://localhost:3000')
    cy.contains('log in to application')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('bunnyxt')
      cy.get('#password').type('passw0rd')
      cy.get('#login-button').click()

      cy.contains('bunnyxt logged in')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('bunnyxt')
      cy.get('#password').type('wrong-passw0rd')
      cy.get('#login-button').click()

      cy.get('.prompt-error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe.only('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'bunnyxt', password: 'passw0rd' })
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()

      cy.get('#title').type('bunnyxt\'s cheat sheet')
      cy.get('#author').type('bunnyxt')
      cy.get('#url').type('https://bcs.bunnyxt.com')
      cy.get('#create-button').click()

      cy.contains('a new blog bunnyxt\'s cheat sheet added')
    })

    describe('and several blogs exists', function() {
      beforeEach(function() {
        cy.createBlog({
          title: 'bunnyxt\'s cheat sheet',
          author: 'bunnyxt',
          url: 'https://bcs.bunnyxt.com',
          likes: 2
        })
        cy.createBlog({
          title: 'TianDian Daily',
          author: 'bunnyxt',
          url: 'https://tdd.bunnyxt.com',
          likes: 1
        })
        cy.createBlog({
          title: 'Keep working in progress',
          author: 'bunnyxt',
          url: 'http://www.keepwip.com',
          likes: 3
        })
      })

      it('one of those can be liked', function() {
        cy.contains('TianDian Daily')
          .contains('view')
          .click()

        cy.contains('TianDian Daily')
          .parent()
          .find('button')
          .contains('like')
          .click()

        cy.contains('https://tdd.bunnyxt.com')
          .parent()
          .find('div')
          .contains('likes')
          .should('contain', '2')
      })

      it('one of those can be deleted', function() {
        cy.contains('TianDian Daily')
          .contains('view')
          .click()

        cy.on('window:confirm', () => true)

        cy.contains('TianDian Daily')
          .parent()
          .find('button')
          .contains('remove')
          .click()

        cy.contains('blog TianDian Daily removed')
      })

      it('blogs are sorted by likes', function() {
        const rgx = /likes ([0-9]+) like/
        let lastLike = 99999999  // large value
        cy.get('.blogs')
         .children()
         .each(blog => {
           const like = parseInt(rgx.exec(blog[0].childNodes[1].childNodes[2].innerText)[1])
           expect(like).not.greaterThan(lastLike)
           lastLike = like
         })
      })
    })
  })
})