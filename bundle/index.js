(function () {
    'use strict';

    const el = {
        check: (el) => (el instanceof Element || el instanceof DocumentFragment || el instanceof Document),

        /**
         * returns an element if it is a string or Element.
         * throws an error if it is not
         * @param {string|Element|any}                el                - string, Element, or any
         * @param {Document|DocumentFragment|Element} [parent=Document] - base node to use
         * @returns {Element}
         */
        from (el, parent) {
            if (this.check(el)) return el
            if (!parent) parent = document;
            if (typeof el === 'string') return parent.querySelector(el)
            throw new Error('not a string nor an element! for element ' + el + ' inside of parent ' + parent)
        },

        /**
         * modifies an element with the given callback.
         * applies the 'unmodified' (if not present) class and the 'modified' class.
         * @param {string|Element|any}                el                - string, Element, or any
         * @param {function}                          callback          - callback to run
         * @param {Document|DocumentFragment|Element} [parent=Document] - base node to use
         * @returns {Promise<Element>}
         */
        async modify (el, callback, parent) {
            el = this.from(el, parent);

            let classList = el.classList;

            // unmodified
            if (!(classList.contains('unmodified'))) classList.add('unmodified');
            classList.remove('unmodified');
            // ...modifying...
            await callback(el);
            // modified!
            classList.add('modified');
            return el
        },

        /**
         * return a range from the given string, element, or range from its parent
         * @param {string|Element|Range} el                - string, Element, or Range
         * @param {string|Element}       [parent=Document] - base node to query from
         * @returns 
         */
        range (el, parent) {
            if (el instanceof Range) return el

            parent = this.from(parent);
            el     = this.from(el, parent);

            let r = document.createRange();
            r.selectNode(el);

            return r
        }
    };

    class Collection {
        type  = undefined
        frags = undefined

        /**
         * creates a frag collection
         * @param {Frag} frag
         * @returns
         */
        constructor (frag) { this.type = frag; }

        /**
         * create a new frag for each target node in the parent node
         * @param {string|Element} parent - parent node to search from
         * @param {string|Element} target - string or element to select
         * @returns
         */
        target (parent, target) {
            parent = el.from(parent);
            this.frags = [];

            let node = parent.querySelector(target);
            while (node !== null) {
                let f = new (this.type)()
                    .target(parent, node);
                this.frags.push(f);

                node = parent.querySelector(target);
            }

            return this
        }

        /**
         * build all of the frags in the collection
         * @returns
         */
        async build () {
            for (let f in this.frags) { 
                await this.frags[f].build(); 
            }
            return this
        }

        /**
         * mount all of the frags in the collection
         * @returns
         */
        mount () {
            this.frags.forEach(f => f.mount());
            return this
        }

        /**
         * unmount all of the frags in the collection
         * @returns
         */
        unmount () {
            this.frags.forEach(f => f.unmount());
            return this
        }
    }

    const hook = {
        constructor () {},
        build       () {},
        mount       () {},
        mounted     () {},
        unmount     () {},
        unmounted   () {}
    };

    /**
     * frag class :D
     * 
     * @prop {string} path - path to pull HTML from
     */
    class Frag {
        // overridables
        path  = '/pages/404.html'
        hook  = hook
        frags = []
        
        // internal
        frag     = undefined
        parent   = undefined
        old      = undefined
        range    = undefined
        children = undefined

        /**
         * build before using!
         */
        constructor () {
            this.hook = { ...hook, ...this.hook };
        }

        /**
         * 
         * @param {string|Element}       parent - parent element to target
         * @param {string|Range|Element} target - tag to target
         * @returns
         */
        target (parent, target) {
            this.parent = el.from(parent);

            this.range = el.range(target, this.parent);
            this.old = this.range.extractContents();

            return this
        }

        /**
         * build the component(s)
         * @returns
         */
        async build () {
            this.frag = document
                .createRange()
                .createContextualFragment(
                    await fetch(this.path)
                    .then(data => data.text()));
            
            // @children
            if (!!this.frags) this.children = [];
            for (let tag in this.frags) {
                // using a collection lets us
                // make sure every instance of
                // the given tag is targeted
                let c = await new Collection(this.frags[tag])
                    .target(this.frag, tag)
                    .build();
                this.children.push(c);
            }

            // @hook
            // seems like checking for variables existing
            // is necessary in async methods
            if (this.hook.build) this.hook.build(this);
            return this
        }

        /**
         * append our frags to the parent target
         * @returns
         */
        mount () {
            // @hook
            if (this.hook.mount) this.hook.mount(this);

            // @children
            this.children.forEach(c => c.mount());

            // this is it lmao
            this.range.insertNode(this.frag);

            // @style
            if (!!this.parent.classList) this.parent.classList.add('mounted');

            // @hook
            if (this.hook.mounted) this.hook.mounted(this);
            this.frag = undefined;
            return this
        }

        /**
         * remove the component from the DOM
         * @returns
         */
        unmount() {
            if (!this.range)  throw new Error('this frag has no range to unmount!')
            if (!this.parent) return false

            // @hook
            if (this.hook.unmount) this.hook.unmount(this);

            // @children
            this.children.forEach(c => c.unmount());

            // @update
            this.frag = this.range.extractContents();
            this.range.insertNode(this.old);

            // @style
            if (!!this.parent.classList) this.parent.classList.remove('mounted');

            // @hook
            if (this.hook.unmounted) this.hook.unmounted(this);
            this.old = undefined;
            return this
        }
    }

    /**
     * @extends Frag
     * @prop {string}  href           - the url path this page should be linked to
     * @prop {string}  [name=]        - name of the page
     * @prop {boolean} [hidden=false] - hidden or not when listing pages?
     */
    class Page extends Frag {
        static href   = '/404'
        static name   = undefined
        static hidden = false
    }

    // props to mitch dev
    // https://www.youtube.com/watch?v=ZleShIpv5zQ

    /** global router object */
    let router = undefined;

    /**
     * router :D
     * should only really use one of these per site tbh
     */
    class Router {
        container
        view
        routes = {}
        page   = { unmount: () => {} }

        /**
         * initialize a router
         * @param {Page[]} routes        - routes the router should use
         * @param {string} routes[].href - url to be linked to a given page
         * @param {string} routes[].path - url for the page HTML
         */
        constructor (routes) {
            if (!!router) throw new Error('a router already exists for this document!')

            this.update       = this.update.bind(this); // async methods need manual binding
            window.route      = this.route;
            window.router     = router = this;
            window.onpopstate = this.update;

            routes.forEach(r => this.routes[r.href] = r);
        }

        /**
         * 
         * @param {string|Element} container - container to house the router in
         * @param {string|Element} view      - element to target for replacement
         */
        target (container, view) {
            this.container = el.from(container || 'main');
            this.view      = el.range(view || 'view', this.container);
            this.view.deleteContents();

            this.container.id = 'router';

            return this
        }

        /**
         * update the router view with the given url
         * @param {string} url 
         */
        async update (url) {
            url = url || window.location.pathname;
            if (url === '') url = '/'; // just in case lmao
            
            // clear the view
            this.page.unmount();
            this.container.innerHTML = '';

            // mount our new view
            new (this.routes[url] || this.routes['/404'])()
                .target(this.container, this.view)
                .build()
                .then(f => f.mount())
                .then(f => this.page = f);

            return this
        }

        /**
         * handle routing events.
         * example: `<a href="/test" onclick="router.route()">`
         * @param event 
         */
        route (event) {
            event = event || window.EventSource;

            // prevent the window from routing
            event.preventDefault();

            // only update the url if its new
            if (window.location.pathname !== (event.target.pathname || '/')) {
                // cosmetically make it our location
                window.history.pushState({}, '', event.target.href || '/');
                // update our page
                this.update();
            }

            return this
        }
    }

    const config = {
        accounts: {
            twitch: {
                url: 'twitch.tv/bugflug',
                name: 'bugflug'
            },
            youtube: {
                url: 'youtube.com/@bugflug',
                name: 'bugflug'
            },
            steam: {
                url: 'steamcommunity.com/profiles/76561198081991204',
                name: 'bugflug'
            }
        }
    };

    class FragAccounts extends Frag {
        path = '/frags/accounts.html'
        hook = {
            build (f) {
                // loop and append each account
                // as a link with the site as text
                el.modify('.accounts', el => {
                    for (let site in config.accounts) {
                        let a = document.createElement('a');
                        a.href = 'https://' + config.accounts[site].url;
                        a.appendChild(document.createTextNode(site));
                        
                        el.appendChild(a);
                    }
                }, f.frag);
            }
        }
    }

    class Page404 extends Page {
        static href = '/404'
        //static hidden = true
        path = '/pages/404.html'
    }

    /**
     * fisher-yates array shuffling
     * @param {array} array - array to shuffle
     * @returns 
     */
    const shuffle = (array) => {
        if (array.constructor === Array) {
            for (let i = array.length - 1 ; i > 0 ; i--) {
                const rand = Math.floor(Math.random() * (i + 1));
                const temp = array[i];
                array[i] = array[rand];
                array[rand] = temp;
            }
        }
        return array
    };

    class FragTitle extends Frag {
        static title  = 'bugflug'.split('')
        static colors = shuffle([
            '#ff306c',
            '#ad005f',
            '#e04f0b',
            '#ffa200',
            '#ffe74c',
            '#ebffd4',
            '#48ff00',
            '#00cf2d',
            '#31d4e0',
            '#006ec2',
            '#1629f7',
            '#450073',
            '#8e1cc7',
            '#f018f0'
        ])

        path = '/frags/title.html'

        constructor () {
            // guarantee enough colors
            while (FragTitle.colors.length < FragTitle.title.length) FragTitle.colors = shuffle(FragTitle.colors.concat(FragTitle.colors));
            // prevent back to back repeats
            let last;
            FragTitle.colors.filter(c => {
                let t = (!(c === last));
                last = c;
                return t
            });

            super();
        }

        hook = {
            build (f) {
                // create a span of colored characters in the title
                el.modify('.title', el => {
                    // color loop index
                    let index = 0;
                    // stagger the animations
                    let delay = 0;

                    // append each char as a span
                    FragTitle.title.forEach(char => {
                        let span = document.createElement('span');
                        span.appendChild(document.createTextNode(char));
            
                        // apply random colors
                        span.style.color = FragTitle.colors[index];
                        index++;
        
                        // stagger the animations
                        span.style.animationDelay = delay + 's';
                        delay += 0.3;
            
                        el.appendChild(span);
                    });
                }, f.frag);
            }
        }
    }

    class PageHome extends Page {
        static href = '/'
        static name = 'home'
        //static hidden = true

        path  = '/pages/home.html'
        frags = {
            'title'   : FragTitle,
            'accounts': FragAccounts,
            'pages'   : FragPages
        }

        hook = {
            mounted (_) {
                const streamWrapper = document.querySelector('#stream-wrapper');
                const streamContainer = document.querySelector('#stream');
            
                // embed a twitch stream
                const player = new Twitch.Player('stream', {
                    channel: config.accounts.twitch.name,
                    width: 1280,
                    height: 720,
                    muted: 'true'
                });
            
                // wait for the proper responses to show/hide
                player.addEventListener(Twitch.Player.READY, () => {
                    player.addEventListener(Twitch.Player.ONLINE, () => {
                        player.addEventListener(Twitch.Player.PLAYING, () => {
                            player.setVolume(0.2);
                            player.setMuted(false);
                            streamWrapper.classList.remove('hidden');
                            streamWrapper.classList.add('show');
                        });
                    });
                    player.addEventListener(Twitch.Player.OFFLINE, () => {
                        streamContainer.innerHTML = '';
                    });
                });
            }
        }
    }

    const routes = [
        Page404,
        PageHome
    ];

    class FragPages extends Frag {
        path = '/frags/pages.html'
        hook = {
            build (f) {
                // loop and append each page
                // as a link with the name as text
                el.modify('.pages', el => {
                    routes.forEach(r => {
                        let a = document.createElement('a');
                        a.href = r.href;
                        a.appendChild(document.createTextNode(r.name || r.href));
                        a.addEventListener('click', event => router.route(event));
                        
                        el.appendChild(a);
                    });
                }, f.frag);
            }
        }
    }

    class FragSidebar extends Frag {
        static instances = []
        static show () {
            FragSidebar.instances.forEach(f => 
                el.modify(
                    '.sidebar:not(.show)',
                    el => el.classList.add('show'),
                    f.frag || f.parent
            ));
        }
        static hide () {
            FragSidebar.instances.forEach(f =>
                el.modify(
                    '.sidebar.show',
                    el => el.classList.remove('show'),
                    f.frag || f.parent
            ));
        }

        path = '/frags/sidebar.html'
        frags = {
            'accounts': FragAccounts,
            'pages'   : FragPages,
            'title'   : FragTitle
        }
        hook = {
            mounted (f) {
                FragSidebar.instances.push(f);
            },
            unmounted (f) {
                FragSidebar.instances.splice(this.instances.indexOf(f, 1));
            }
        }
    }

    const init = () => {
        // if the doc isnt ready yet, just execute when it is
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return
        }

        // make our info bar
        new FragSidebar()
            .target('body', 'sidebar')
            .build()
            .then(f => {
                f.mount();
                //FragSidebar.show()
            });

        // route to the url
        new Router(routes)
            .target('main', 'view')
            .update();
    } ; init();

})();
