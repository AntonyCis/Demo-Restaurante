/**
 * Sabor Quiteño — motion port implementation
 */
export function createMotion({ window: win }) {
  const reduced = win.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let registered = false;

  const hasGsap = () => Boolean(win.gsap && win.ScrollTrigger);
  const guard = (fn) => (...args) => {
    if (reduced || !hasGsap()) return;
    return fn(...args);
  };

  return {
    reduced,
    get available() {
      return hasGsap();
    },
    register() {
      if (registered || !hasGsap()) return;
      registered = true;
      win.gsap.registerPlugin(win.ScrollTrigger);
    },
    to: guard((target, vars) => win.gsap.to(target, vars)),
    from: guard((target, vars) => win.gsap.from(target, vars)),
    scrub: guard((target, { trigger, start, end, from, ease, refresh }) => {
      win.gsap.to(target, { ...from, ease, scrollTrigger: { trigger, start, end, scrub: refresh ?? 1.2 } });
    }),
    onEnter: guard((targets, { start, once = true, onEnter }) => {
      // ScrollTrigger hands its own instance to onEnter, so the element is
      // bound here instead of leaking GSAP internals into the caller.
      const list = win.gsap.utils.toArray(targets);
      for (const element of list) {
        win.ScrollTrigger.create({ trigger: element, start, once, onEnter: () => onEnter(element) });
      }
    }),
    revealOnScroll: guard((targets, { start, once = true, from }) => {
      // One trigger per element, and `from` keeps immediateRender on so the
      // heading starts hidden instead of flashing before it animates in.
      const list = win.gsap.utils.toArray(targets);
      for (const element of list) {
        win.gsap.from(element, { ...from, scrollTrigger: { trigger: element, start, once } });
      }
    }),
    timeline: (defaults) => {
      const tl = win.gsap?.timeline(defaults) ?? null;
      return {
        to: guard((target, vars, position) => tl?.to(target, vars, position)),
        from: guard((target, vars, position) => tl?.from(target, vars, position)),
      };
    },
  };
}
