
# node-boot

Visit [http://node-boot.herokuapp.com/](http://node-boot.herokuapp.com/) for a live demo.

Demo based on [http://github.com/cbumgard/node-boot-demo](http://github.com/cbumgard/node-boot-demo) fork.

Visit the node-boot dev blog [http://node-boot.blogspot.com/](http://node-boot.blogspot.com/) to see how to build your app based on node-boot.


## Index

* [What is node-boot?](#what-is-node-boot)
* [Why should I use it?](#why-should-i-use-it)
* [How do I get started?](#how-do-i-get-started)
* [How do can I get help?](#how-can-i-get-help)
* [License](#license)


## What is node-boot?

__node-boot__ is a starting point for developing a web application based on a proven node.js stack:

- [express][express] - server
- [jade][jade] - view templates
- [Twitter Bootstrap][bootstrap] - html/css/js boilerplate
- [Socket.io][socketio] - websockets with legacy fallback, real-time/long-polling
- [MongoDB][mongodb] & [Mongoose][mongoose] - database/ORM
- [Redis][redis] - sessions and fast key/value storage
- [Nodemailer][nodemailer] - easy email from Gmail, SendGrid, etc
- [Winston][winston] - multi-transport async logging
- [Passport.js][passport] - authentication/login/signup
- [Grunt.js][grunt] & [Bower][bower] - easy task running, asset pipeline, and front-end package management

[express]: http://expressjs.com/
[jade]: http://jade-lang.com/
[bootstrap]: http://twitter.github.com/bootstrap/
[socketio]: http://www.socket.io/
[mongodb]: http://www.mongodb.org/
[mongoose]: http://mongoosejs.com/
[redis]: http://redis.io/
[nodemailer]: http://www.nodemailer.com/
[winston]: https://github.com/flatiron/winston
[passport]: http://passportjs.org/
[grunt]: http://gruntjs.com/
[bower]: http://twitter.github.io/bower/


## Why should I use it?

__node-boot__ is a starting point providing a sensible, configurable, and customizable set of choices. You get a turnkey web app that provides common patterns such as environment-specific configuration files, clustering for multiple cores, SSL certificate setup, database connections, logging transports, and caching and compression of content.

The experience of building a production-ready, deployable web application involves making many choices: which technologies, what configuration settings, best practices, etc. While there is no one right set of choices, these are ones I have used in my own production web application and have found to be not only pragmatic and scalable, but a pleasure to work with. My hope is this might help you get off the ground fast so you can focus on building that awesome idea you've got in your head.


## How do I get started?

Fork __node-boot__ at https://github.com/cbumgard/node-boot

Make sure you have the latest stable versions of __node.js__, __npm__, and __grunt__ installed. Then just:

1. `git clone https://github.com/cbumgard/node-boot`
2. `cd node-boot/`
3. `npm install`
4. `grunt dev`
5. `node app.js`

You should now be able to connect to http://localhost:8000/ and see a page just like this one.

For an even more awesome workflow that detects file changes and restarts node automatically __AND__ executes Grunt tasks to download packages and update client assets (depending on changed files) run the following commands in separate terminals:

1. `grunt watch`
2. `nodemon app.js`

__NOTE:__ Make sure nodemon is installed first (e.g. `npm install -g nodemon`):

And now build your awesome web app!


## How can I get help?

Check to see if someone has had a similar issue using [Issues][issues].

Feel free to [submit a new issue][new-issue] and/or a pull request if you've resolved the issue.

You can also write me a quick email at [cbumgard@gmail.com](mailto:cbumgard@gmail.com).

[issues]: https://github.com/cbumgard/node-boot/issues
[new-issue]: https://github.com/cbumgard/node-boot/issues/new


## License

The MIT License

Copyright (c) 2012- Chris Bumgardner <cbumgard@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
