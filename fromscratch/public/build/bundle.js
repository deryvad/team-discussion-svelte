function noop() { }
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function append(target, node) {
    target.appendChild(node);
}
function insert(target, node, anchor) {
    target.insertBefore(node, anchor || null);
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function element(name) {
    return document.createElement(name);
}
function text(data) {
    return document.createTextNode(data);
}
function space() {
    return text(' ');
}
function listen(node, event, handler, options) {
    node.addEventListener(event, handler, options);
    return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
    if (value == null)
        node.removeAttribute(attribute);
    else if (node.getAttribute(attribute) !== value)
        node.setAttribute(attribute, value);
}
function children(element) {
    return Array.from(element.childNodes);
}
function set_data(text, data) {
    data = '' + data;
    if (text.wholeText !== data)
        text.data = data;
}
function set_input_value(input, value) {
    input.value = value == null ? '' : value;
}

let current_component;
function set_current_component(component) {
    current_component = component;
}

const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
// flush() calls callbacks in this order:
// 1. All beforeUpdate callbacks, in order: parents before children
// 2. All bind:this callbacks, in reverse order: children before parents.
// 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
//    for afterUpdates called during the initial onMount, which are called in
//    reverse order: children before parents.
// Since callbacks might update component values, which could trigger another
// call to flush(), the following steps guard against this:
// 1. During beforeUpdate, any updated components will be added to the
//    dirty_components array and will cause a reentrant call to flush(). Because
//    the flush index is kept outside the function, the reentrant call will pick
//    up where the earlier call left off and go through all dirty components. The
//    current_component value is saved and restored so that the reentrant call will
//    not interfere with the "parent" flush() call.
// 2. bind:this callbacks cannot trigger new flush() calls.
// 3. During afterUpdate, any updated components will NOT have their afterUpdate
//    callback called a second time; the seen_callbacks set, outside the flush()
//    function, guarantees this behavior.
const seen_callbacks = new Set();
let flushidx = 0; // Do *not* move this inside the flush() function
function flush() {
    const saved_component = current_component;
    do {
        // first, call beforeUpdate functions
        // and update components
        while (flushidx < dirty_components.length) {
            const component = dirty_components[flushidx];
            flushidx++;
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        flushidx = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        // then, once components are updated, call
        // afterUpdate functions. This may cause
        // subsequent updates...
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                // ...so guard against infinite loops
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    seen_callbacks.clear();
    set_current_component(saved_component);
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
let outros;
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}
function create_component(block) {
    block && block.c();
}
function mount_component(component, target, anchor, customElement) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    if (!customElement) {
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
    }
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        // TODO null out other refs, including component.$$ (but need to
        // preserve final state?)
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        // state
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        // lifecycle
        on_mount: [],
        on_destroy: [],
        on_disconnect: [],
        before_update: [],
        after_update: [],
        context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
        // everything else
        callbacks: blank_object(),
        dirty,
        skip_bound: false,
        root: options.target || parent_component.$$.root
    };
    append_styles && append_styles($$.root);
    let ready = false;
    $$.ctx = instance
        ? instance(component, options.props || {}, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    // `false` as a special case of no DOM component
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor, options.customElement);
        flush();
    }
    set_current_component(parent_component);
}
/**
 * Base class for Svelte components. Used when dev=false.
 */
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

/* src\components\name.svelte generated by Svelte v3.46.4 */

function create_fragment$1(ctx) {
	let span0;
	let t0;
	let t1;
	let div0;
	let t2;
	let span1;
	let t3;
	let t4;
	let div1;
	let t5;
	let span2;
	let t6;
	let t7;
	let div2;
	let t8;
	let span3;
	let t9;

	return {
		c() {
			span0 = element("span");
			t0 = text(/*name*/ ctx[0]);
			t1 = space();
			div0 = element("div");
			t2 = text("The value of x is ");
			span1 = element("span");
			t3 = text(/*x*/ ctx[1]);
			t4 = space();
			div1 = element("div");
			t5 = text("The value of y is ");
			span2 = element("span");
			t6 = text(/*y*/ ctx[3]);
			t7 = space();
			div2 = element("div");
			t8 = text("The value of z is ");
			span3 = element("span");
			t9 = text(/*z*/ ctx[2]);
			attr(span0, "class", "svelte-1pcjc4c");
			attr(span1, "class", "svelte-1pcjc4c");
			attr(span2, "class", "svelte-1pcjc4c");
			attr(span3, "class", "svelte-1pcjc4c");
		},
		m(target, anchor) {
			insert(target, span0, anchor);
			append(span0, t0);
			insert(target, t1, anchor);
			insert(target, div0, anchor);
			append(div0, t2);
			append(div0, span1);
			append(span1, t3);
			insert(target, t4, anchor);
			insert(target, div1, anchor);
			append(div1, t5);
			append(div1, span2);
			append(span2, t6);
			insert(target, t7, anchor);
			insert(target, div2, anchor);
			append(div2, t8);
			append(div2, span3);
			append(span3, t9);
		},
		p(ctx, [dirty]) {
			if (dirty & /*name*/ 1) set_data(t0, /*name*/ ctx[0]);
			if (dirty & /*x*/ 2) set_data(t3, /*x*/ ctx[1]);
			if (dirty & /*y*/ 8) set_data(t6, /*y*/ ctx[3]);
			if (dirty & /*z*/ 4) set_data(t9, /*z*/ ctx[2]);
		},
		i: noop,
		o: noop,
		d(detaching) {
			if (detaching) detach(span0);
			if (detaching) detach(t1);
			if (detaching) detach(div0);
			if (detaching) detach(t4);
			if (detaching) detach(div1);
			if (detaching) detach(t7);
			if (detaching) detach(div2);
		}
	};
}

function instance$1($$self, $$props, $$invalidate) {
	let x;
	let y;
	let z;
	let { name } = $$props;

	$$self.$$set = $$props => {
		if ('name' in $$props) $$invalidate(0, name = $$props.name);
	};

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*name*/ 1) {
			$$invalidate(1, x = name);
		}

		if ($$self.$$.dirty & /*name*/ 1) {
			$$invalidate(3, y = name);
		}

		if ($$self.$$.dirty & /*x*/ 2) {
			$$invalidate(2, z = x);
		}
	};

	return [name, x, z, y];
}

class Name extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { name: 0 });
	}
}

/* src\App.svelte generated by Svelte v3.46.4 */

function create_fragment(ctx) {
	let div;
	let span;
	let t1;
	let input;
	let t2;
	let h1;
	let t3;
	let name_1;
	let current;
	let mounted;
	let dispose;
	name_1 = new Name({ props: { name: /*name*/ ctx[0] } });

	return {
		c() {
			div = element("div");
			span = element("span");
			span.textContent = "Name:";
			t1 = space();
			input = element("input");
			t2 = space();
			h1 = element("h1");
			t3 = text("Hello ");
			create_component(name_1.$$.fragment);
			attr(input, "type", "text");
			attr(input, "palceholder", "Type the name");
			attr(h1, "class", "svelte-hguanb");
		},
		m(target, anchor) {
			insert(target, div, anchor);
			append(div, span);
			append(div, t1);
			append(div, input);
			set_input_value(input, /*name*/ ctx[0]);
			insert(target, t2, anchor);
			insert(target, h1, anchor);
			append(h1, t3);
			mount_component(name_1, h1, null);
			current = true;

			if (!mounted) {
				dispose = listen(input, "input", /*input_input_handler*/ ctx[1]);
				mounted = true;
			}
		},
		p(ctx, [dirty]) {
			if (dirty & /*name*/ 1 && input.value !== /*name*/ ctx[0]) {
				set_input_value(input, /*name*/ ctx[0]);
			}

			const name_1_changes = {};
			if (dirty & /*name*/ 1) name_1_changes.name = /*name*/ ctx[0];
			name_1.$set(name_1_changes);
		},
		i(local) {
			if (current) return;
			transition_in(name_1.$$.fragment, local);
			current = true;
		},
		o(local) {
			transition_out(name_1.$$.fragment, local);
			current = false;
		},
		d(detaching) {
			if (detaching) detach(div);
			if (detaching) detach(t2);
			if (detaching) detach(h1);
			destroy_component(name_1);
			mounted = false;
			dispose();
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let name = 'World';

	function input_input_handler() {
		name = this.value;
		$$invalidate(0, name);
	}

	return [name, input_input_handler];
}

class App extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, {});
	}
}

new App({
	target: document.body
});
//# sourceMappingURL=bundle.js.map
