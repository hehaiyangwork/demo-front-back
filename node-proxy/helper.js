module.exports = {

  var blocks = Object.create(null);

  partial: function(name, context) {
      var block = blocks[name];
      if (!block) {
          block = blocks[name] = [];
      }

      block.push(context.fn(this));
  });

  block: function(name) {
      var val = (blocks[name] || []).join('\n');

      // clear the block
      blocks[name] = [];
      return val;
  });

  json: function(json, options) {
    return JSON.stringify(json);
  },

  equals: function(a, b, options) {
    if ((a != null ? a.toString() : void 0) === (b != null ? b.toString() : void 0)) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },

};
//
// module.exports = (a) = > {
// 	a.registerHelper('withPerm', function(b, c) {
// 		if (null == b || '' === b.trim()) return c.fn(this);
// 		const d = c.data.root._USER_AUTH_;
// 		if (null == d) return c.inverse(this);
// 		const e = b.split(',');
// 		return e.some((f) = > -1 < d.resources.indexOf(f.trim())) ? c.fn(this) : c.inverse(this)
// 	}), a.registerHelper('hasRole', function(b, c) {
// 		if (null == b || '' === b.trim()) return c.fn(this);
// 		const d = c.data.root._USER_AUTH_;
// 		if (null == d) return c.inverse(this);
// 		const e = d.roles.map((i) = > i.base), f = (d.dynamicRoles || []).map((i) = > i.base), g = e.concat(f), h = b.split(',');
// 		return h.some((i) = > -1 < g.indexOf(i.trim())) ? c.fn(this) : c.inverse(this)
// 	})
// };
