(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{190:function(t,s,n){"use strict";n.r(s);var e=n(0),a=Object(e.a)({},function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("div",{staticClass:"content"},[t._m(0),n("div",{staticClass:"danger custom-block"},[n("p",{staticClass:"custom-block-title"},[t._v("WARNING")]),n("p",[t._v("Global events should be used only as a last resort when working with "),n("router-link",{attrs:{to:"./store.html"}},[t._v("the store")]),t._v(" or regular Vue events between child and parent components doesn't work for your usecase.")],1)]),t._m(1),t._m(2),t._m(3),t._m(4),t._m(5),t._m(6),t._m(7)])},[function(){var t=this.$createElement,s=this._self._c||t;return s("h1",{attrs:{id:"events"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#events","aria-hidden":"true"}},[this._v("#")]),this._v(" Events")])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[this._v("The Directus app has a global event-bus you can use to send messages across the system. Right now, the only global event that's being used in this fashion is "),s("code",[this._v("error")]),this._v(".")])},function(){var t=this.$createElement,s=this._self._c||t;return s("h2",{attrs:{id:"usage"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#usage","aria-hidden":"true"}},[this._v("#")]),this._v(" Usage")])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[this._v("The EventBus can be imported directly from the "),s("code",[this._v("./events/index.js")]),this._v(" file, or can be used in "),s("code",[this._v("this.$events")]),this._v(".")])},function(){var t=this,s=t.$createElement,n=t._self._c||s;return n("div",{staticClass:"language-js extra-class"},[n("pre",{pre:!0,attrs:{class:"language-js"}},[n("code",[n("span",{attrs:{class:"token keyword"}},[t._v("import")]),t._v(" EventBus "),n("span",{attrs:{class:"token keyword"}},[t._v("from")]),t._v(" "),n("span",{attrs:{class:"token string"}},[t._v('"./events/"')]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\nEventBus"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("on")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token string"}},[t._v('"event"')]),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" handlerFunction"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\nEventBus"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("off")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token string"}},[t._v('"event"')]),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" handlerFunction"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\nEventBus"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("once")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token string"}},[t._v('"event"')]),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" handlerFunction"),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n\nEventBus"),n("span",{attrs:{class:"token punctuation"}},[t._v(".")]),n("span",{attrs:{class:"token function"}},[t._v("emit")]),n("span",{attrs:{class:"token punctuation"}},[t._v("(")]),n("span",{attrs:{class:"token string"}},[t._v('"event"')]),n("span",{attrs:{class:"token punctuation"}},[t._v(",")]),t._v(" "),n("span",{attrs:{class:"token string"}},[t._v('"value"')]),n("span",{attrs:{class:"token punctuation"}},[t._v(")")]),n("span",{attrs:{class:"token punctuation"}},[t._v(";")]),t._v("\n")])])])},function(){var t=this.$createElement,s=this._self._c||t;return s("h2",{attrs:{id:"creating-a-new-global-event"}},[s("a",{staticClass:"header-anchor",attrs:{href:"#creating-a-new-global-event","aria-hidden":"true"}},[this._v("#")]),this._v(" Creating a new global event")])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[this._v("You should put all event handlers in the "),s("code",[this._v("/events")]),this._v(" folder and put all "),s("code",[this._v("EventBus.on")]),this._v(" statements in "),s("code",[this._v("./events/index.js")]),this._v(". It's near impossible to keep track of all global events if you don't.")])},function(){var t=this.$createElement,s=this._self._c||t;return s("p",[this._v("If for whatever reason you need to listen to a global event from within a component, please add a note to the "),s("code",[this._v("./events/index.js")]),this._v(" file so we can keep track of when and why an event is used.")])}],!1,null,null,null);s.default=a.exports}}]);